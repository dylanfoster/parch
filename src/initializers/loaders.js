"user strict";

import Loader from "../loader";

module.exports = {
  name: "loaders",

  initialize(application, registry) {
    const config = registry.lookup("config:main");
    const controllerLoader = new Loader({
      type: "controller",
      path: config.controllers.dir
    });
    const modelLoader = new Loader({
      type: "model",
      path: config.database.models.dir
    });

    registry.register("loader:controller", controllerLoader);
    registry.register("loader:model", modelLoader);
  }
};
