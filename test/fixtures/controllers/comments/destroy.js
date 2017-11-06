"use strict";

import Controller from "../../../../src/controller";

export default class DestroyComment extends Controller {
  model(req, res, next) {
    res.send(204);
    next();
  }
}
