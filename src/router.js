"use strict";

import inflect from "inflect";

const restActionMapper = new Map([
    ["index", "get"],
    ["show", "get"],
    ["create", "post"],
    ["update", "put"],
    ["destroy", "del"]
]);

const restPathMapper = new Map([
    ["index", "/"],
    ["show", "/:id"],
    ["create", "/"],
    ["update", "/:id"],
    ["destroy", "/:id"]
]);

class Router {
  constructor(settings) {
    this.app = settings.app;
    this.controllers = settings.controllers;
    this.loader = settings.loader;
  }

  resource(name) {
    name = inflect.singularize(name);
    const Controller = this.loader.controllers.get(name);
    const controller = new Controller();

    for (const [action] of restActionMapper) {
      this._mapControllerAction(name, controller, action);
    }
  }

  _mapControllerAction(resource, controller, action) {
    const controllerAction = controller[action];
    const method = restActionMapper.get(action);
    const singularResource = inflect.singularize(resource);
    const pluralResource = inflect.pluralize(singularResource);
    const pathSegment = restPathMapper.get(action);
    const resourcePath = `/${pluralResource}${pathSegment}`;

    this.app[method](resourcePath, controllerAction);
  }

  static map(settings, callback) {
    const router = new Router(settings);

    callback.call(router);
    return router;
  }
}

export default Router;
