"use strict";

import includeAll from "include-all";
import inflect from "inflect";

/**
 * The loader class manages module loading (e.g. controllers and models)
 *
 * @class Loader
 * @constructor
 * @param {Object} settings
 * @param {String} settings.type the loader type (controller, model, etc)
 * @param {RegExp} settings.filter loader filter
 * @param {String} settings.path module loader path
 */
class Loader {
  constructor(settings) {
    /**
     * Loader type
     *
     * @property type
     * @type {String}
     */
    this.type = settings.type;

    /**
     * Loader filter
     *
     * @property filter
     * @type {String}
     */
    this.filter = settings.filter || this._getDefaultFilter();

    /**
     * Module load path
     *
     * @property loadPath
     * @type {String}
     */
    this.loadPath = settings.path;
    this.modules = this._loadModules();
  }

  /**
   * Returns the loaded module object by name
   *
   * @method get
   * @param {String} name
   * @returns {Object} module object
   */
  get(name) {
    return this.modules[name];
  }

  /**
   * Returns the default filter RegExp
   *
   * @method _getDefaultFilter
   * @private
   * @returns {RegExp}
   */
  _getDefaultFilter() {
    return /(.+).js$/i;
  }

  /**
   * Attempts to load all modules by given filter path
   *
   * @method _loadModules
   * @private
   */
  _loadModules() {
    const modules = includeAll({
      dirname: this.loadPath,
      filter: this.filter
    });

    Object.keys(modules).forEach(module => {
      const moduleName = module.toLowerCase()
        .replace("_", "")
        .replace("-", "")
        .replace(this.type, "");

      const key = inflect.singularize(moduleName);

      if (!modules[key]) {
        modules[key] = modules[module];

        delete modules[module];
      }
    });

    return modules;
  }
}

export default Loader;
