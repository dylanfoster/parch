"use strict";

import { expect } from "chai";

import { application } from "../fixtures";
import initializer from "../../src/initializers/application";

describe("initializer | application", function () {
  let registry;

  beforeEach(function () {
    registry = application.registry;
  });

  describe("#initialize", function () {
    it("registers the application injections", function () {
      initializer.initialize(application, registry);

      const app = registry.lookup("application:main");

      expect(app).to.eql(application);
    });
  });
});
