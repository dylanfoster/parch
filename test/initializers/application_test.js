"use strict";

import { expect } from "chai";

import { application } from "../fixtures";
import initializer from "../../src/initializers/application";

describe("initializer | application", function () {
  let registry;

  beforeEach(function () {
    registry = application.registry;
  });

  describe("#initialize", function () {
    it("registers the application injections", function () {
      initializer.initialize(application, registry);

      expect(application.app).to.be.ok;
      expect(application.modelManager).to.be.ok;
      expect(registry.lookup("application:main")).to.eql(application);
    });
  });
});
