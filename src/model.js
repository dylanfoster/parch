"use strict";

class Model {
  get name() {
    return this.constructor.name.split(/model/i)[0];
  }

  constructor() {
  }

  define() {
    throw new Error("Models must supply a 'define' method");
  }
}

export default Model;
