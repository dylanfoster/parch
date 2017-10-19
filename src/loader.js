"use strict";

import includeAll from "include-all";
import inflect from "inflect";

class Loader {
  constructor(settings) {
    this.type = settings.type;
    this.filter = settings.filter || this._getDefaultFilter();
    this.loadPath = settings.path;
    this.modules = this._loadModules();
  }

  get(name) {
    return this.modules[name];
  }

  _getDefaultFilter() {
    return /(.+).js$/i;
  }

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
