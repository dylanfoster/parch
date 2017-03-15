"use strict";

import path from "path";

import Application from "../../src/application";
import Loader from "../../src/loader";
import Registry from "../../src/registry";
import modelManagerInitializer from "../../src/initializers/model_manager";

const FIXTURES_PATH = path.resolve(__dirname);
const application = new Application({
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
const controllerLoader = application.registry.lookup("loader:controller");
const modelLoader = application.registry.lookup("loader:model");
const modelManager = application.registry.lookup("service:model-manager");
const loader = {
  controllers: controllerLoader,
  models: modelManager.models
};
const registry = application.registry;

export {
  application,
  loader,
  modelManager,
  registry
};
