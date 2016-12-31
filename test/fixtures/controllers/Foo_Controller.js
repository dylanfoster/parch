"use strict";

import Controller from "../../../src/controller";

class FooController extends Controller {
  constructor(settings) {
    super(settings);

    this.hooks = {
      index: {
        before(req, res, next) {
          this.hooks.index.before.called = true;
          next();
        },
        after(req, res, next) {
          this.hooks.index.after.called = true;
          next();
        }
      },
      show: {
        before(req, res, next) {
          this.hooks.show.before.called = true;
          next();
        },
        after(req, res, next) {
          this.hooks.show.after.called = true;
          next();
        }
      },
      create: {
        before(req, res, next) {
          this.hooks.create.before.called = true;
          next();
        },
        after(req, res, next) {
          this.hooks.create.after.called = true;
          next();
        }
      },
      update: {
        before(req, res, next) {
          this.hooks.update.before.called = true;
          next();
        },
        after(req, res, next) {
          this.hooks.update.after.called = true;
          next();
        }
      },
      destroy: {
        before(req, res, next) {
          this.hooks.destroy.before.called = true;
          next();
        },
        after(req, res, next) {
          this.hooks.destroy.after.called = true;
          next();
        }
      }
    };
  }

  index(req, res, next) {
    res.send({ foos: [] });
    next();
  }

  show(req, res, next) {
    res.send({ foo: {}});
    next();
  }

  create(req, res, next) {
    res.send(201);
    next();
  }

  update(req, res, next) {
    res.send(200);
    next();
  }

  destroy(req, res, next) {
    res.send(204);
    next();
  }

  bar(req, res, next) {
    res.send(200);
    next();
  }
}

export default FooController;
