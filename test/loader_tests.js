"use strict";

import path from "path";

import { expect } from "chai";

import Loader from "../src/loader";

describe("loader", function () {
  let loader;

  beforeEach(function () {
    loader = new Loader({
      type: "controllers",
      path: path.resolve(__dirname, "fixtures", "controllers")
    });
  });

  describe("#get", function () {
    it.skip("returns a class by name", function () {
      const controller = loader.get("controllers", "foo");

      expect(controller.constructor.name).to.eql("foo");
    });
  });
});
