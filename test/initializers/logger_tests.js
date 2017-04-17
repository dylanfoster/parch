"use strict";

import path from "path";

import Bunyan from "bunyan";
import { expect } from "chai";

import Application from "../../src/application";
import { application } from "../fixtures";
import initializer from "../../src/initializers/logger";

describe("initializer | logger", function () {
  let registry;

  beforeEach(function () {
    registry = application.registry;
  });

  describe("#initialize", function () {
    it("registers the logger injections", function () {
      initializer.initialize(application, registry);

      const logger = registry.lookup("service:logger");

      expect(logger).to.be.ok;
      expect(logger).to.be.instanceof(Bunyan);
      expect(application.logger).to.be.instanceof(Bunyan);
    });

    it("registers the logger if it is user passed", function () {
      const app = new Application({
        database: {
          connection: {
            dialect: "sqlite",
            database: "test",
            username: "test",
            password: "test",
            logging: false
          },
          models: {
            dir: path.resolve(__dirname, "../fixtures/models")
          }
        },
        controllers: {
          dir: path.resolve(__dirname, "../fixtures/controllers")
        },
        log: Bunyan.createLogger({ name: "user", streams: [] }),
        serializers: {
          dir: path.resolve(__dirname, "../fixtures", "serializers")
        }
      });

      initializer.initialize(app, registry);

      const logger = registry.lookup("service:logger");

      expect(logger).to.be.ok;
      expect(logger).to.be.instanceof(Bunyan);
      expect(app.logger).to.be.instanceof(Bunyan);
    });
  });
});
