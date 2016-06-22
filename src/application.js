"use strict";

import restify from "restify";

import _ from "lodash";
import Loader from "./loader";
import ModelManager from "./model_manager";
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
 *   - add DEFAULT_MODEL_LOOKUP_PATH
 *     - should start with .sequelizerc
 *     - fallback to <caller location>/models
 */

class Application {
  constructor(options = {}) {
    const serverOptions = options.server || {};
    const connection = options.database.connection;
    const modelManager = new ModelManager({ connection });
    const _internalModels = new Loader({
      type: "model",
      path: options.database.models.dir // || DEFAULT_MODEL_LOOKUP_PATH
    });
    const middlewares = _.union(DEFAULT_MIDDLEWARES, serverOptions.middlewares || []);
    const app = options.app || restify.createServer(serverOptions);
    const controllerLoader = new Loader({
      type: "controller",
      path: options.controllers.dir // || DEFAULT_CONTROLLER_LOOKUP_PATH
    });

    Object.keys(_internalModels.modules).forEach(model => {
      modelManager.addModel(_internalModels.modules[model]);
    });

    Object.keys(modelManager.models).forEach(model => {
      if (modelManager.models[model].associate) {
        modelManager.models[model].associate(modelManager.models[model], modelManager.models);
      }
    });

    const routerSettings = {
      app,
      loader: {
        controllers: controllerLoader,
        models: modelManager.models
      }
    };

    app.use(restify.acceptParser(app.acceptable));
    middlewares.forEach(middlware => { app.use(middlware); });
    this.app = app;
    this.map = Router.map.bind(null, routerSettings);
    this.modelManager = modelManager;
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
