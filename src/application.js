"use strict";

import restify from "restify";

import _ from "lodash";
import Loader from "./loader";
import Router from "./router";

const DEFAULT_MIDDLEWARES = [
  restify.gzipResponse(),
  restify.CORS(),
  restify.authorizationParser(),
  restify.bodyParser(),
  restify.fullResponse(),
  restify.queryParser()
];

/**
 * TODO:
 *   - add DEFAULT_CONTROLLER_LOOKUP_PATH
 *     - should be <caller location>/contrllers
 */

class Application {
  constructor(options = {}) {
    const serverOptions = options.server || {};

    // TODO: merge with defaults
    const middlewares = _.union(DEFAULT_MIDDLEWARES, serverOptions.middlewares || []);
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

    app.use(restify.acceptParser(app.acceptable));
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
