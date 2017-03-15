"use strict";

module.exports = {
  initialize(registry) {
    const ModelManager = registry.lookup("module:model-manager");
    const config = registry.lookup("config:main");

    return registry.register("service:model-manager", new ModelManager({
      connection: config.database.connection
    }));
  },

  name: "model-manager"
};
