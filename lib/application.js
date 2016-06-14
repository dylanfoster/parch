"use strict";

const Router = require("./router");

class Application {
  constructor(options) {
    this.map = Router.map;
  }
}

module.exports = Application;
