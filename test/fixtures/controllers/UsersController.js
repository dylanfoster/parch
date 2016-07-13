"use strict";

class UsersController {
  constructor() {
  }

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
