"use strict";

import { expect } from "chai";

import { application } from "../fixtures";
import initializer from "../../src/initializers/middleware";

describe("initializer | middleware", function () {
  let registry;

  beforeEach(function () {
    registry = application.registry;
  });

  describe("#initialize", function () {
    it("registers application middleware", function () {
      initializer.initialize(application, registry);

      const server = registry.lookup("service:server");

      initializer.middleware.forEach(ware => {
        if (Array.isArray(ware)) {
          ware.forEach(w => {
            expect(server.chain).to.include(w);
          });
        } else {
          expect(server.chain).to.include(ware);
        }
      });
    });
  });
});
