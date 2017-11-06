"use strict";

import Controller from "../../../../src/controller";

export default class CreateComment extends Controller {
  model(req, res, next) {
    res.send(201);
    next();
  }
}
