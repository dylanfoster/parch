"use strict";

import Model from "../../../src/model";

class CommentModel extends Model {
  define(Types) {
    return {
      name: Types.STRING
    };
  }
}

export default CommentModel;
