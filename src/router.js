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
  /**
   * constructor
   *
   * @param settings
   * @param settings.app restify app instance
   * @param settings.loader module loader
   */
  constructor(settings) {
    this.app = settings.app;
    this.controllers = new Map();
    this.loader = settings.loader;
    this._loadControllers();
  }

  /**
   * resource register a resource and wire up restful endpoints
   *
   * @param {String} name the resource name in singular form
   */
  resource(name) {
    name = inflect.singularize(name);
    const controller = this.controllers.get(name);

    for (const [action] of restActionMapper) {
      this._mapControllerAction(name, controller, action);
    }
  }

  /**
   * route register a single route
   *
   * @param {String} path the route path (e.g. /foo/bar)
   * @param {Object} options
   * @param {String} options.using colon delimited controller method identifier
   * @param {String} options.method http method
   */
  route(path, options) {
    const [controllerName, actionName] = options.using.split(":");
    const controller = this.controllers.get(controllerName);
    const method = options.method;
    const handlers = this._generateControllerHandlers(controller, actionName);

    this.app[method](path, handlers);
  }

  /**
   * _generateControllerHandlers generates main route handler plus pre and post hooks
   *
   * @param {Object} controller
   * @param {String} action controller method
   * @returns {Array} handlers
   */
  _generateControllerHandlers(controller, action) {
    const controllerAction = controller[action];
    const { hooks } = controller;
    const handlers = [controllerAction.bind(controller)];

    if (hooks) {
      const actionHooks = hooks[action];

      if (actionHooks && actionHooks.before) {
        handlers.unshift(actionHooks.before.bind(controller));
      }

      if (actionHooks && actionHooks.after) {
        handlers.push(actionHooks.after.bind(controller));
      }
    }

    return handlers;
  }

  /**
   * _loadControllers loads controllers from the loader
   */
  _loadControllers() {
    const controllers = this.loader.controllers.modules;
    const loader = this.loader;

    Object.keys(controllers).forEach(controller => {
      this.controllers.set(controller, new controllers[controller]({ loader }));
    });
  }

  /**
   * _mapControllerAction maps a resource controller action and route
   *
   * @param {String} resource the resource name
   * @param {Object} controller the resource controller
   * @param {String} action the controller method
   */
  _mapControllerAction(resource, controller, action) {
    const method = restActionMapper.get(action);
    const singularResource = inflect.singularize(resource);
    const pluralResource = inflect.pluralize(singularResource);
    const pathSegment = restPathMapper.get(action);
    const resourcePath = `/${pluralResource}${pathSegment}`;
    const handlers = this._generateControllerHandlers(controller, action);

    this.app[method](resourcePath, handlers);
  }

  /**
   * map configures router resources
   *
   * @static
   * @param {Object} settings
   * @param {Function} callback called with the router instance
   * @returns {undefined}
   */
  static map(settings, callback) {
    const router = new Router(settings);

    callback.call(router);
    return router;
  }
}

export default Router;
