"use strict";

import restify from "restify";

import Router from "./router";

class Application {
  constructor(options) {
    const routerSettings = {
      app: restify.createServer()
    };

    this.map = Router.map.bind(null, routerSettings);
  }
}

export default Application;
