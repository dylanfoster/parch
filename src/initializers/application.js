"use strict";

module.exports = {
  name: "application",

  initialize(application, registry) {
    registry.inject(application, "service:model-manager", "modelManager");
    registry.inject(application, "service:server", "app");
    registry.register("application:main", application);
  }
};
