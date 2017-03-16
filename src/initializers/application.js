"use strict";

module.exports = {
  initialize(application, registry) {
    // TODO: deprecate these properties for 2.0.0
    registry.inject(application, "service:model-manager", "modelManager");
    registry.inject(application, "service:server", "app");
    registry.register("application:main", application);
  },

  name: "application"
};
