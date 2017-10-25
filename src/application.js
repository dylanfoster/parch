"use strict";

import {
  dirname,
  resolve
} from "path";

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
 * @class Application
 * @constructor
 *
 * @param {Object} options Application config options
 * <a href="https://parch-js.github.io">
 *   See configuration
 * </a>
 */
class Application {
  /* eslint-disable complexity */
  constructor(options) {
    const projectDirectory = this._getProjectDirectory();
    const registry = this.registry = new Registry();

    this.DEFAULT_CONTROLLER_LOOKUP_PATH = resolve(
      projectDirectory,
      "controllers"
    );
    this.DEFAULT_INITIALIZERS_LOOKUP_PATH = resolve(
      projectDirectory,
      "initializers"
    );
    this.DEFAULT_MODEL_LOOKUP_PATH = resolve(projectDirectory, "models");
    this.DEFAULT_SERIALIZER_LOOKUP_PATH = resolve(
      projectDirectory,
      "serializers"
    );
    options = this._configure(options);

    registry.register("config:main", options);
    this._initialize("logger");
    this._initialize("server");
    this._initialize("loaders");
    this._initialize("model-manager");
    this._initialize("models");
    this._initialize("middleware");
    this._initialize("router");
    this._initialize("store");
    this._initialize("application");
  }

  /**
   * Get the restify application instance
   *
   * @method getApp
   * @deprecated use registry.lookup("service:server") instead
   * @return {Object} restify application instance
   */
  getApp() {
    deprecate(this, "getApp", "2.0.0");

    return this.registry.lookup("service:server");
  }

  listen(port) {
    return new Promise(done => {
      this.app.listen(port, () => done());
    });
  }

  runProjectInitializers() {
    const config = this.registry.lookup("config:main");
    const initializersPath = config.initializers.dir;
    const initializerModules = includeAll({
      dirname: initializersPath,
      filter: /(.+).js$/
    });
    const initializers = Object.keys(initializerModules);

    return Promise.all(initializers.map(name =>
      initializerModules[name].initialize(this, this.registry)
    ));
  }

  /**
   * starts listening on the defined port
   *
   * @method start
   * @param {Number} port the port to listen on. Default: 3000
   * @return {Promise<undefined, Error>}
   */
  start(port = DEFAULT_LISTEN_PORT) {
    return this.runProjectInitializers().then(() => this.listen(port));
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
    config.initializers = config.initializers || {};
    config.initializers.dir = config.initializers.dir || this.DEFAULT_INITIALIZERS_LOOKUP_PATH;
    config.logging = config.logging || {};
    config.serializers = config.serializers || {};
    config.serializers.dir = config.serializers.dir || this.DEFAULT_SERIALIZER_LOOKUP_PATH;
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
    const projectDirectory = dirname(caller);

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
