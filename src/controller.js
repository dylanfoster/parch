"use strict";

import errors from "restify-errors";
import inflect from "inflect";

import STATUS_CODES from "./utils/status_codes";
import { setOwner } from "./containment";

/**
 * Base controller
 *
 * @class Controller
 * @constructor
 *
 * @param {Object} registry module registry
 * @param {Object} options configuration options
 * @param {String} options.model override the default model name
 * @todo add default restfull methods (index, show, etc)
 */
class Controller {
  get name() {
    return inflect.singularize(
      this.constructor.name.split(/controller/i)[0].toLowerCase()
    );
  }

  constructor(registry, options = {}) {
    setOwner(this, registry);

    if (options.parent) {
      Object.defineProperty(this, "isChild", {
        enumerable: true,
        configurable: false,
        get() {
          return true;
        }
      });

      Object.defineProperty(this, "__parent", {
        enumerable: true,
        configurable: false,
        get() {
          return options.parent;
        }
      });
    }

    /**
     * Restify errors map
     * <a href="https://github.com/restify/errors">
     * restify-errors
     * </a>
     *
     * @property errors
     * @type {Object}
     */
    this.errors = errors;

    /**
     * Object containing all models registered
     *
     * @property models
     * @type {Array}
     */
    this.models = registry.lookup("service:model-manager").models;

    /**
     * The name of the model that belongs to this controller. If one cannot be
     * found this will be undefined
     *
     * @property modelName
     * @type {String}
     */
    this.modelName = this.getModelName(options.model);

    /**
     * Pluralized version of modelName
     *
     * @property modelNameLookup
     * @type {String}
     */
    this.modelNameLookup = inflect.singularize(this.modelName).toLowerCase();

    /**
     * An object mapping of status codes and their corresponding value
     *
     * @property STATUS_CODES
     * @type {Object}
     */
    this.STATUS_CODES = STATUS_CODES;

    /**
     * Instance of {{#crossLink "Store"}}Store{{/crossLink}}
     *
     * @property store
     * @type {Object}
     */
    registry.inject(this, "service:store", "store");

    if (this.modelNameLookup) {
      try {
        /**
         * The model class that belongs to this controller. If none could be found
         * this will be undefined.
         *
         * @property internalModel
         * @type {Object}
         */
        registry.inject(this, `model:${this.modelNameLookup}`, "internalModel");
      } catch (err) {
        registry.lookup("service:logger").debug({
          error: err,
          controller: this.name
        }, "failed to load model");
      }
    }
  }

  /**
   * Returns the name of the model that is associated with this controller.
   * If options.model is passed to controller it will take precedence, otherwise
   * the controller will attempt to lookup a model matching the controller's name
   *
   * @method getModelName
   * @param {String} model name of the model to use
   * @returns {String} modelName
   */
  getModelName(model) {
    const isChild = this.isChild;
    let modelName;

    if (isChild) {
      const parent = this.__parent;

      modelName = model || inflect.camelize(parent);
    } else {
      modelName = model || this.name;
    }

    return modelName;
  }
}

export default Controller;
