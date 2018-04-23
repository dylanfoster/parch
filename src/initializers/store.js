"use strict";

import Store from "../store";

module.exports = {
  initialize(application, registry) {
    const config = registry.lookup("config:main");

    if (!config.database) { return; }

    const store = new Store(registry);

    registry.register("service:store", store, { singleton: true });
    registry.inject(application, "service:store", "store");
  },

  name: "store"
};
