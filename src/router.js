"use strict";

import inflect from "inflect";

class Router {
  constructor(settings) {
    this.app = settings.app;
    this.controllers = settings.controllers;
    this.loader = settings.loader;
  }

  resource(name) {
    const Controller = this.loader.controllers.get(name);
    const controller = new Controller();

    this._bindRoutes(name, controller);
  }

  _bindRoutes(resource, controller) {
    const singularResource = inflect.singularize(resource);
    const pluralResource = inflect.pluralize(singularResource);

    this._bindRoute(`/${pluralResource}`, `get`, controller.index.bind(controller));
    this._bindRoute(`/${pluralResource}`, `get`, controller.show.bind(controller));
    this._bindRoute(`/${pluralResource}`, `post`, controller.create.bind(controller));
    this._bindRoute(`/${pluralResource}`, `put`, controller.update.bind(controller));
    this._bindRoute(`/${pluralResource}`, `del`, controller.destroy.bind(controller));
  }

  _bindRoute(endpoint, method, action) {
    this.app[method](endpoint, action);
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
