"use strict";

import Controller from "../../../src/controller";

class FooController extends Controller {
  constructor(settings) {
    super(settings);
  }

  index(req, res, next) {
    res.send({ foos: [] });
  }

  show(req, res, next) {
    res.send({ foo: {}});
  }

  create(req, res, next) {
    res.send(201);
  }

  update(req, res, next) {
    res.send(200);
  }

  destroy(req, res, next) {
    res.send(204);
  }

  bar(req, res, next) {
    res.send(200);
  }
}

export default FooController;
