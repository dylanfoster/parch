"use strict";

import Controller from "../../../../../src/controller";

export default class ShowController extends Controller {
  model(req, res, next) {
    res.send(200, []);
  }
}
