"use strict";

import inflect from "inflect";

class Router {
  constructor(settings) {
    this.app = settings.app;
    this.controllers = settings.controllers;
    this.loader = settings.loader;
  }

  resource(name) {
    const controller = this.loader.controllers.get(name);

    this._bindRoutes(name, controller);
  }

  _bindRoutes(resource) {
  }

  static map(settings, callback) {
    const router = new Router(settings);

    callback.call(router);
    return router;
  }
}

const restActionMapper = new Map([
    ["index", "get"],
    ["show", "get"],
    ["create", "post"],
    ["update", "put"],
    ["destroy", "delete"]
]);

export default Router;
