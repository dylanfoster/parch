"use strict";

import ORM from "@parch-js/orm";
import { expect } from "chai";

import { application } from "../fixtures";
import initializer from "../../src/initializers/store";

describe("initializer | store", function () {
  let registry;

  beforeEach(function () {
    registry = application.registry;
  });

  describe("#initialize", function () {
    it("registers the store service", function () {
      initializer.initialize(application, registry);

      expect(application.store).to.be.ok;
      expect(registry.lookup("service:store").findAll).to.be.ok;
      expect(registry.lookup("service:store").findOne).to.be.ok;
      expect(registry.lookup("service:store").queryRecord).to.be.ok;
      expect(registry.lookup("service:store").createRecord).to.be.ok;
      expect(registry.lookup("service:store").updateRecord).to.be.ok;
      expect(registry.lookup("service:store").destroyRecord).to.be.ok;
    });
  });
});
