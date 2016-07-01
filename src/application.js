"use strict";

import path from "path";

import _ from "lodash";
import callsite from "callsite";
import restify from "restify";

import Loader from "./loader";
import Logger from "./logger";
import ModelManager from "./model_manager";
import Router from "./router";

const DEFAULT_CONNECTION_SETTINGS = {
  dialect: "sqlite",
  database: "test",
  username: "test",
  password: "test"
};
const DEFAULT_LISTEN_PORT = 3000;
const DEFAULT_MIDDLEWARES = [
  restify.gzipResponse(),
  restify.CORS(),
  restify.authorizationParser(),
  restify.bodyParser(),
  restify.fullResponse(),
  restify.queryParser()
];

class Application {
  /* eslint-disable complexity */
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

    // TODO: add logger options
    options.server.log = options.server.log || Logger.create();
    options.server.middlewares = options.server.middlewares || [];

    const app = options.app || restify.createServer(options.server);
    const connection = options.database.connection;
    const controllerLoader = new Loader({
      type: "controller",
      path: options.controllers.dir
    });
    const middlewares = _.union(DEFAULT_MIDDLEWARES, options.server.middlewares);

    this._internalModels = new Loader({
      type: "model",
      path: options.database.models.dir
    });

    // TODO: this should be separate from log once we have logger options
    this.logger = options.server.log;
    this.modelManager = new ModelManager({ connection });
    this._addModels();
    this._associateModels();

    const routerSettings = {
      app,
      loader: {
        controllers: controllerLoader,
        models: this.modelManager.models
      }
    };

    // TODO: move this DEFAULT_MIDDLEWARES
    app.use(restify.acceptParser(app.acceptable));

    // TODO: move these to an internal middleware
    app.use((req, res, next) => {
      this.logger.child({ reqID: req.getId() }).info({ req, res });
      req.log = this.logger.child({ reqID: req.getId() });
      next();
    });
    app.on("after", (req, res, route, err) => {
      req.log.info({ req, res, err });
    });
    middlewares.forEach(middlware => { app.use(middlware); });
    this.app = app;
    this.map = Router.map.bind(null, routerSettings);
  }

  getApp() {
    return this.app;
  }

  start(port = DEFAULT_LISTEN_PORT) {
    return new Promise((resolve, reject) => {
      this.app.listen(port, () => { resolve(); });
    });
  }

  _addModels() {
    const _internalModels = this._internalModels;

    Object.keys(_internalModels.modules).forEach(model => {
      this.modelManager.addModel(_internalModels.modules[model]);
    });
  }

  _associateModels() {
    const modelManager = this.modelManager;

    Object.keys(modelManager.models).forEach(model => {
      if (modelManager.models[model].associate) {
        modelManager.models[model].associate(modelManager.models[model], modelManager.models);
      }
    });
  }
}

export default Application;
