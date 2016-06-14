"use strict";

class Router {
  constructor(options) {
  }

  static map(callback) {
    const router = new Router();

    callback.call(router);
    return router;
  }
}

export default Router;
