"use strict";

module.exports = {
  initialize(application, registry) {
    registry.register("service:foo", { foo: "bar" });
    registry.inject(application, "service:foo", "foo");
  }
};
