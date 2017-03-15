"use strict";

import path from "path";

import _ from "lodash";
import callsite from "callsite";
import includeAll from "include-all";
import inflect from "inflect";
import restify from "restify";
import jwt from "restify-jwt";

import Loader from "./loader";
import Logger from "./logger";
import Registry from "./registry";
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
   * @return {undefined}
   */
  constructor(options = {}) {
    // who are you
    const caller = callsite()[1].getFileName();
    const callerDirectory = path.dirname(caller);

    this.DEFAULT_CONTROLLER_LOOKUP_PATH = path.resolve(callerDirectory, "controllers");
    this.DEFAULT_MODEL_LOOKUP_PATH = path.resolve(callerDirectory, "models");
    options = this._configure(options);
    this.logger = options.server.log;
    const registry = this.registry = new Registry();

    registry.register("config:main", options);
    this._initialize("model-manager");
    this.modelManager = registry.lookup("service:model-manager");
    this._internalModels = new Loader({
      type: "model",
      path: options.database.models.dir
    });

    const app = options.app || restify.createServer(options.server);
    const controllerLoader = new Loader({
      type: "controller",
      path: options.controllers.dir
    });
    const middlewares = _.union(DEFAULT_MIDDLEWARES, options.server.middlewares);

    this._addModels();
    this._associateModels();

    const routerSettings = {
      app,
      loader: {
        controllers: controllerLoader,
        models: this.modelManager.models
      },
      namespace: options.namespace
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
   * @return {Object} restify application instance
   */
  getApp() {
    return this.app;
  }

  /**
   * starts listening on the defined port
   *
   * @method start
   * @param {Number} port the port to listen on. Default: 3000
   * @return {Promise<undefined, Error>}
   */
  start(port = DEFAULT_LISTEN_PORT) {
    return new Promise((resolve, reject) => {
      this.app.listen(port, () => { resolve(); });
    });
  }

  /**
   * Loads the models into the model manager using
   * {{#crossLink "ModelManager/addModel:method"}}ModelManager#addModel{{/crossLink}}
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

  _configure(config) {
    config.controllers = config.controllers || {};
    config.controllers.dir = config.controllers.dir || this.DEFAULT_CONTROLLER_LOOKUP_PATH;
    config.database = config.database || {};
    config.database.connection = config.database.connection || DEFAULT_CONNECTION_SETTINGS;
    config.database.models = config.database.models || {};
    config.database.models.dir = config.database.models.dir || this.DEFAULT_MODEL_LOOKUP_PATH;
    config.logging = config.logging || {};
    config.server = config.server || {};

    config.server.log = config.server.log || Logger.create("application", config.logging);
    config.server.middlewares = config.server.middlewares || [];

    return config;
  }

  _initialize(name, config) {
    const initializers = includeAll({
      dirname: __dirname
    }).initializers;
    const [initializer] = Object.keys(initializers).filter(
      init => initializers[init].name === name
    );

    return initializers[initializer].initialize(this.registry);
  }
}

export default Application;
