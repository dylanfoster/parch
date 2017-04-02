"use strict";

import Store from "../store";

module.exports = {
  initialize(application, registry) {
    const models = registry.lookup("service:model-manager").models;
    const store = new Store(models);

    registry.register("service:store", store, { singleton: true });
    registry.inject(application, "service:store", "store");
  },

  name: "store"
};
