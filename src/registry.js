"use strict";

import includeAll from "include-all";
import inflect from "inflect";

const LOOKUP_MAP = {
  module: __dirname
};

/**
 * Registry
 *
 * @class
 * @constructor
 */
export default class Registry {
  constructor() {
    this._registry = new Map();
  }

  /**
   * inject
   *
   *     registry.inject(object, "service:store");
   *     // object.store
   *
   *     registry.inject(object, "service:model-manager", "modelManager");
   *     // object.modelManager
   *
   * @param context
   * @param lookup
   * @param propertyName
   *
   * @returns {undefined}
   */
  inject(context, lookup, propertyName) {
    const obj = this.lookup(lookup);
    const [prop] = lookup.split(":");
    const property = propertyName || prop;

    if (Object.prototype.hasOwnProperty.call(context, property)) { return; }

    if (obj) {
      Object.defineProperty(context, property, {
        enumerable: false,
        configurable: false,
        get() { return obj; },
        set() {}
      });
    }

    return context;
  }

  /**
   * lookup
   *
   * @param name
   *
   * @returns {undefined}
   */
  lookup(name) {
    const [moduleLookup, moduleName] = name.split(":");
    let obj = this._registry.get(name);

    if (obj) { return obj; }

    obj = this._loadModule(moduleLookup, moduleName);

    this._registry.set(name, obj);

    return obj;
  }

  /**
   * register
   *
   * @param name
   * @param Obj
   * @param options={}
   * @todo: guard against overwrites with singleton option
   *
   * @returns {undefined}
   */
  register(name, Obj, options = {}) {
    const { instantiate } = options;

    if (instantiate) {
      return this._registry.set(name, new Obj());
    }

    return this._registry.set(name, Obj);
  }

  /**
   * _getLookupDirectory
   *
   * @param lookup
   *
   * @returns {undefined}
   */
  _getLookupDirectory(lookup) {
    return LOOKUP_MAP[lookup];
  }

  /**
   * _loadModule
   *
   * @param lookup
   * @param name
   *
   * @returns {undefined}
   */
  _loadModule(lookup, name) {
    const modules = includeAll({
      dirname: this._getLookupDirectory(lookup)
    });

    // TODO: this will need to be configurable somehow (or better regex)
    const key = `${inflect.underscore(name)}.js`;

    return modules[key];
  }
}
