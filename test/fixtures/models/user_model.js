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
        type: DataTypes.STRING
      }
    };
  }
}

export default UserModel;
