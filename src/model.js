"use strict";

class Model {
  get name() {
    return this.constructor.name.split(/model/i)[0];
  }

  constructor() {
  }
}

export default Model;
