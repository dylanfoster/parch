"use strict";

import path from "path";

import { expect } from "chai";
import restify from "restify";
import supertest from "supertest";

import Router from "../src/router";

describe("Router", function () {
  describe("map", function () {
    it("returns an instance of Router", function () {
      const router = Router.map({}, function () {});

      expect(router).to.be.an.instanceof(Router);
    });

    it("calls callback with an instance of Router", function () {
      Router.map({}, function () {
        expect(this).to.be.an.instanceof(Router);
      });
    });
  });

  describe.skip("#resource", function () {
    let app, client, router;

    beforeEach(function () {
      app = restify.createServer();
      router = new Router({
        app,
        controllers: path.resolve(__dirname, "fixtures", "controllers" )
      });
      router.resource("user");

      client = supertest(app);
    });

    it("maps a resource to a controller's index method", function (done) {
      client.get("/users")
        .expect(200, { users: [] })
        .end(done);
    });

    it("maps a resource to a controller's show method");

    it("maps a resource to a controller's create method");

    it("maps a resource to a controller's update method");

    it("maps a resource to a controller's destroy method");
  });
});
