"use strict";

import restify from "restify";

module.exports = {
  initialize(application, registry) {
    const config = registry.lookup("config:main");
    const server = config.app || restify.createServer(config.server);

    return registry.register("service:server", server);
  },

  name: "server"
};
