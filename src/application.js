"use strict";

import path from "path";

import _ from "lodash";
import callsite from "callsite";
import restify from "restify";
import jwt from "restify-jwt";

import Loader from "./loader";
import Logger from "./logger";
import ModelManager from "./model_manager";
import Router from "./router";
import context from "./middleware/context";
import logger from "./middleware/logger";

const DEFAULT_CONNECTION_SETTINGS = {
  dialect: "sqlite",
  database: "test",
  username: "test",
  password: "test"
};
const DEFAULT_JWT_SECRET = "secret";
const DEFAULT_LISTEN_PORT = 3000;
const DEFAULT_MIDDLEWARES = [
  restify.gzipResponse(),
  restify.CORS(),
  restify.authorizationParser(),
  restify.bodyParser(),
  restify.fullResponse(),
  restify.queryParser()
];

/**
 * Base application
 *
 * @module parch
 * @class Application
 */
class Application {
  /* eslint-disable complexity */

  /**
   * @constructor
   *
   * @param options = {}
   * @returns {undefined}
   */
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
    options.logging = options.logging || {};
    options.server = options.server || {};

    options.server.log = options.server.log || Logger.create(null, options.logging);
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

    app.use(restify.acceptParser(app.acceptable));

    if (options.authentication) {
      let secret, unless;

      if (_.isObject(options.authentication)) {
        secret = options.authentication.secretKey || DEFAULT_JWT_SECRET;
        unless = options.authentication.unauthenticated || null;
      } else {
        secret = DEFAULT_JWT_SECRET;
        unless = [];
      }

      app.use(jwt({ secret }).unless({ path: unless }));
    }

    app.use(logger({ log: this.logger }));
    app.on("after", (req, res, route, err) => {
      req.log.info({ req, res, err });
    });
    middlewares.forEach(middlware => { app.use(middlware); });
    app.use(context(this));
    this.app = app;
    this.map = Router.map.bind(null, routerSettings);
  }

  /**
   * Get the restify application instance
   *
   * @method getApp
   *
   * @returns {Object} restify application instance
   */
  getApp() {
    return this.app;
  }

  /**
   * starts listening on the defined port
   *
   * @method start
   * @param {Number} port the port to listen on. Default: 3000
   * @returns {Promise<undefined, Error>}
   */
  start(port = DEFAULT_LISTEN_PORT) {
    return new Promise((resolve, reject) => {
      this.app.listen(port, () => { resolve(); });
    });
  }

  /**
   * loads the models into the model manager
   *
   * @private
   * @method _addModels
   */
  _addModels() {
    const _internalModels = this._internalModels;

    Object.keys(_internalModels.modules).forEach(model => {
      this.modelManager.addModel(_internalModels.modules[model]);
    });
  }

  /**
   * runs associations for each model
   *
   * @private
   * @method _associateModels
   */
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
