"use strict";

import path from "path";

import chai, { expect } from "chai";
import restify from "restify";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import supertest from "supertest";

import Router from "../src/router";
import { loader } from "./fixtures";

chai.use(sinonChai);

describe("Router", function () {
  let app, client, router;

  beforeEach(function () {
    app = restify.createServer();
    router = new Router({
      app,
      loader
    });
    client = supertest(app);
  });

  it("uses a namespace", function () {
    router = new Router({
      app,
      loader,
      namespace: "api"
    });
    router.resource("foo");
    client = supertest(app);

    return client.get("/api/foos")
      .expect(200);
  });

  describe("namespace", function () {
    it("maps a set of routes to a namespace", function () {
      router.namespace("/foos/:fooId", [
        { path: "/setBaz", using: "foo:baz", method: "post" },
        { path: "/getQux", using: "foo:qux", method: "get" }
      ]);

      return client
        .post("/foos/1/setBaz")
        .then(res => {
          expect(res.statusCode).to.eql(200);
          expect(res.body.baz).to.eql("qux");
        })
        .then(() => client.get("/foos/1/getQux"))
        .then(res => {
          expect(res.statusCode).to.eql(200);
          expect(res.body.qux).to.eql("quux");
        });
    });

    it("properly maps routes if slashes are left out", function () {
      router.namespace("/foos/:fooId", [
        { path: "setBaz", using: "foo:baz", method: "post" },
        { path: "getQux", using: "foo:qux", method: "get" }
      ]);

      return client
        .post("/foos/1/setBaz")
        .then(res => {
          expect(res.statusCode).to.eql(200);
          expect(res.body.baz).to.eql("qux");
        })
        .then(() => client.get("/foos/1/getQux"))
        .then(res => {
          expect(res.statusCode).to.eql(200);
          expect(res.body.qux).to.eql("quux");
        });
    });
  });

  describe("map", function () {
    it("returns an instance of Router", function () {
      router = Router.map({ loader }, function () {});

      expect(router).to.be.an.instanceof(Router);
    });

    it("calls callback with an instance of Router", function () {
      Router.map({ loader }, function () {
        expect(this).to.be.an.instanceof(Router);
      });
    });
  });

  describe.only("#resource", function () {
    beforeEach(function () {
      router.resource("foo");
      client = supertest(app);
    });

    it("maps a resource to a controller's index method", function (done) {
      client.get("/foos")
        .expect(200, { foos: [] })
        .end(done);
    });

    it("maps a resource to a controller's show method", function (done) {
      client.get("/foos/1")
        .expect(200, { foo: {}})
        .end(done);
    });

    it("maps a resource to a controller's create method", function (done) {
      client.post("/foos")
        .send({ name: "bar" })
        .expect(201)
        .end(done);
    });

    it("maps a resource to a controller's update method", function (done) {
      client.put("/foos/1")
        .send({ name: "baz" })
        .expect(200)
        .end(done);
    });

    it("maps a resource to a controller's destroy method", function (done) {
      client.del("/foos/1")
        .expect(204)
        .end(done);
    });

    describe("hooks", function () {
      let controller, create, destroy, hooks, index, show, update;

      beforeEach(function () {
        controller = router.controllers.get("foo");
      });

      it("binds a controller's index hooks", function (done) {
        client.get("/foos")
          .expect(200)
          .end(function (err, res) {
            if (err) { return done(err); }

            expect(controller.hooks.index.before.called).to.be.true;
            expect(controller.hooks.index.after.called).to.be.true;
            done();
          });
      });

      it("binds a controller's show hooks", function (done) {
        client.get("/foos/1")
          .expect(200)
          .end(function (err, res) {
            if (err) { return done(err); }

            expect(controller.hooks.show.before.called).to.be.true;
            expect(controller.hooks.show.after.called).to.be.true;
            done();
          });
      });

      it("binds a controller's create hooks", function (done) {
        client.post("/foos")
          .expect(201)
          .end(function (err, res) {
            if (err) { return done(err); }

            expect(controller.hooks.create.before.called).to.be.true;
            expect(controller.hooks.create.after.called).to.be.true;
            done();
          });
      });

      it("binds a controller's update hooks", function (done) {
        client.put("/foos/1")
          .expect(200)
          .end(function (err, res) {
            if (err) { return done(err); }

            expect(controller.hooks.update.before.called).to.be.true;
            expect(controller.hooks.update.after.called).to.be.true;
            done();
          });
      });

      it("binds a controller's destroy hooks", function (done) {
        client.del("/foos/1")
          .expect(204)
          .end(function (err, res) {
            if (err) { return done(err); }

            expect(controller.hooks.destroy.before.called).to.be.true;
            expect(controller.hooks.destroy.after.called).to.be.true;
            done();
          });
      });
    });
  });

  describe("#route", function () {
    let controller;

    beforeEach(function () {
      controller = router.controllers.get("foo");
    });

    it("maps a static route to a controller action", function (done) {
      router.route("/foo/bar", { using: "foo:bar", method: "get" });

      client.get("/foo/bar")
        .expect(200)
        .end(done);
    });

    it("binds before and after hooks", function (done) {
      router.route("/foo/bar", { using: "foo:bar", method: "get" });

      client.get("/foo/bar")
        .expect(200)
        .end(function (err, res) {
          if (err) { return done(err); }

          expect(controller.hooks.bar.before.called).to.be.true;
          expect(controller.hooks.bar.after.called).to.be.true;
          done();
        });
    });
  });
});
