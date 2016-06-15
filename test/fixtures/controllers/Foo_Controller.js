"use strict";

class FooController {
  constructor() {
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
}

export default FooController;
