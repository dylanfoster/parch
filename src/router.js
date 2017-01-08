"use strict";

import inflect from "inflect";

import Route from "./route";

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

/**
 * Manages routing
 *
 * @class Router
 */
class Router {
  /**
   * constructor
   *
   * @constructor
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
   * Bind a set of routes to a namespace
   *
   *     Router.map(function () {
   *       this.namespace("/users/:userId", [
   *         { path: "/setProfileImage", using: "user:setImage", method: "post" }
   *       ])
   *     });
   *
   * @method namespace
   * @param {String} namespace the namespace to bind to, with or without leading slash
   * @param {Array[Object]} routes array of routes to bind to the namespace
   */
  namespace(namespace, routes) {
    for (const route of routes) {
      const fullPath = this._buildRoute(namespace, route.path);

      this.route(fullPath, {
        using: route.using,
        method: route.method
      });
    }
  }

  /**
   * register a resource and wire up restful endpoints
   *
   *     Router.map(function () {
   *       this.resource("user");
   *     });
   *
   * @method resource
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
   * register a single route
   *
   *     Router.map(function () {
   *       this.route("/user/foo", { using: "users:foo", method: "get" });
   *     });
   *
   * @method route
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
   * Consistently builds a route from a set of path segments
   *
   *     router._buildRoute("foo", "/bar" "baz/");
   *
   * @method _buildRoute
   * @private
   * @returns {Object} route object with path property
   */
  _buildRoute() {
    return new Route(...arguments);
  }

  /**
   * generates main route handler plus pre and post hooks
   *
   * @private
   * @method _generateControllerHandlers
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
   * loads controllers from the loader
   *
   * @private
   * @method _loadControllers
   */
  _loadControllers() {
    const controllers = this.loader.controllers.modules;
    const loader = this.loader;

    Object.keys(controllers).forEach(controller => {
      this.controllers.set(controller, new controllers[controller]({ loader }));
    });
  }

  /**
   * maps a resource controller action and route
   *
   * @private
   * @method _mapControllerAction
   * @param {String} resource the resource name
   * @param {Object} controller the resource controller
   * @param {String} action the controller method
   */
  _mapControllerAction(resource, controller, action) {
    const method = restActionMapper.get(action);
    const singularResource = inflect.singularize(resource);
    const pluralResource = inflect.pluralize(singularResource);
    const pathSegment = restPathMapper.get(action);
    const resourcePath = this._buildRoute(pluralResource, pathSegment);
    const handlers = this._generateControllerHandlers(controller, action);

    this.app[method](resourcePath, handlers);
  }

  /**
   * configures router resources
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
