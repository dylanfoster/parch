"use strict";

import Controller from "../../../../../src/controller";

export default class CreateController extends Controller {
  model(req, res, next) {
    res.send(200, []);
  }
}
