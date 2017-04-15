"user strict";

import Loader from "../loader";

module.exports = {
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
    const serializerLoader = new Loader({
      filter: /(.*).js$/,
      type: "serializer",
      path: config.serializers.dir
    });

    registry.register("loader:controller", controllerLoader);
    registry.register("loader:model", modelLoader);
    registry.register("loader:serializer", serializerLoader);
  },

  name: "loaders"
};
