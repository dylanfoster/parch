"use strict";

import Controller from "../../../../src/controller";

export default class ListComment extends Controller {
  model(req, res, next) {
    res.send({
      comments: [{
        id: 1,
        name: "bar"
      }, {
        id: 2,
        name: "baz"
      }]
    });
    next();
  }
}
