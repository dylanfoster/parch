"use strict";

import Model from "../../../src/model";

class UserModel extends Model {
  constructor() {
    super();
  }

  associate(User, models) {
    User.hasMany(models.User);
  }

  define(DataTypes) {
    return {
      firstName: {
        type: DataTypes.STRING,
        validate: {
          is: {
            args: ["^[a-z]+$",'i'],
            msg: "firstName must be a valid string"
          }
        }
      }
    };
  }
}

export default UserModel;
