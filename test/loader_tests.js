"use strict";

import path from "path";

import { expect } from "chai";

import Loader from "../src/loader";

describe("Loader", function () {
  let loader;

  beforeEach(function () {
    loader = new Loader({
      type: "controller",
      path: path.resolve(__dirname, "fixtures", "controllers")
    });
  });

  describe("filter", function () {
    it("is configurable", function () {
      loader = new Loader({
        filter: /(.+)-controller\.js$/i,
        type: "controller",
        path: path.resolve(__dirname, "fixtures", "controllers")
      });

      const controller = loader.get("bar");

      expect(controller.name).to.eql("BarController");
    });
  });

  describe("#get", function () {
    it("returns a class by name", function () {
      const controller = loader.get("foo");

      expect(controller.name).to.eql("FooController");
    });

    it("matches classes with hyphens", function () {
      const controller = loader.get("bar");

      expect(controller.name).to.eql("BarController");
    });

    it("matches clasess with underscores", function () {
      const controller = loader.get("baz");

      expect(controller.name).to.eql("BazController");
    });

    it("loads classes that are plural", function () {
      const controller = loader.get("user");

      expect(controller.name).to.eql("UsersController");
    });
  });
});
