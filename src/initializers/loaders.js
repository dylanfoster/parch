"user strict";

import Loader from "../loader";

module.exports = {
  initialize(application, registry) {
    const config = registry.lookup("config:main");
    const controllerLoader = new Loader({
      type: "controller",
      path: config.controllers.dir
    });

    registry.register("loader:controller", controllerLoader);

    if (config.database) {
      const modelLoader = new Loader({
        type: "model",
        path: config.database.models.dir
      });

      registry.register("loader:model", modelLoader);
    }

    let serializerLoader;

    /* eslint-disable no-empty */
    try {
      serializerLoader = new Loader({
        filter: /(.*).js$/,
        type: "serializer",
        path: config.serializers.dir
      });
    } catch (err) {}
    /* eslint-enable no-empty */

    registry.register("loader:serializer", serializerLoader);
  },

  name: "loaders"
};
