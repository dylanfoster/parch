"use strict";

import Controller from "../../../src/controller";

class PostsController extends Controller {
  index(req, res, next) {
    res.send("ok");
  }

  show(req, res, next) {
  }

  create(req, res, next) {
  }

  update(req, res, next) {
  }

  destroy(req, res, next) {
  }
}

export default PostsController;
