"use strict";

import { expect } from "chai";

import Store from "../src/store";
import {
  application,
  modelManager,
  registry
} from "./fixtures";

describe.only("Store", function () {
  let store;

  beforeEach(function () {
    store = new Store(registry);

    application.map(function () {
      this.resource("foo");
    });

    return modelManager.sequelize.sync({ force: true });
  });

  describe("#createRecord", function () {
    it("creates a record", function () {
      return store.createRecord("foo", { type: "bar" }).then(res => {
        expect(res.foo.type).to.eql("bar");
      });
    });
  });

  describe("#findAll", function () {
    beforeEach(function () {
      return modelManager.models.Foo.create({ type: "bar" });
    });

    it("returns all records", function () {
      return store.findAll("foo").then(res => {
        expect(res.foos[0].type).to.eql("bar");
      });
    });
  });

  describe("#findOne", function () {
    beforeEach(function () {
      return modelManager.models.Foo.create({ type: "bar" });
    });

    it("returns a single record by id", function () {
      return store.findOne("foo", 1).then(res => {
        expect(res.foo.type).to.eql("bar");
      });
    });
  });

  describe("#queryRecord", function () {
    it("returns a single record from a query");
  });

  describe("updateRecord", function () {
    it("updates a record");
  });
});
