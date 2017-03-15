"use strict";

import Controller from "../../../src/controller";

const foos = [{
  id: 1,
  name: "bar"
}, {
  id: 2,
  name: "baz"
}];

class FooController extends Controller {
  constructor(settings) {
    super(settings);

    this.hooks = {
      index: {
        before: this.beforeIndex,
        after: this.afterIndex
      },
      show: {
        before: this.beforeShow,
        after: this.afterShow
      },
      create: {
        before: this.beforeCreate,
        after: this.afterCreate
      },
      update: {
        before: this.beforeUpdate,
        after: this.afterUpdate
      },
      destroy: {
        before: this.beforeDestroy,
        after: this.afterDestroy
      },
      bar: {
        before: this.beforeBar,
        after: this.afterBar
      }
    };
  }

  beforeIndex(req, res, next) {
    this.hooks.index.before.called = true;
    next();
  }

  afterIndex(req, res, next) {
    this.hooks.index.after.called = true;
    next();
  }

  beforeShow(req, res, next) {
    this.hooks.show.before.called = true;
    next();
  }

  afterShow(req, res, next) {
    this.hooks.show.after.called = true;
    next();
  }

  beforeCreate(req, res, next) {
    this.hooks.create.before.called = true;
    next();
  }

  afterCreate(req, res, next) {
    this.hooks.create.after.called = true;
    next();
  }

  beforeUpdate(req, res, next) {
    this.hooks.update.before.called = true;
    next();
  }

  afterUpdate(req, res, next) {
    this.hooks.update.after.called = true;
    next();
  }

  beforeDestroy(req, res, next) {
    this.hooks.destroy.before.called = true;
    next();
  }

  afterDestroy(req, res, next) {
    this.hooks.destroy.after.called = true;
    next();
  }

  beforeBar(req, res, next) {
    this.hooks.bar.before.called = true;
    next();
  }

  afterBar(req, res, next) {
    this.hooks.bar.after.called = true;
    next();
  }

  index(req, res, next) {
    res.send({ foos });
    next();
  }

  show(req, res, next) {
    const foo = foos.filter(f => f.id === Number(req.params.fooId));

    if (foo) {
      res.send({ foo: foo[0] });
    } else {
      res.send(404);
    }

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

  baz(req, res, next) {
    res.send(200, { baz: "qux" });
    next();
  }

  qux(req, res, next) {
    res.send(200, { qux: "quux" });
    next();
  }
}

export default FooController;
