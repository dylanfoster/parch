"use strict";

import Model from "../../../src/model";

class FooModel extends Model {
  constructor() {
    super({
      classMethods: {
        getBaz() {
          return { name: "class" };
        }
      },
      instanceMethods: {
        getBaz() {
          return { name: "instance" };
        }
      }
    });
  }

  define(DataTypes) {
    return {
      type: {
        type: DataTypes.STRING
      }
    };
  }
}

export default FooModel;
