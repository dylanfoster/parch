"use strict";

import Controller from "../../../../src/controller";

export default class UpdateComment extends Controller {
  model(req, res, next) {
    res.end();
    next();
  }
}
