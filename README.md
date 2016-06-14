# sequelfy

> [Restify](http://restify.com/) + [Sequelize](http://docs.sequelizejs.com/en/latest/)

## Installation

```bash
npm install --save sequelfy
```

## Usage

### Application

For a full list of available options [see below](#options)

```javascript
const Sequelfy = require("sequelfy");
const restify = require("restify");

const sequelfy = new Sequelfy({
  app: {
    name: "my-app",
    certificate: "/path/to/my.crt",
    key: "/path/to/my.key",
    middlewares: [
      restify.bodyParser(),
      restify.queryParser(),
      myCustomMiddleware()
    ]
  },
  controllers: {
    dir: path.resolve(__dirname, "controllers"),
    unauthenticated: ["posts", "users:resetPassword"]
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
    associations: {
      lazyLoad: true,
      embedded: false
    }
  }
});

sequelfy.map(function () {
  this.resource("user");
  this.route("user/resetPassword", {
    using: "users:resetPassword", // controller:method
    method: "post" // request method
  });
});

sequelfy.start().then(() => {
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
const sequelfy = require("sequelfy");

class UserController extends sequelfy.Controller {
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

Models can be defined following the [sequelize define](http://docs.sequelizejs.com/en/latest/docs/models-definition/),
pattern, however, you must have a `define` method for each of your models.

`lib/models/user.js`

```javascript
class UserModel extends sequelfy.Model {
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

By default, sequelfy will lazy load associations of a record as an array of ids.
Association loading can be disabled by setting `lazyLoad` to false in your `associations`
options. Additionally, you can change it to allow for embedded associations rather
than ids, including the entire relationship's record within the source record.

*per controller*

### Controller

```javascript
class UserController extends sequelfy.Controller {
  constructor(options) {
    options.database.associations = {
      lazyLoad: true,
      embedded: true // default: false
    };
    super(options);
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
    });
  }
}
```

*globally*

### Application

```javascript
const sequelfy = new sequelfy({
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
const sequelfy = new sequelfy({
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

  - **app**
  - **controllers**
  - **database**
  - **authentication**
  - **logging**
