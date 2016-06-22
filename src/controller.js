"use strict";

import inflect from "inflect";

class Controller {
  get name() {
    return this.constructor.name.split(/controller/i)[0].toLowerCase();
  }
  constructor(settings) {
    this.loader = settings.loader;
    this.models = this.loader.models;
    this.modelName = settings.model || this.name;
    const model = this.models[this.modelName] || this.models[inflect.capitalize(this.modelName)];

    this.model = model;
  }
}

export default Controller;
