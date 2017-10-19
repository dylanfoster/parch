"use strict";

import Model from "../../../src/model";

class PostModel extends Model {
  define(Types) {
    return {
      name: Types.STRING
    };
  }
}

export default PostModel;
