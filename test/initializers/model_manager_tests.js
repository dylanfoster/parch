"use strict";

import { expect } from "chai";

import { application } from "../fixtures";
import initializer from "../../src/initializers/model_manager";

describe("initializer | model-manager", function () {
  let registry;

  beforeEach(function () {
    registry = application.registry;
  });

  describe("#initialize", function () {
    it("registers the model manager", function () {
      initializer.initialize(application, registry);

      const modelManager = registry.lookup("service:model-manager");

      expect(modelManager.models).to.eql({});
    });
  });
});
