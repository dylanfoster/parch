"use strict";

module.exports = {
  name: "router",

  initialize(application, registry) {
    const Router = registry.lookup("module:router");
    const app = registry.lookup("service:server");
    const config = registry.lookup("config:main");
    const routerSettings = {
      app,
      loader: {
        controllers: registry.lookup("loader:controller"),
        models: registry.lookup("service:model-manager").models
      },
      namespace: config.namespace
    };

    application.map = Router.map.bind(null, routerSettings);

    registry.register("service:router", Router);
  }
};
