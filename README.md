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

### Application

For a full list of available options [see below](#options)

```javascript
const parch = require("parch");

// define your app
const parch = new parch.Application({
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
  },
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
POST   /users               => UserController.create
GET    /users               => UserController.index
GET    /users/:id           => UserController.show
PUT    /users/:id           => UserController.update
DELETE /users/:id           => UserController.destroy
POST   /users/resetPassword => UserController.resetPassword
```

### Controller

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
       res.send(this.statusCodes.SUCCESS, records);
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
       res.send(this.statusCodes.SUCCESS, record);
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
       res.send(this.statusCodes.CREATED, record);
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
       res.send(this.statusCodes.SUCCESS, record);
    }).catch(next);
  }

  destroy(req, res, next) {
    this.destroyRecord(req.params.id).then(() => {
      res.send(this.statusCodes.NO_CONTENT);
    }).catch(next);
  }

  resetPassword(req, res, next) {
    this.findOne(req.params.id).then(record => {
      record.password = req.body.password;
      return record.save();
    }).then(record => {
      res.send(this.statusCodes.SUCCESS);
    }).catch(next);
  }
}
```

### Model

Models are defined following the [sequelize define](http://docs.sequelizejs.com/en/latest/docs/models-definition/),
pattern.

`lib/models/user.js`

```javascript
class UserModel extends parch.Model {
  constructor() {
    super();
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
const jwt = require("jsonwebtoken");
const app = require("express")();

app.post("/login", function (req, res, next) {
  const token = jwt.sign({ userId: 1 }, "secret");

  res.send({ token });
});
```

```bash
curl http://my-server.com/protectedRoute -H 'Authorization: Bearer <token>'
```

## Static content

> TODO

## Logging

Logging is handled automatically for you. All requests and responses will be logged
using a custom [Bunyan instance](https://github.com/dylanfoster/parch/blob/master/src/logger.js).

## Error handling and responses

Error handling is done using [restify-errors](https://github.com/restify/errors).
When using controller helpers (`findAll`, `findOne`, etc) errors are handle automatically
for you. Just catch your Promise with `next` and parch will handle the rest.

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

## Options

  - **server** All options (*with the exception of `middlewares`*) are passed directly to [restify](http://restify.com/#creating-a-server)
    - `log`: defaults to parch's [bunyan instance](https://github.com/dylanfoster/parch/blob/master/src/logger.js) but can be overridden
    - `middlewares(Array)`: merged with parch's [default middlwares](https://github.com/dylanfoster/parch/blob/master/src/application.js#L21-L26)
  - **authentication**
    - `secretKey(String)`: A secret string used to sign JWT tokens
    - `unauthenticated(Array)`: an array of strings or regex patterns to skip authentication.
  - **controllers**
    - `dir(String)`: The path to your controllers directory. **Default**: `_dirname/controllers`
  - **database**
    - `connection(Object)` [Sequelize connection options](http://docs.sequelizejs.com/en/latest/docs/getting-started/)
    - `models`
      - `dir(String)`: The path to your models directory. **Default**: `__dirname/models`
