"use strict";

import chai, { expect } from "chai";
import restify from "restify";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import supertest from "supertest";

import contextMiddlware from "../../lib/middleware/context";

chai.use(sinonChai);

describe("middleware:context", function () {
  let app, server;

  beforeEach(function () {
    app = restify.createServer();
    app.use(contextMiddlware({ foo: "bar" }));
    app.get("/foo", function (req, res, next) {
      res.send(req.app);
    });
    server = supertest(app);
  });

  it("adds the app the request object", function (done) {
    server.get("/foo")
      .end(function (err, res) {
        if (err) { return done(err); }

        expect(res.body.foo).to.eql("bar");
        done();
      });
  });
});
