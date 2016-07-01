"use strict";

import includeAll from "include-all";
import inflect from "inflect";

class Loader {
  constructor(settings) {
    this.type = settings.type;
    this.loadPath = settings.path;
    this.modules = this._loadModules();
  }

  get(name) {
    return this.modules[name];
  }

  _loadModules() {
    const typeRegexString = `(.+)${this.type}\\.js$`;
    const typeRegex = new RegExp(typeRegexString, "i");
    const modules = includeAll({
      dirname: this.loadPath,

      // TODO: make this configurable
      filter: typeRegex
    });

    Object.keys(modules).forEach(module => {
      const moduleName = module.toLowerCase().replace("_", "").replace("-", "");
      const key = inflect.singularize(moduleName);

      if (modules[module].hasOwnProperty("default")) {
        /**
         * HACK: Babel no longer exports [default], though I'm pretty sure I have
         * that transform installed so....¯\_(ツ)_/¯
         */
        modules[key] = modules[module].default;
      } else {
        modules[key] = modules[module];
      }

      delete modules[module];
    });

    return modules;
  }
}

export default Loader;
