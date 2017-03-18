"use strict";

import Controller from "../../../src/controller";

class BarController extends Controller {
  index(req, res, next) {
    res.send({ bars: [] });
  }

  show(req, res, next) {
    res.send({ bar: {}});
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

module.exports = BarController;
