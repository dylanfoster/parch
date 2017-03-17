"use strict";

import { ok as assert } from "assert";
import includeAll from "include-all";
import inflect from "inflect";

const LOOKUP_MAP = {
  module: __dirname
};

/**
 * Manages module registration for cross boundary use (DI)
 *
 * @class Registry
 * @constructor
 */
export default class Registry {
  constructor() {
    this._registry = new Map();
  }

  /**
   * Inject an object into another object
   *
   * @method inject
   * @param {Object} context the object to inject onto
   * @param {String} lookup name by which to look search for the injection in the registry
   * @param {String} propertyName optional property name of the newly injected object
   * @returns {Object} context
   * @example
   *     registry.inject(object, "service:store");
   *     // object.store
   *     registry.inject(object, "service:model-manager", "modelManager");
   *     // object.modelManager
   */
  inject(context, lookup, propertyName) {
    const hasBeenRegistered = this._registry.has(lookup);

    assert(hasBeenRegistered, `Attempted to inject unknown object '${lookup}'`);

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
   * Find an object in the registry. If the object isn't found in the registry
   * lookup will attempt to find it by requiring it in. If the require fails
   * the lookup fails
   *
   * @method lookup
   * @param {String} name colon delimited lookup string "service:foo"
   * @returns {Object}
   * @example
   *     const foo = registry.lookup("service:foo");
   *     // { foo: "bar" }
   */
  lookup(name) {
    const [moduleLookup, moduleName] = name.split(":");
    let obj = this._registry.get(name);

    if (obj) { return obj.instance; }

    obj = this._loadModule(moduleLookup, moduleName);

    assert(obj, `Attempted to lookup unknown module '${moduleName}'`);

    this.register(name, obj);

    return obj;
  }

  /**
   * Register an object in the registry by name. If the name exists and it was
   * registered with the { singleton: true } option, an error will be thrown.
   *
   * @method register
   * @param {String} name the name by which to register the object
   * @param {Object} Obj the object to store in the registry
   * @param {Object} options register options
   * @param {Boolean} options.instantiate instantiate the object when registering it
   * @param {Boolean} options.singleton only allow one registration of this name/object
   * @returns {Object} the registered object
   * @example
   *     registry.register("service:foo", { foo: "bar" });
   */
  register(name, Obj, options = {}) {
    const { instantiate, singleton } = options;
    let obj = this._registry.get(name);

    if (obj && obj.singleton) {
      throw new Error("Cannot re-register singleton object");
    }

    obj = {};

    if (instantiate) {
      obj.instance = new Obj(this);
      obj.singleton = singleton;

      this._registry.set(name, obj);

      return obj;
    }

    obj.instance = Obj;
    obj.singleton = singleton;

    this._registry.set(name, obj);

    return obj;
  }

  /**
   * Get the lookup directory for internal modules
   * @method _getLookupDirectory
   * @param {String} lookup string name of object we're looking for (e.g. 'module')
   * @private
   *
   * @returns {String} directory
   */
  _getLookupDirectory(lookup) {
    return LOOKUP_MAP[lookup];
  }

  /**
   * Attempts to load modules by requiring them in locally. Lookup directory is
   * determined by the type of object we're loading (e.g. 'module' => ./) and the
   * name of the module (e.g. 'model-manager') which is underscored
   *
   * @method _loadModule
   * @param {String} lookup string name of object we're looking for (e.g. 'module')
   * @param {String} name string module name
   * @returns {Object} required module
   */
  _loadModule(lookup, name) {
    let modules;

    try {
      modules = includeAll({ dirname: this._getLookupDirectory(lookup) });
    } catch (err) {
      if (err.message.match(/dirname/i)) {
        throw new Error(`Attempted to lookup unknown module '${name}'`);
      }

      throw err;
    }

    // TODO: this will need to be configurable somehow (or better regex)
    const key = `${inflect.underscore(name)}.js`;

    return modules[key];
  }
}
