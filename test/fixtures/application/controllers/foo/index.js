"use strict";

import Controller from "../../../../../src/controller";

export default class IndexController extends Controller {
  model(req, res, next) {
    res.send(200, []);
  }
}
