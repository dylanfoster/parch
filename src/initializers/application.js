"use strict";

module.exports = {
  initialize(application, registry) {
    registry.register("application:main", application);
  },

  name: "application"
};
