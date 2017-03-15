"use strict";

class BazController {
  get name() {
    return this.constructor.name.split(/controller/i)[0].toLowerCase();
  }

  construtor() {
  }
}

export default BazController;
