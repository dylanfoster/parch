"use strict";

import path from "path";

import Loader from "../../src/loader";
import ModelManager from "../../src/model_manager";

const FIXTURES_PATH = path.resolve(__dirname);
const controllerLoader = new Loader({
  type: "controller",
  path: path.join(FIXTURES_PATH, "controllers")
});
const modelLoader = new Loader({
  type: "model",
  path: path.join(FIXTURES_PATH, "models")
});
const connection = {
  database: "test",
  username: "luke",
  password: "skywalker",
  dialect: "sqlite",
  logging: false
};
const modelManager = new ModelManager({ connection });

Object.keys(modelLoader.modules).forEach(model => {
  modelManager.addModel(modelLoader.modules[model]);
});

Object.keys(modelManager.models).forEach(model => {
  if (modelManager.models[model].associate) {
    modelManager.models[model].associate(modelManager.models[model], modelManager.models);
  }
});
const loader = {
  controllers: controllerLoader,
  models: modelManager.models
};

export { connection, loader, modelManager };
