"use strict";

module.exports = {
  initialize(application, registry) {
    const Router = registry.lookup("module:router");

    application.map = Router.map.bind(null, registry);

    registry.register("service:router", Router);
  },

  name: "router"
};
