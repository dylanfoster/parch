"use strict";

import path from "path";

import { expect } from "chai";

import UserModel from "./fixtures/models/user_model.js";
import { registry } from "./fixtures";

describe("ModelManager", function () {
  let modelManager;

  beforeEach(function () {
    modelManager = registry.lookup("service:model-manager");
  });

  describe("#addModel", function () {
    it("adds a model to a list of models", function () {
      modelManager.addModel(UserModel);

      expect(modelManager.models.User).to.be.ok;
    });
  });
});
