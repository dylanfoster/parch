"use strict";

module.exports = {
  name: "model-manager",

  initialize(application, registry) {
    const ModelManager = registry.lookup("module:model-manager");

    return registry.register("service:model-manager", ModelManager, {
      instantiate: true
    });
  }
};
