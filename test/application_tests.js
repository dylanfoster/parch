"use strict";

import { expect } from "chai";

import Application from "../src/application";
import Router from "../src/router";

describe("Application", function () {
  let application;

  describe("#map", function () {
    beforeEach(function () {
      application = new Application();
    });

    it("gets called with a Router instance", function () {
      application.map(function () {
        expect(this).to.be.an.instanceof(Router);
      });
    });
  });
});
