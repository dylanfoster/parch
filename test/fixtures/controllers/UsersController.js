"use strict";

import Controller from "../../../src/controller";

class UsersController extends Controller {
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

  resetPassword(req, res, next) {
    res.send("OK");
  }
}

export default UsersController;
