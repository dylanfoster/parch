"use strict";

import path from "path";

import _ from "lodash";
import callsite from "callsite";
import restify from "restify";

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

const DEFAULT_CONNECTION_SETTINGS = {
  dialect: "sqlite",
  database: "test",
  username: "test",
  password: "test"
};

class Application {
  constructor(options = {}) {
    // who are you
    const caller = callsite()[1].getFileName();
    const callerDirectory = path.dirname(caller);
    const DEFAULT_CONTROLLER_LOOKUP_PATH = path.resolve(callerDirectory, "controllers");
    const DEFAULT_MODEL_LOOKUP_PATH = path.resolve(callerDirectory, "models");

    options.controllers = options.controllers || {};
    options.controllers.dir = options.controllers.dir || DEFAULT_CONTROLLER_LOOKUP_PATH;
    options.database = options.database || {};
    options.database.connection = options.database.connection || DEFAULT_CONNECTION_SETTINGS;
    options.database.models = options.database.models || {};
    options.database.models.dir = options.database.models.dir || DEFAULT_MODEL_LOOKUP_PATH;
    options.server = options.server || {};
    options.server.middlewares = options.server.middlewares || [];

    const _internalModels = new Loader({
      type: "model",
      path: options.database.models.dir
    });
    const app = options.app || restify.createServer(options.server);
    const connection = options.database.connection;
    const controllerLoader = new Loader({
      type: "controller",
      path: options.controllers.dir
    });
    const middlewares = _.union(DEFAULT_MIDDLEWARES, options.server.middlewares);
    const modelManager = new ModelManager({ connection });

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
