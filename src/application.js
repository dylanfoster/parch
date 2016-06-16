"use strict";

import restify from "restify";

import Loader from "./loader";
import Router from "./router";

/**
 * TODO:
 *   - add DEFAULT_CONTROLLER_LOOKUP_PATH
 *     - should be <caller location>/contrllers
 */

class Application {
  constructor(options = {}) {
    const serverOptions = options.server || {};

    // TODO: merge with defaults
    const middlewares = serverOptions.middlewares || [];
    const app = options.app || restify.createServer(serverOptions);
    const controllerLoader = new Loader({
      type: "controller",
      path: options.controllers.dir // || DEFAULT_CONTROLLER_LOOKUP_PATH
    });
    const routerSettings = {
      app,
      loader: {
        controllers: controllerLoader
      }
    };

    middlewares.forEach(middlware => { app.use(middlware); });
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
