"use strict";

import { expect } from "chai";

import { application } from "../fixtures";
import initializer from "../../src/initializers/router";

describe("initializer | router", function () {
  let registry;

  beforeEach(function () {
    registry = application.registry;
  });

  describe("#initialize", function () {
    it("registers the router", function (done) {
      initializer.initialize(application, registry);

      const Router = registry.lookup("service:router");

      expect(application).to.have.property("map");

      application.map(function () {
        expect(this).to.be.instanceof(Router);
        done();
      });
    });
  });
});
