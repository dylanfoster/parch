"use strict";

import Loader from "./loader";
import includeAll from "include-all";
import inflect from "inflect";

const LOOKUP_MAP = {
  module: __dirname
};

export default class Registry {
  constructor() {
    this._registry = new Map();
  }

  inject(context, lookup) {
    const obj = this.lookup(lookup);
    const [, name] = lookup.split(":");

    if (Object.prototype.hasOwnProperty.call(context, name)) { return; }

    if (obj) {
      Object.defineProperty(context, name, {
        enumerable: false,
        configurable: false,
        get() {
          return obj;
        },
        set() {}
      });
    }

    return context;
  }

  lookup(name) {
    const [moduleLookup, moduleName] = name.split(":");
    let obj = this._registry.get(name);

    if (obj) { return obj; }

    obj = this._loadModule(moduleLookup, moduleName);

    this._registry.set(name, obj);

    return obj;
  }

  _loadModule(lookup, name) {
    const modules = includeAll({
      dirname: this._getLookupDirectory(lookup)
    });
    const key = `${inflect.underscore(name)}.js`;

    return modules[key];
  }

  _getLookupDirectory(lookup) {
    return LOOKUP_MAP[lookup];
  }

  register(name, Obj, options = {}) {
    const { instantiate } = options;

    if (instantiate) {
      return this._registry.set(name, new Obj());
    }

    this._registry.set(name, Obj);
  }
}
