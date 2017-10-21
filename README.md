# parch

[![Build Status](https://travis-ci.org/dylanfoster/parch.svg?branch=master)](https://travis-ci.org/dylanfoster/parch)
[![Coverage Status](https://coveralls.io/repos/github/dylanfoster/parch/badge.svg?branch=develop)](https://coveralls.io/github/dylanfoster/parch?branch=develop)
[![bitHound Overall Score](https://www.bithound.io/github/dylanfoster/parch/badges/score.svg)](https://www.bithound.io/github/dylanfoster/parch)

> [Restify](http://restify.com/) + [Sequelize](http://docs.sequelizejs.com/en/latest/)

parch is a simple RESTful framework combining the power of restify for routing
and sequelize ORM for dao access. Stop rewriting your server code and get parched.

*If you'd like to contribute, take a look at the [roadmap](https://github.com/dylanfoster/parch/issues/1)*

## Installation

```bash
npm install --save parch
```

## Usage

- [Application](#application)
- [Router](#router)
  - [#resource](#resource)
  - [#route](#route)
  - [#namespace](#namespace)
- [Controller](#controller)
  - [hooks](#controller-hooks)
- [Model](#model)
- [Associations](#associations-wip)
- [Authentication](#authentication-and-authorization)
- [Application Initializers](#initializers)
- [Logging](#logging)
- [Error handling](#error-handling-and-responses)
  - [Error Codes](#errors)
  - [Responses](#responses)


### Application

For a full list of available options [see below](#options)

```javascript
const parch = require("parch");

// define your app
const parch = new parch.Application({
  authentication: {
    secretKey: "ssshhh",
    unauthenticated: [/\/posts[\s\S]*/, "/users/resetPassword"]
  },
  controllers: {
    dir: path.resolve(__dirname, "controllers")
  },
  database: {
    connection: {
      username: "postgres",
      password: "postgres",
      database: "postgres",
      host:  "localhost",
      dialect: "postgres",
      logging: false
    },
    models: {
      dir: path.resolve(__dirname, "models")
    }
  },
  initializers: {
    dir: path.resolve(__dirname, "controllers")
  },
  logging: {
    dir: path.resolve(__dirname, 'logs'),
    serializers: {
      req(req) {
        return {
          url: req.url
        }
      },
      res(res) {
        return {
          statusCode: res.statusCode
        }
      }
    }
  },
  namespace: "api",
  server: {
    name: "my-app",
    certificate: "/path/to/my.crt",
    key: "/path/to/my.key",
    log: Bunyan.createLogger(),
    middlewares: [
      restify.bodyParser(),
      restify.queryParser(),
      myCustomMiddleware()
    ]
  }
});

// wire up your routes
parch.map(function () {
  this.resource("user");
  this.route("user/resetPassword", {
    using: "users:resetPassword", // controller:method
    method: "post" // request method
  });
});

parch.start(3000).then(() => {
  console.log("App listening.")
});
```

The above will create the following route mapping

```
GET    /users               => UserController.index
GET    /users/:userId       => UserController.show
POST   /users               => UserController.create
PUT    /users/:userId       => UserController.update
DELETE /users/:userId       => UserController.destroy
POST   /users/resetPassword => UserController.resetPassword
```

### Router

The router handles route management and normalization, creating CRUD endpoints
for resources and normalizing all paths.

#### Resource

Use `resource` to generate a set of CRUD endpoints.

```javascript
app.map(function () {
  this.resource("user");
});

/**
 * GET    /users               => UserController.index
 * GET    /users/:userId       => UserController.show
 * POST   /users               => UserController.create
 * PUT    /users/:userId       => UserController.update
 * DELETE /users/:userId       => UserController.destroy
 */
```

#### Route

Use `route` to define a one off route.

```javascript
app.map(function () {
  this.route("/foos/bar", {
    using: "foo:getBar",
    method: "get"
  });
});

/**
 * GET /foos/bar => FooController.getBar
 */
```

#### Namespace

Use `namespace` to group a set of `routes` under a single base path. Namespace
takes an array of routes so follow the route api (with the addition of `path`)

```javascript
app.map(function () {
  this.namespace("users/:userId", [
    { path: "/account", using: "user:getAccount", method: "get" },
    { path: "/image", using: "user:setImage", method: "post" }
  ]);
});

/**
 * GET /users/:userId/account => UserController.getAccount
 * POST /users/:userId/image  => UserController.setImage
 */
```

### Controller

`lib/controllers/user_controller.js`

```javascript
const parch = require("parch");

class UserController extends parch.Controller {
  constructor(options) {
    super(options);
  }

  index(req, res, next) {
    this.findAll(req.query).then(records => {
      /**
       * {
       *   users: [{
       *   ...
       *   }]
       * }
       */
       res.send(this.STATUS_CODES.SUCCESS, records);
    }).catch(next);
  }

  show(req, res, next) {
    this.findOne(req.params.id).then(record => {
      /**
       * {
       *   user: {
       *   ...
       *   }
       * }
       */
       res.send(this.STATUS_CODES.SUCCESS, record);
    }).catch(next);
  }

  create(req, res, next) {
    this.createRecord(req.body.user).then(record => {
      /**
       * {
       *   user: {
       *   ...
       *   }
       * }
       */
       res.send(this.STATUS_CODES.CREATED, record);
    }).catch(next);
  }

  update(req, res, next) {
    this.updateRecord(req.params.id, req.body).then(updatedRecord => {
      /**
       * {
       *   user: {
       *   ...
       *   }
       * }
       */
       res.send(this.STATUS_CODES.SUCCESS, record);
    }).catch(next);
  }

  destroy(req, res, next) {
    this.destroyRecord(req.params.id).then(() => {
      res.send(this.STATUS_CODES.NO_CONTENT);
    }).catch(next);
  }

  resetPassword(req, res, next) {
    this.findOne(req.params.id).then(record => {
      record.password = req.body.password;
      return record.save();
    }).then(record => {
      res.send(this.STATUS_CODES.SUCCESS);
    }).catch(next);
  }
}
```

### Controller Hooks

Controller hooks allow for pre and post processing of requests. Both before and
after hooks are supported as well as any additional methods added when using
`Controller#route` or `Controller#namespace`. When using the `after` hook, make
sure to call next after sending your response.

```javascript
class UserController extends parch.Controller {
  constructor(options) {
    super(options);

    this.hooks = {
      // The hook name must match the method
      index: {
        before(req, res, next) {
          return checkPermissions().then(() => {
            next();
          }).catch(next);
        },
        after(req, res, next) {
          req.log.child().info("post processing");
        }
      }
    };
  }

  index(req, res, next) {
    res.send(200);
    next();
  }
}
```

### Model

Models are defined following the [sequelize define](http://docs.sequelizejs.com/en/latest/docs/models-definition/)
pattern. [Options](http://docs.sequelizejs.com/en/v3/docs/models-definition/#expansion-of-models) for the model definition can be passed to the constructor's `super` call

`lib/models/user.js`

```javascript
class UserModel extends parch.Model {
  constructor() {
    super({
      classMethods: {
      },

      getterMethods: {
      },

      hooks: {
      },

      instanceMethods: {
      }
    });
  }

  associate(User, models) {
    User.hasMany(models.Posts);
    User.hasMany(models.User, { as: "Parent" });
  }

  define(DataTypes) {
    const user = {
      email: {
        type: DataTypes.STRING,
        validate: { isEmail: true }
      }
    };

    return user;
  }
}
```

## Associations [WIP]

parch loads associations of a record as an array of ids.

```javascript
class UserController extends parch.Controller {
  constructor() {
    super();
  }

  show(req, res, next) {
    this.findOne(req.params.id).then(user => {
      /**
       *  {
       *    user: {
       *      firstName: "John",
       *      posts: [1, 2, 3]
       *    }
       *  }
       */
    });
  }
}
```

## Authentication and Authorization

Authorization is handled using [jwt](https://jwt.io/), with more
options coming in the future. To disable auth for specific routes, use the
`authentication.unauthenticated` array. Empty by default, you can give a string
or regex expression to skip your unauthenticated routes

```javascript
const parch = new parch.Application({
  authentication: {
    unauthenticated: [/\/posts[\s\S]*/, "/users/resetPassword"]
  }
});
```

In order to authenticate a user, create and sign a JWT token to send back to the
client. The authorization middleware will then look for this token in the
`Authorization` header. [see jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)

```javascript
// lib/controllers/user_controller.js

const jwt = require("jsonwebtoken");

const config = require("../../config");

class UserController extends parch.Controller {
  constructor(settings) {
    super(settings);
  }

  authenticate(req, res, next) {
    this.model.findOne({ where: { email: req.body.email }}).then(user => {
      if (user) {
        const token = jwt.sign(user, config.secret);

        res.send(200, { token });
      } else {
        throw new this.errors.UnauthorizedError("email or password is invalid");
      }
    });
  }
}

module.exports = UserController;

...
// lib/app.js

app.map(function () {
  this.route("/users/authenticate", { using: "user:authenticate", method: "post" });
});
```

```bash
curl http://my-server.com/protectedRoute -H 'Authorization: Bearer <token>'
```

## Application Initializers

Initializers allow you to accmomplish many things during application boot.
Registering mixins, add custom application logic, and adding services can all be
done in an initializer and attached to the application instance. Parch will run
your initializers in alphanumeric order. This means that if you need to run them
in a specific order you should prefix them in a way that will accomplish that.


`your-app/lib/initializers/my-awesome-initializer.js`

```javascript
"use strict";

const Worker = require("../worker");

module.exports = {
  initialize(appInstance, registry) {
    appInstance.foo = "bar";

    app.worker = new Worker();
  },

  name: "my-awesome-initializer"
};
```

## Logging

Logging is handled automatically for you. All requests and responses will be logged
using a custom [Bunyan instance](https://github.com/dylanfoster/parch/blob/master/src/logger.js).

## Error handling and responses

### Errors

Error handling is done using [restify-errors](https://github.com/restify/errors).
When using controller helpers (`findAll`, `findOne`, etc) errors are handled
automatically for you. Just catch your Promise with `next` and parch will handle
the rest.

```javascript
show(req, res, next) {
  this.findOne(req.params.id).then(user => {
  }).catch(next);
}

/**
 * { code: "NotFound", message: "User with id '1' does not exist" }
 */
```

Errors handled by parch:

 - `findOne`:
   - `NotFound`: The record does not exist
 - `createRecord`:
   - `BadRequest`: Request body was missing or invalid
   - `UnprocessableEntity`: Model validations failed
 - `updateRecord`:
   - `BadRequest`: Request body was missing or invalid
   - `UnprocessableEntity`: Model validations failed
 - `destroyRecord`:
   - `NotFound`: The record does not exist

Need to handle your own errors? `controller.errors` contains all of [restify-errors](https://github.com/restify/errors)' errors

### Responses

Parch also helps you standardize on your response statuses. Using [controller.STATUS_CODES](https://github.com/dylanfoster/parch/blob/develop/src/utils/status_codes.js)
you'll never have to worry about which status to send.

```javascript
show(req, res, next) {
  res.send(this.STATUS_CODES.SUCCESS) // 200
}
```

## Options

  - **authentication**
    - `secretKey(String)`: A secret string used to sign JWT tokens
    - `unauthenticated(Array)`: an array of strings or regex patterns to skip authentication.
  - **controllers**
    - `dir(String)`: The path to your controllers directory. **Default**: `_dirname/controllers`
  - **database**
    - `connection(Object)` [Sequelize connection options](http://docs.sequelizejs.com/en/latest/docs/getting-started/)
    - `models`
      - `dir(String)`: The path to your models directory. **Default**: `__dirname/models`
  - **logging**
    - `dir(String)`: Path where logs should be saved
    - `serializers(Object)`:
      - `req(Function)`: your request serializer. takes the request as its only argument
      - `res(Function)`: your response serializer. takes the response as its only argument
  - **namespace**: Set the base namespace for all routes and resources (e.g. `api`)
  - **server** All options (*with the exception of `middlewares`*) are passed directly to [restify](http://restify.com/#creating-a-server)
    - `log`: defaults to parch's [bunyan instance](https://github.com/dylanfoster/parch/blob/master/src/logger.js) but can be overridden
    - `middlewares(Array)`: merged with parch's [default middlwares](https://github.com/dylanfoster/parch/blob/master/src/application.js#L24-L31)
