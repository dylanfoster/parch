"use strict";

import path from "path";

import callsite from "callsite";
import includeAll from "include-all";

import Logger from "./logger";
import Registry from "./registry";

const DEFAULT_CONNECTION_SETTINGS = {
  dialect: "sqlite",
  database: "test",
  username: "test",
  password: "test"
};
const DEFAULT_LISTEN_PORT = 3000;

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

    this._initialize("server");
    this._initialize("loaders");
    this._initialize("model-manager");
    this._initialize("models");
    this._initialize("middleware");
    this._initialize("router");
    this._initialize("application");
  }

  /**
   * Get the restify application instance
   *
   * @method getApp
   * @todo: deprecate
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

  _initialize(name) {
    const initializers = includeAll({
      dirname: __dirname
    }).initializers;

    // TODO: throw an error if the initializer is missing
    const [initializer] = Object.keys(initializers).filter(
      init => initializers[init].name === name
    );

    return initializers[initializer].initialize(this, this.registry);
  }
}

export default Application;
