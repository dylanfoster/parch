"use strict";

import Bunyan from "bunyan";
import depd from "depd";

module.exports = {
  initialize(application, registry) {
    const Logger = registry.lookup("module:logger");
    const config = registry.lookup("config:main");

    depd("parch")("config#log is deprectated and will be removed in 2.0.0");

    if (config.log && config.log instanceof Bunyan) {
      registry.register("service:logger", config.log);
    } else {
      config.log = Logger.create("application", config.logging);
    }

    registry.register("service:logger", config.log);
    registry.inject(application, "service:logger", "logger");
  },

  name: "logger"
};
