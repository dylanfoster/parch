"use strict";

require("events").EventEmitter.defaultMaxListeners = Infinity;

import fs from "fs";
import path from "path";

import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import del from "del";
import jwt from "jsonwebtoken";
import restify from "restify";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import stream from "stream";
import supertest from "supertest";

chai.use(chaiAsPromised);
chai.use(sinonChai);

import Application from "../src/application";
import Router from "../src/router";
import { connection } from "./fixtures";

describe("Application", function () {
  let application;

  describe("#projectDirectory", function () {
    it("returns the current project directory", function () {
      application = new Application({
        controllers: {
          dir: path.resolve(__dirname, "fixtures", "controllers")
        },
        database: {
          connection,
          models: { dir: path.resolve(__dirname, "fixtures/models") }
        },
        initializers: {
          dir: path.resolve(__dirname, "fixtures", "initializers")
        },
        serializers: {
          dir: path.resolve(__dirname, "fixtures", "serializers")
        }
      });

      expect(application.projectDirectory).to.eql(__dirname);
    });
  });

  describe("#runProjectInitializers", function () {
    beforeEach(function () {
      application = new Application({
        controllers: {
          dir: path.resolve(__dirname, "fixtures", "controllers")
        },
        database: {
          connection,
          models: { dir: path.resolve(__dirname, "fixtures/models") }
        },
        initializers: {
          dir: path.resolve(__dirname, "fixtures", "initializers")
        },
        serializers: {
          dir: path.resolve(__dirname, "fixtures", "serializers")
        }
      });
    });

    it("runs a project's initializers", function () {
      return application.runProjectInitializers().then(() => {
        expect(application.foo.foo).to.eql("bar");
      });
    });

    it("doesn't throw for a missing initializers directory", function () {
      application = new Application({
        controllers: {
          dir: path.resolve(__dirname, "fixtures", "controllers")
        },
        database: {
          connection,
          models: { dir: path.resolve(__dirname, "fixtures/models") }
        },
        initializers: {
          dir: path.resolve(__dirname, "fixtures", "missing-initializers")
        },
        serializers: {
          dir: path.resolve(__dirname, "fixtures", "serializers")
        }
      });

      return expect(application.runProjectInitializers()).to.be.fulfilled;
    });
  });

  describe("#map", function () {
    beforeEach(function () {
      application = new Application({
        controllers: {
          dir: path.resolve(__dirname, "fixtures", "controllers")
        },
        database: {
          connection,
          models: { dir: path.resolve(__dirname, "fixtures/models") }
        },
        serializers: {
          dir: path.resolve(__dirname, "fixtures", "serializers")
        }
      });
    });

    it("gets called with a Router instance", function (done) {
      application.map(function () {
        expect(this).to.have.property("resource");
        done();
      });
    });

    it("maps routes to their controller", function (done) {
      application.map(function () {
        this.resource("foo");
      });

      supertest(application.getApp())
        .get("/foos")
        .expect(200)
        .end(done);
    });
  });

  describe("#start", function () {
    const mockRestify = restify.createServer();

    beforeEach(function () {
      sinon.spy(mockRestify, "listen");
      application = new Application({
        app: mockRestify,
        controllers: {
          dir: path.resolve(__dirname, "fixtures", "controllers")
        },
        database: {
          connection,
          models: {
            dir: path.resolve(__dirname, "fixtures/models")
          }
        },
        initializers: {
          dir: path.resolve(__dirname, "fixtures", "initializers")
        },
        serializers: {
          dir: path.resolve(__dirname, "fixtures", "serializers")
        }
      });
      sinon.spy(application, "runProjectInitializers");
    });

    afterEach(function () {
      mockRestify.listen.restore();
    });

    it("starts the application", function () {
      return application.start().then(() => {
        expect(application.runProjectInitializers).to.have.been.called;
        expect(mockRestify.listen).to.have.been.calledWith(3000);
      });
    });
  });

  describe("authentication", function () {
    beforeEach(function (done) {
      application = new Application({
        authentication: {
          unauthenticated: [/\/resetPassword/]
        },
        controllers: {
          dir: path.resolve(__dirname, "fixtures", "controllers")
        },
        database: {
          connection,
          models: { dir: path.resolve(__dirname, "fixtures/models") }
        },
        serializers: {
          dir: path.resolve(__dirname, "fixtures", "serializers")
        }
      });

      application.map(function () {
        this.resource("user");
        this.route("/users/resetPassword", { using: "user:resetPassword", method: "post" });

        done();
      });
    });

    it("authenticates users via jwt", function (done) {
      const token = jwt.sign({ foo: "bar" }, "secret");

      supertest(application.getApp())
        .get("/users")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .end(done);
    });

    it("skips 'unauthenticated' routes", function (done) {
      supertest(application.getApp())
        .post("/users/resetPassword")
        .expect(200)
        .end(done);
    });

    it("disables auth if not set by the user", function (done) {
      application = new Application({
        controllers: {
          dir: path.resolve(__dirname, "fixtures", "controllers")
        },
        database: {
          connection,
          models: { dir: path.resolve(__dirname, "fixtures/models") }
        },
        serializers: {
          dir: path.resolve(__dirname, "fixtures", "serializers")
        }
      });
      application.map(function () {
        this.resource("user");
      });

      supertest(application.getApp())
        .get("/users")
        .expect(200)
        .end(done);
    });

    it("can be enabled by setting to true", function (done) {
      application = new Application({
        authentication: true,
        controllers: {
          dir: path.resolve(__dirname, "fixtures", "controllers")
        },
        database: {
          connection,
          models: { dir: path.resolve(__dirname, "fixtures/models") }
        },
        serializers: {
          dir: path.resolve(__dirname, "fixtures", "serializers")
        }
      });
      application.map(function () {
        this.resource("user");
      });
      supertest(application.getApp())
        .get("/users")
        .expect(401)
        .end(done);
    });
  });

  describe("logging", function () {
    let loggingDir, messages, writable;

    beforeEach(function () {
      loggingDir = path.resolve(__dirname, "fixtures/custom-logs");
      messages = [];
      stream.write = message => {
        messages.push(JSON.parse(message));
      };
    });

    afterEach(function () {
      return del([`${loggingDir}/**/*.log`, `!${loggingDir}`]);
    });

    it("allows for a custom directory", function (done) {
      application = new Application({
        controllers: {
          dir: path.resolve(__dirname, "fixtures", "controllers")
        },
        database: {
          connection,
          models: { dir: path.resolve(__dirname, "fixtures/models") }
        },
        logging: {
          dir: loggingDir
        },
        serializers: {
          dir: path.resolve(__dirname, "fixtures", "serializers")
        }
      });

      application.map(function () {
        this.resource("user");
      });

      supertest(application.getApp())
        .get("/users")
        .end(function (err, res) {
          if (err) { return done(err); }

          fs.readdir(loggingDir, (err2, files) => {
            if (err2) { return done(err2); }

            const file = files.filter(f => f.match(/\.log/));
            let log;

            expect(file).to.be.ok;
            expect(file).to.have.length.gt(0);

            const fileData = fs.readFileSync(path.resolve(loggingDir, file[0]));
            const lines = fileData
              .toString()
              .split("\n")
              .filter(line => line.length);
            const line = lines[lines.length - 1];

            try {
              log = JSON.parse(line);
            } catch (err3) {
              throw err3;
            }

            expect(log.res.statusCode).to.eql(200);

            done();
          });
        });
    });

    it("allows for custom request serializer", function (done) {
      application = new Application({
        controllers: {
          dir: path.resolve(__dirname, "fixtures", "controllers")
        },
        database: {
          connection,
          models: { dir: path.resolve(__dirname, "fixtures/models") }
        },
        logging: {
          serializers: {
            req(req) {
              return { url: req.url };
            }
          }
        },
        serializers: {
          dir: path.resolve(__dirname, "fixtures", "serializers")
        }
      });

      application.logger.addStream({
        type: "stream",
        stream
      });
      application.map(function () {
        this.resource("user");
      });
      supertest(application.getApp())
        .get("/users")
        .end(function (err, res) {
          if (err) { return done(err); }

          expect(messages[0].req.url).to.eql("/users");
          expect(messages[0].req).to.not.have.any.keys("httpVersion", "method");
          done();
        });
    });

    it("allows for custom response serializer", function (done) {
      application = new Application({
        controllers: {
          dir: path.resolve(__dirname, "fixtures", "controllers")
        },
        database: {
          connection,
          models: { dir: path.resolve(__dirname, "fixtures/models") }
        },
        logging: {
          serializers: {
            res(res) {
              return { statusCode: res.statusCode };
            }
          }
        },
        serializers: {
          dir: path.resolve(__dirname, "fixtures", "serializers")
        }
      });

      application.logger.addStream({
        type: "stream",
        stream
      });
      application.map(function () {
        this.resource("user");
      });
      supertest(application.getApp())
        .get("/users")
        .end(function (err, res) {
          if (err) { return done(err); }

          expect(messages[0].res.statusCode).to.eql(200);
          expect(messages[0].req).to.not.have.any.keys("headers");
          done();
        });
    });
  });

  describe("serializers", function () {
    it("uses JSONSerializer by default", function () {
      application = new Application({
        controllers: {
          dir: path.resolve(__dirname, "fixtures", "controllers")
        },
        database: {
          connection,
          models: { dir: path.resolve(__dirname, "fixtures/models") }
        },
        logging: {
          serializers: {
            res(res) {
              return { statusCode: res.statusCode };
            }
          }
        }
      });
      application.map(function () {
        this.resource("user");
      });
    });
  });
});
