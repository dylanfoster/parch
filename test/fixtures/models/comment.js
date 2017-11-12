"use strict";

import Model from "../../../src/model";

class CommentModel extends Model {
  constructor() {
    super({
      classMethods: {
        get foo() {
          return "foo";
        }
      }
    });
  }

  define(Types) {
    return {
      name: Types.STRING
    };
  }
}

export default CommentModel;
