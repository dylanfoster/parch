"use strict";

module.exports = {
  name: "router",

  initialize(application, registry) {
    const Router = registry.lookup("module:router");

    application.map = Router.map.bind(null, registry);

    registry.register("service:router", Router);
  }
};
