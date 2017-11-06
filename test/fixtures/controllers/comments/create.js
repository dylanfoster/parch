"use strict";

import Controller from "../../../../src/controller";

export default class CreateComment extends Controller {
  beforeModel(req, res, next) {
    this.beforeModel.called = true;
    next();
  }

  model(req, res, next) {
    res.send(201);
    next();
  }

  afterModel(req, res, next) {
    this.afterModel.called = true;
    next();
  }
}
