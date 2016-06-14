"use strict";

import inflect from "inflect";

import loader from "./loader";

class Router {
  constructor(settings) {
    this.app = settings.app;
    this.controllers = settings.controllers;
  }

  resource(name) {
    const controller = loader.get("controller", name);

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
