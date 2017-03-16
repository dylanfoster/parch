"use strict";

import Bunyan from "bunyan";
import { expect } from "chai";

import { application } from "../fixtures";
import initializer from "../../src/initializers/logger";

describe("initializer | logger", function () {
  let registry;

  beforeEach(function () {
    registry = application.registry;
  });

  describe("#initialize", function () {
    it("registers the logger injections", function () {
      initializer.initialize(application, registry);

      const logger = registry.lookup("service:logger");

      expect(logger).to.be.ok;
      expect(logger).to.be.instanceof(Bunyan);
    });
  });
});
