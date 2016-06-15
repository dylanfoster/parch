"use strict";

import restify from "restify";

import Loader from "./loader";
import Router from "./router";

class Application {
  constructor(options) {
    const app = restify.createServer();
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
}

export default Application;
