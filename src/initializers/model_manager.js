"use strict";

module.exports = {
  initialize(application, registry) {
    const ModelManager = registry.lookup("module:model-manager");
    const manager = new ModelManager(registry);

    return registry.register("service:model-manager", manager);
  },

  name: "model-manager"
};
