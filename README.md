# parch

[![Build Status](https://travis-ci.org/dylanfoster/parch.svg?branch=master)](https://travis-ci.org/dylanfoster/parch)
[![Coverage Status](https://coveralls.io/repos/github/dylanfoster/parch/badge.svg?branch=develop)](https://coveralls.io/github/dylanfoster/parch?branch=develop)
[![bitHound Overall Score](https://www.bithound.io/github/dylanfoster/parch/badges/score.svg)](https://www.bithound.io/github/dylanfoster/parch)

> [Restify](http://restify.com/) + [Sequelize](http://docs.sequelizejs.com/en/latest/)

Parch is a simple RESTful framework combining the power of restify for routing
and sequelize ORM for dao access. Stop rewriting your server code and get parched.

** **WIP: parch is very much still in beta so use at your own risk** **

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
      logging: true
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

## Associations

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

Authentication and authorization is handled using [jwt](https://jwt.io/), with more options coming
in the future. To disable auth for specific routes, use the
`authentication.unauthenticated` array. Empty by default, you can add an entire controller,
or a controller's method.

```javascript
const parch = new parch.Application({
  authentication: {
    unauthenticated: [/\/posts[\s\S]*/, "/users/resetPassword"]
  }
});
```

## Static content

> TODO

## Logging

> TODO

## Error handling and responses

> TODO

## Options

  - **server**
  - **authentication**
  - **controllers**
  - **database**
  - **logging**
