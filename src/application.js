"use strict";

import path from "path";

import callsite from "callsite";
import includeAll from "include-all";

import Registry from "./registry";
import deprecate from "./utils/deprecate";

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
    const projectDirectory = this._getProjectDirectory();
    const registry = this.registry = new Registry();

    this.DEFAULT_CONTROLLER_LOOKUP_PATH = path.resolve(
      projectDirectory,
      "controllers"
    );
    this.DEFAULT_MODEL_LOOKUP_PATH = path.resolve(projectDirectory, "models");
    options = this._configure(options);

    registry.register("config:main", options);
    this._initialize("logger");
    this._initialize("server");
    this._initialize("loaders");
    this._initialize("model-manager");
    this._initialize("store");
    this._initialize("models");
    this._initialize("middleware");
    this._initialize("router");
    this._initialize("application");
  }

  /**
   * Get the restify application instance
   *
   * @method getApp
   * @deprecated
   * @return {Object} restify application instance
   */
  getApp() {
    deprecate(this, "getApp", "2.0.0");

    return this.registry.lookup("service:server");
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
   * Normalizes constructor options
   *
   * @method _configure
   * @private
   * @param {Object} config user passed config options
   * @returns {Object} final config option
   */
  _configure(config) {
    config.controllers = config.controllers || {};
    config.controllers.dir = config.controllers.dir || this.DEFAULT_CONTROLLER_LOOKUP_PATH;
    config.database = config.database || {};
    config.database.connection = config.database.connection || DEFAULT_CONNECTION_SETTINGS;
    config.database.models = config.database.models || {};
    config.database.models.dir = config.database.models.dir || this.DEFAULT_MODEL_LOOKUP_PATH;
    config.logging = config.logging || {};
    config.server = config.server || {};
    config.server.middlewares = config.server.middlewares || [];

    return config;
  }

  /**
   * Returns the project directory (cwd) from which Application is being instantiated
   *
   * @method _getProjectDirectory
   * @private
   * @returns {String} directory
   */
  _getProjectDirectory() {
    const caller = callsite()[2].getFileName();
    const projectDirectory = path.dirname(caller);

    return projectDirectory;
  }

  /**
   * Run an initializer by name
   *
   * @method _initialize
   * @private
   * @param {String} name
   */
  _initialize(name) {
    const initializers = includeAll({
      dirname: __dirname
    }).initializers;
    const logger = this.logger;

    // TODO: throw an error if the initializer is missing
    const [initializer] = Object.keys(initializers).filter(
      init => initializers[init].name === name
    );

    if (logger) {
      logger.info(`Running initializer '${name}'`);
    }

    return initializers[initializer].initialize(this, this.registry);
  }
}

export default Application;
