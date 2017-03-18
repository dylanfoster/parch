"use strict";

import Bunyan from "bunyan";

module.exports = {
  initialize(application, registry) {
    const Logger = registry.lookup("module:logger");
    const config = registry.lookup("config:main");

    if (config.log && config.log instanceof Bunyan) {
      return registry.register("service:logger", config.log);
    }

    config.log = Logger.create("application", config.logging);
    registry.register("service:logger", config.log);
    registry.inject(application, "service:logger", "logger");
  },

  name: "logger"
};
