"use strict";

import deprecate from "../utils/deprecate";

module.exports = {
  initialize(application, registry) {
    deprecate(application, "modelManager", "2.0.0");
    deprecate(application, "app", "2.0.0");

    registry.inject(application, "service:model-manager", "modelManager");
    registry.inject(application, "service:server", "app");
    registry.register("application:main", application);
  },

  name: "application"
};
