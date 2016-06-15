"use strict";

class FooController {
  constructor() {
  }

  index(req, res, next) {
    res.send({ foos: [] });
  }

  show() {
  }

  create() {
  }

  update() {}

  destroy() {}
}

export default FooController;
