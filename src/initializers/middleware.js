"use strict";

import _ from "lodash";
import jwt from "restify-jwt";
import restify from "restify";

import context from "../middleware/context";
import logger from "../middleware/logger";

const DEFAULT_JWT_SECRET = "secret";
const DEFAULT_MIDDLEWARES = [
  restify.gzipResponse(),
  restify.CORS(),
  restify.authorizationParser(),
  restify.bodyParser(),
  restify.fullResponse(),
  restify.queryParser()
];

module.exports = {
  initialize(application, registry) {
    const config = registry.lookup("config:main");
    const middlewares = _.union(this.middleware, config.server.middlewares);
    const app = registry.lookup("service:server");

    middlewares.unshift(restify.acceptParser(app.acceptable));

    if (config.authentication) {
      let secret, unless;

      if (_.isObject(config.authentication)) {
        secret = config.authentication.secretKey || DEFAULT_JWT_SECRET;
        unless = config.authentication.unauthenticated || null;
      } else {
        secret = DEFAULT_JWT_SECRET;
        unless = [];
      }

      middlewares.unshift(jwt({ secret }).unless({ path: unless }));
    }

    middlewares.unshift(logger({ log: application.logger }));
    middlewares.push(context(application));
    app.on("after", (req, res, route, err) => {
      req.log.info({ req, res, err });
    });
    middlewares.forEach(middlware => { app.use(middlware); });
  },

  middleware: DEFAULT_MIDDLEWARES,

  name: "middleware"
};
