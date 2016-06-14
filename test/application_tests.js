"use strict";

import path from "path";

import { expect } from "chai";

import Application from "../src/application";
import Router from "../src/router";

describe("Application", function () {
  let application;

  describe("#map", function () {
    beforeEach(function () {
      application = new Application({
        controllers: {
          dir: path.resolve(__dirname, "fixtures", "controllers")
        }
      });
    });

    it("gets called with a Router instance", function () {
      application.map(function () {
        expect(this).to.be.an.instanceof(Router);
      });
    });

    it.skip("maps routes to their controller", function () {
      application.map(function () {
        this.resource("user");
      });

      supertest(application.getApp())
        .get("/users")
        .expect(200)
        .end(done);
    });
  });
});
