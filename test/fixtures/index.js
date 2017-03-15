"use strict";

import path from "path";

import Loader from "../../src/loader";
import Registry from "../../src/registry";
import modelManagerInitializer from "../../src/initializers/model_manager";

const registry = new Registry();

registry.register("config:main", {
  database: {
    connection: {
      dialect: "sqlite",
      database: "test",
      username: "test",
      password: "test",
      logging: false
    }
  }
});
const FIXTURES_PATH = path.resolve(__dirname);
const controllerLoader = new Loader({
  type: "controller",
  path: path.join(FIXTURES_PATH, "controllers")
});
const modelLoader = new Loader({
  type: "model",
  path: path.join(FIXTURES_PATH, "models")
});

modelManagerInitializer.initialize(registry);
const modelManager = registry.lookup("service:model-manager");

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

export { loader, modelManager, registry };
