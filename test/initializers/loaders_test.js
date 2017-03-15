"use strict";

import { expect } from "chai";

import { application } from "../fixtures";
import initializer from "../../src/initializers/loaders";

describe("initializer | loaders", function () {
  let registry;

  beforeEach(function () {
    registry = application.registry;
  });

  describe("#initialize", function () {
    it("registers the controller and model module loaders", function () {
      initializer.initialize(application, registry);

      const modelLoader = registry.lookup("loader:model");

      expect(modelLoader.modules).to.have.property("foo");
    });
  });
});
