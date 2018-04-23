"use strict";

module.exports = {
  name: "model-manager",

  initialize(application, registry) {
    const ModelManager = registry.lookup("module:model-manager");
    const config = registry.lookup("config:main");

    if (config.database) {
      return registry.register("service:model-manager", ModelManager, {
        instantiate: true
      });
    }
  }
};
