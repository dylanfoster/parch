"use strict";

import { expect } from "chai";

import Router from "../src/router";

describe("Router", function () {
  describe("map", function () {
    it("returns an instance of Router", function () {
      const router = Router.map(function () {});

      expect(router).to.be.an.instanceof(Router);
    });

    it("calls callback with an instance of Router", function () {
      Router.map(function () {
        expect(this).to.be.an.instanceof(Router);
      });
    });
  });

  describe("#resource", function () {
    it("maps a resource to a controller's index method");

    it("maps a resource to a controller's show method");

    it("maps a resource to a controller's create method");

    it("maps a resource to a controller's update method");

    it("maps a resource to a controller's destroy method");
  });
});
