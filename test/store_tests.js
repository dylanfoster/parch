"use strict";

import { expect } from "chai";

import Store from "../src/store";
import {
  application,
  modelManager,
  registry
} from "./fixtures";

describe("Store", function () {
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
        expect(res.type).to.eql("bar");
      });
    });
  });

  describe("#findAll", function () {
    beforeEach(function () {
      return modelManager.models.Foo.create({ type: "bar" });
    });

    it("returns all records", function () {
      return store.findAll("foo").then(res => {
        expect(res[0].type).to.eql("bar");
      });
    });
  });

  describe("#findOne", function () {
    let foo;

    beforeEach(function () {
      return modelManager.models.Foo.create({ type: "bar" })
        .then(_foo => {
          foo = _foo;
        });
    });

    it("returns a single record by id", function () {
      return store.findOne("foo", foo.id).then(res => {
        expect(res.type).to.eql("bar");
      });
    });
  });

  describe("#queryRecord", function () {
    beforeEach(function () {
      return modelManager.models.Foo.create({ type: "bar" });
    });

    it("returns a single record by query", function () {
      return store.queryRecord("foo", { type: "bar" }).then(res => {
        expect(res.type).to.eql("bar");
      });
    });
  });

  describe("updateRecord", function () {
    let foo;

    beforeEach(function () {
      return modelManager.models.Foo.create({ type: "bar" })
        .then(_foo => {
          foo = _foo;
        });
    });

    it("updates a record", function () {
      return store.updateRecord("foo", foo.id, { type: "baz" }).then(res => {
        expect(res.type).to.eql("baz");
      });
    });
  });
});
