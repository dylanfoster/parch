"use strict";

import inflect from "inflect";

import { JSONSerializer } from "./serializers";
import Route from "./route";
import { getOwner, setOwner } from "./containment";

const METHODS = {
  DELETE: "delete"
};
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
 * @constructor
 * @param {Object} registry {{#crossLink "Registry"}}module registry{{/crossLink}}
 */
class Router {
  constructor(registry) {
    setOwner(this, registry);

    const config = registry.lookup("config:main");

    this.loader = {
      controllers: registry.lookup("loader:controller"),
      models: registry.lookup("service:model-manager").models
    };

    this.namespacePrefix = config.namespace || "";
    this._loadControllers();
  }

  /**
   * Bind a set of routes to a namespace.
   * Uses {{#crossLink "Router/_buildRoute:method"}}_buildRoute{{/crossLink}} to
   * normalize the path
   *
   * @method namespace
   * @param {String} namespace the namespace to bind to, with or without leading slash
   * @param {Array[Object]} routes array of routes to bind to the namespace
   * @since 0.9.0
   *
   * @example
   * ```javascript
   * Router.map(function () {
   *   this.namespace("/users/:userId", [
   *     { path: "/setProfileImage", using: "user:setImage", method: "post" }
   *   ])
   * });
   * ```
   */
  namespace(namespace, routes) {
    for (const route of routes) {
      const fullPath = this._buildRoute(
        this.namespacePrefix,
        namespace,
        route.path
      );

      this.route(fullPath, {
        using: route.using,
        method: route.method
      });
    }
  }

  /**
   * Register a resource and wire up restful endpoints.
   * Uses {{#crossLink "Router/_buildRoute:method"}}_buildRoute{{/crossLink}} to
   * normalize the path and builds your 5 basic CRUD endpoints
   *
   * @method resource
   * @param {String} name the resource name in singular form
   * @param {Object} options resource mapping options
   * @param {String} options.namespace mount the resource endpoint under a namespace
   *
   * @example
   * ```javascript
   * Router.map(function () {
   *   this.resource("user");
   *
   *   // Optionally prefix this resource with a namespace
   *   this.resource("user", { namespace: "api" })
   * });
   * ```
   */
  resource(name, options = {}) {
    name = inflect.singularize(name);
    const controller = getOwner(this).lookup(`controller:${name}`);

    for (const [action] of restActionMapper) {
      this._mapControllerAction(name, controller, action, options);
    }
  }

  /**
   * Register a single route.
   * Uses {{#crossLink "Router/_buildRoute:method"}}_buildRoute{{/crossLink}} to
   * normalize the path
   *
   * @method route
   * @param {String} path the route path (e.g. /foo/bar)
   * @param {Object} options
   * @param {String} options.using colon delimited controller method identifier
   * @param {String} options.method http method
   *
   * @example
   * ```javascript
   * Router.map(function () {
   *   this.route("/user/foo", { using: "users:foo", method: "get" });
   * });
   * ```
   */
  route(path, options) {
    const app = getOwner(this).lookup("service:server");
    const [controllerName, actionName] = options.using.split(":");
    const controller = getOwner(this).lookup(`controller:${controllerName}`);
    let method = options.method;
    const handlers = this._generateControllerHandlers(controller, actionName);

    if (method === METHODS.DELETE) { method = "del"; }

    app[method](path, handlers);
  }

  /**
   * Consistently builds a route from a set of path segments using
   * {{#crossLink "Route"}}Route{{/crossLink}}
   *
   * @method _buildRoute
   * @private
   * @return {Object} route object with path property
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
   * @todo: move hooks to controller instance methods and just call them
   *
   * @return {Array} handlers
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
   * Generates a path segment from a given resource name
   *
   * @private
   * @method _getPathSegment
   * @param resource
   * @param action
   *
   * @returns {String} pathSegment (e.g. `:userId`)
   */
  _getPathSegment(resource, action) {
    const restPathSegment = restPathMapper.get(action);
    const resourceSegmentString = `${resource}Id`;

    return inflect.camelize(
      restPathSegment.replace("id", resourceSegmentString)
    );
  }

  /**
   * loads controllers from the loader
   *
   * @private
   * @method _loadControllers
   */
  _loadControllers() {
    const controllerLoader = getOwner(this).lookup("loader:controller");
    const modelLoader = getOwner(this).lookup("loader:model");
    const { modules: controllers } = controllerLoader;
    const { modules: models } = modelLoader;

    Object.keys(controllers).forEach(controller => {
      const Klass = controllers[controller];
      const instance = new Klass(getOwner(this));
      const instanceName = inflect.singularize(instance.name);
      const registry = getOwner(this);

      registry.register(`controller:${instanceName}`, instance);
    });

    Object.keys(models).forEach(model => {
      const instanceName = inflect.singularize(model);
      const registry = getOwner(this);
      const serializer = this._lookupSerializer(instanceName);

      registry.register(`serializer:${instanceName}`, serializer);
    });
  }

  /**
   * Attempts to lookup a serializer by 'name' in the module loader. If one exists
   * it is instantiated and registered by 'name'. If one does not exist the
   * default (RestSerializer at the moment) is instantiated and registered.
   *
   * @method _lookupSerializer
   * @private
   * @param {String} name lowercase singular lookup name (e.g. "user")
   * @return {Object} serializer instance
   */
  _lookupSerializer(name) {
    const serializerLoader = getOwner(this).lookup("loader:serializer");

    if (!serializerLoader) {
      return new JSONSerializer();
    }

    const { modules: serializers } = serializerLoader;
    const Serializer = serializers[name];
    let serializer;

    if (Serializer) {
      serializer = new Serializer();
    } else {
      serializer = new JSONSerializer();
    }

    return serializer;
  }

  /**
   * Attempts to lookup a serializer by 'name' in the module loader. If one exists
   * it is instantiated and registered by 'name'. If one does not exist the
   * default (RestSerializer at the moment) is instantiated and registered.
   *
   * @method _lookupSerializer
   * @private
   * @param {String} name lowercase singular lookup name (e.g. "user")
   * @return {Object} serializer instance
   */
  _lookupSerializer(name) {
    const serializerLoader = getOwner(this).lookup("loader:serializer");
    const { modules: serializers } = serializerLoader;
    const Serializer = serializers[name];
    let serializer;

    if (Serializer) {
      serializer = new Serializer();
    } else {
      serializer = new RestSerializer();
    }

    return serializer;
  }

  /**
   * maps a resource controller action and route
   *
   * @private
   * @method _mapControllerAction
   * @param {String} resource the resource name
   * @param {Object} controller the resource controller
   * @param {String} action the controller method
   * @param {Object} options mapping options
   */
  _mapControllerAction(resource, controller, action, options) {
    const app = getOwner(this).lookup("service:server");
    const handlers = this._generateControllerHandlers(controller, action);
    const method = restActionMapper.get(action);
    const namespace = options.namespace || "";
    const singularResource = inflect.singularize(resource);
    const pluralResource = inflect.pluralize(singularResource);
    const pathSegment = this._getPathSegment(singularResource, action);
    const resourcePath = this._buildRoute(
      this.namespacePrefix,
      namespace,
      pluralResource,
      pathSegment
    );

    app[method](resourcePath, handlers);
  }

  /**
   * configures router resources
   *
   * @static
   * @param {Object} settings
   * @param {Function} callback called with the router instance
   * @return {undefined}
   */
  static map(registry, callback) {
    const router = new Router(registry);

    callback.call(router);
    return router;
  }
}

export default Router;
