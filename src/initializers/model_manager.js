"use strict";

module.exports = {
  name: "model-manager",

  initialize(application, registry) {
    const ModelManager = registry.lookup("module:model-manager");
    const manager = new ModelManager(registry);

    return registry.register("service:model-manager", manager);
  }
};
