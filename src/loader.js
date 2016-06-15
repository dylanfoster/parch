"use strict";

import includeAll from "include-all";

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
    const typeRegexString = "(.+)" + this.type + "\\" + ".js$";
    const typeRegex = new RegExp(typeRegexString, "i");

    const modules = includeAll({
      dirname: this.loadPath,
      filter: typeRegex,
    });

    Object.keys(modules).forEach(module => {
      const key = module.toLowerCase().replace("_", "").replace("-", "");

      // HACK: cuz node es modules suck
      if (modules[module].hasOwnProperty("default")) {
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
