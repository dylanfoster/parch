"use strict";

import { expect } from "chai";

import ModelManager from "../src/model_manager";
import Registry from "../src/registry";

describe("Registry", function () {
  let registry;

  beforeEach(function () {
    registry = new Registry();
  });

  describe("#register", function () {
    it("registers an object", function () {
      registry.register("service:foo", { foo: "bar" });

      expect(registry.lookup("service:foo")).to.eql({ foo: "bar" });
    });

    it("instantiates an object", function () {
      class Foo {}
      registry.register("service:foo", Foo, { instantiate: true });

      expect(registry.lookup("service:foo")).to.be.an.instanceof(Foo);
    });

    it("doesn't overwrite existing instances", function () {
      const foo = { bar: "baz" };

      registry.register("service:foo", foo, { singleton: true });

      expect(function () {
        registry.register("service:foo", "bar");
      }).to.throw("Cannot re-register singleton object");
    });
  });

  describe("#lookup", function () {
    beforeEach(function () {
      registry.register("config:main", {
        database: {
          connection: {
            dialect: "sqlite",
            database: "test",
            username: "test",
            password: "test",
            logging: false
          }
        }
      });
    });

    it("finds and returns an object by reference", function () {
      registry.register("service:foo", { foo: "bar" });

      expect(registry.lookup("service:foo")).to.eql({ foo: "bar" });
    });

    it("requires in a new module if one is not registered", function () {
      const Lookup = registry.lookup("module:model-manager");
      const manager = new Lookup(registry);

      expect(manager.models).to.eql({});
    });
  });

  describe("#inject", function () {
    it("injects an object into another", function () {
      const obj = { bar: "baz" };

      registry.register("service:foo", { foo: "bar" });
      registry.inject(obj, "service:foo");

      expect(obj.service).to.eql({ foo: "bar" });
    });

    it("doesn't overwrite an existing reference", function () {
      const obj = { foo: "foo", bar: "baz" };

      registry.register("service:foo", { foo: "bar" });
      registry.inject(obj, "service:foo");

      expect(obj.service).to.eql({ foo: "bar" });
    });

    it("injects an object with a given property name", function () {
      const obj = { bar: "baz" };

      registry.register("service:foo", { foo: "bar" });
      registry.inject(obj, "service:foo", "fooService");

      expect(obj.fooService).to.eql({ foo: "bar" });
    });

    it("throws an error if the object hasn't been registered", function () {
      const obj = { bar: "baz" };

      expect(function () {
        registry.inject(obj, "service:foo");
      }).to.throw("Attempted to inject unknown object 'service:foo'");
    });
  });
});
