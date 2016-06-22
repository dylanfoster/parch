"use strict";

import Model from "../../../src/model";

class FooModel extends Model {
  constructor() {
    super();
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
