"use strict";

class Model {
  get name() {
    /**
     * TODO: we should probably just lowercase this and be done. This would mean
     * models would be accessed in lowercase (e.g. models.user) and when creating
     * the schema, tablenames would be lowercase always
     */
    return this.constructor.name.split(/model/i)[0];
  }

  constructor(options = {}) {
    this.options = options;
  }

  define() {
    throw new Error("Models must supply a 'define' method");
  }
}

export default Model;
