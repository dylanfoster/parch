"use strict";

import depd from "depd";

module.exports = {
  initialize(application, registry) {
    const Logger = registry.lookup("module:logger");
    const config = registry.lookup("config:main");

    depd("parch")("config#log is deprectated and will be removed in 2.0.0");

    if (config.logging && config.logging.logger) {
      registry.register("service:logger", config.logging.logger);
    } else {
      config.logging = config.logging || {};
      config.logging.logger = Logger.create("application", config.logging);
    }

    registry.register("service:logger", config.logging.logger);
    registry.inject(application, "service:logger", "logger");
  },

  name: "logger"
};
