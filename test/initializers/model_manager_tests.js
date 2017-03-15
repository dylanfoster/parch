"use strict";

import { expect } from "chai";

import ModelManager from "../../src/model_manager";
import Registry from "../../src/registry";
import initializer from "../../src/initializers/model_manager";

describe("initializer | model-manager", function () {
  let registry;

  beforeEach(function () {
    registry = new Registry();
    registry.register("config:main", {
      database: {
        connection: {
          dialect: "sqlite",
          database: "test",
          username: "test",
          password: "test"
        }
      }
    });
  });

  describe("#initialize", function () {
    it("registers the model manager", function () {
      initializer.initialize(registry);

      const modelManager = registry.lookup("service:model-manager");

      expect(modelManager.models).to.eql({});
    });
  });
});
