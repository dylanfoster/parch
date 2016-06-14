"use strict";

import includeAll from "include-all";

class Loader {
  constructor(settings) {
    this.type = settings.type;
    this.loadPath = settings.path;

    this._loadModules();
  }

  get(type, name) {
  }

  _loadModules() {
  }
}

export default Loader;
