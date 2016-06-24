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
    this.controllers = new Map();
    this.loader = settings.loader;

    this._loadControllers();
  }

  resource(name) {
    name = inflect.singularize(name);
    const controller = this.controllers.get(name);

    for (const [action] of restActionMapper) {
      this._mapControllerAction(name, controller, action);
    }
  }

  route(path, options) {
    const [controllerName, actionName] = options.using.split(":");
    const controller = this.controllers.get(controllerName);
    const method = options.method;

    this.app[method](path, controller[actionName].bind(controller));
  }

  _loadControllers() {
    const controllers = this.loader.controllers.modules;
    const loader = this.loader;

    Object.keys(controllers).forEach(controller => {
      this.controllers.set(controller, new controllers[controller]({ loader }));
    });
  }

  _mapControllerAction(resource, controller, action) {
    const controllerAction = controller[action];
    const method = restActionMapper.get(action);
    const singularResource = inflect.singularize(resource);
    const pluralResource = inflect.pluralize(singularResource);
    const pathSegment = restPathMapper.get(action);
    const resourcePath = `/${pluralResource}${pathSegment}`;

    this.app[method](resourcePath, controllerAction.bind(controller));
  }

  static map(settings, callback) {
    const router = new Router(settings);

    callback.call(router);
    return router;
  }
}

export default Router;
