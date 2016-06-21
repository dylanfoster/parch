"use strict";

import path from "path";

import { expect } from "chai";
import Sequelize from "sequelize";

import ModelManager from "../src/model_manager";
import UserModel from "./fixtures/models/user_model.js";
import { connection } from "./fixtures";

describe("ModelManager", function () {
  let modelManager;

  beforeEach(function () {
    modelManager = new ModelManager({ connection });
  });

  describe("#addModel", function () {
    it("adds a model to a list of models", function () {
      modelManager.addModel(UserModel);

      expect(modelManager.models.User).to.be.ok;
    });
  });
});
