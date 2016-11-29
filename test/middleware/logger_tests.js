"use strict";

import Bunyan from "bunyan";
import chai, { expect } from "chai";
import restify from "restify";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import supertest from "supertest";

import Logger from "../../src/logger";
import logger from "../../src/middleware/logger";

chai.use(sinonChai);

describe("middleware:logger", function () {
  let app, log, server;

  beforeEach(function () {
    app = restify.createServer();
    log = Logger.create();
    app.use(logger({ log }));
    app.get("/foo", function (req, res, next) {
      res.send({ foo: "bar" });
    });
    server = supertest(app);
    sinon.spy(log, "child");
  });

  afterEach(function () {
    log.child.restore();
  });

  it("logs the request", function (done) {
    server
      .get("/foo")
      .end(function (err) {
        if (err) { return done(err); }

        expect(log.child).to.have.been.called;
        done();
      });
  });
});
