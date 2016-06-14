# parch

> [Restify](http://restify.com/) + [Sequelize](http://docs.sequelizejs.com/en/latest/)

Parch is....

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
    secretKey: "ssshhh"
  },
  controllers: {
    dir: path.resolve(__dirname, "controllers"),
    unauthenticated: [/\/posts[\s\S]*/, "/users/resetPassword"]
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

*globally*

### Application

```javascript
const parch = new parch.Application({
  database: {
    associations: {
      lazyLoad: false
    }
  }
});
```

## Authentication and Authorization

Authentication and authorization is handled using [jwt](), with more options coming
in the future. To disable auth for controllers or their methods, use the
`controllers.unauthenticated` array. Empty by default, you can add an entire controller,
or a controller's method.

```javascript
const parch = new parch.Application({
  controllers: {
    unauthenticated: ["posts", "users:resetPassword"]
  }
});
```

## Static content

> TODO

## Logging

> TODO

## Options

  - **server**
  - **authentication**
  - **controllers**
  - **database**
  - **logging**
