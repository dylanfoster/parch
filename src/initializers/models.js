"use strict";

module.exports = {
  name: "models",

  initialize(applicaiton, registry) {
    const modelManager = registry.lookup("service:model-manager");
    const modelLoader = registry.lookup("loader:model");
    const modelClasses = Object.keys(modelLoader.modules).map(model => modelLoader.modules[model]);

    modelClasses.forEach(Klass => modelManager.addModel(Klass));

    const models = Object.keys(modelManager.models).map(model => modelManager.models[model]);

    models.forEach(model => {
      if (model.associate) {
        model.associate(model, modelManager.models);
      }
    });

    models.forEach(model => registry.register(`model:${model.name.toLowerCase()}`, model));

    return models;
  }
};
