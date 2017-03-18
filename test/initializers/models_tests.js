"use strict";

import { expect } from "chai";

import { application } from "../fixtures";
import initializer from "../../src/initializers/models";

describe("initializer | models", function () {
  let registry;

  beforeEach(function () {
    registry = application.registry;
  });

  describe("#initialize", function () {
    it("registers the models", function () {
      initializer.initialize(application, registry);

      const model = registry.lookup("model:foo");

      expect(model.name).to.eql("Foo");
    });
  });
});
