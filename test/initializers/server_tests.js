"use strict";

import Server from "restify/lib/server";
import { expect } from "chai";

import { application } from "../fixtures";
import initializer from "../../src/initializers/server";

describe("initializer | server", function () {
  let registry;

  beforeEach(function () {
    registry = application.registry;
  });

  describe("#initialize", function () {
    it("registers the restify server", function () {
      initializer.initialize(application, registry);

      const server = registry.lookup("service:server");

      expect(server).to.be.instanceof(Server);
    });
  });
});
