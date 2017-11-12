"use strict";

import Controller from "../../../../src/controller";

export default class ShowComment extends Controller {
  model(req, res, next) {
    res.send({
      foo: {
        id: 1,
        name: "bar"
      }
    });
    next();
  }
}
