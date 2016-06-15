"use strict";

import path from "path";

import { expect } from "chai";
import restify from "restify";
import supertest from "supertest";

import Router from "../src/router";
import Loader from "../src/loader";

const controllerLoader = new Loader({
  type: "controller",
  path: path.resolve(__dirname, "fixtures/controllers")
})

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

  describe.only("#resource", function () {
    let app, client, router;

    beforeEach(function () {
      app = restify.createServer();
      router = new Router({
        app,
        loader: { controllers: controllerLoader }
      });
      router.resource("foo");

      client = supertest(app);
    });

    it("maps a resource to a controller's index method", function (done) {
      client.get("/foos")
        .expect(200, { foos: [] })
        .end(done);
    });

    it("maps a resource to a controller's show method");

    it("maps a resource to a controller's create method");

    it("maps a resource to a controller's update method");

    it("maps a resource to a controller's destroy method");
  });
});
