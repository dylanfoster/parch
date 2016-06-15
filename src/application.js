"use strict";

import restify from "restify";

import Loader from "./loader";
import Router from "./router";

class Application {
  constructor(options) {
    const app = options.app || restify.createServer();
    const routerSettings = {
      app,
      loader: {
        controllers: new Loader({ type: "controller", path: options.controllers.dir })
      }
    };

    this.app = app;
    this.map = Router.map.bind(null, routerSettings);
  }

  getApp() {
    return this.app;
  }

  start(port = 3000) {
    return new Promise((resolve, reject) => {
      this.app.listen(port, function () { resolve(); })
    });
  }
}

export default Application;
