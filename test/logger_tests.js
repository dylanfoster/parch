"use strict";

import fs from "fs";
import path from "path";

import Bunyan from "bunyan";
import del from "del";
import { expect } from "chai";
import restify from "restify";
import stream from "stream";

import Logger from "../src/logger";

const LOGS_DIR = path.resolve(__dirname, "fixtures", "logs");

describe("Logger", function () {
  let logger, messages, writable;

  afterEach(function () {
    return del([`${LOGS_DIR}/**/*.log`, `!${LOGS_DIR}`]);
  });

  it("logs to a directory", function (done) {
    logger = Logger.create(null, { dir: LOGS_DIR });

    logger.info("foo");

    fs.readdir(LOGS_DIR, (err, files) => {
      if (err) { return done(err); }

      expect(files).to.have.length(2);

      const log = JSON.parse(
        fs.readFileSync(path.join(LOGS_DIR, files.filter(file => file.match(/\.log/))[0])).toString()
      );

      expect(log.msg).to.eql("foo");
      done();
    });
  });

  describe("create", function () {
    it("returns a new instance of Logger", function () {
      logger = Logger.create();

      expect(logger).to.be.an.instanceof(Bunyan);
    });

    it("returns a new named instance", function () {
      logger = Logger.create("rainbowbunny");

      expect(logger.fields.name).to.eql("rainbowbunny");
    });

    it("defaults name to 'api'", function () {
      logger = Logger.create();

      expect(logger.fields.name).to.eql("api");
    });
  });

  describe("requests", function () {
    beforeEach(function () {
      logger = Logger.create();
      messages = [];
      writable = new stream.Writable();

      stream.write = message => {
        messages.push(JSON.parse(message));
      };

      logger.addStream({
        type: "stream",
        stream
      });
    });

    it("logs allowed properties only", function () {
      logger.info({
        req: {
          body: { foo: "bar" },
          httpVersion: "1.1",
          method: "GET",
          params: { id: "2" },
          query: { lastName: "heisenburg" },
          url: "/users"
        }
      });

      expect(messages[0].req).to.eql({
        httpVersion: "1.1",
        method: "GET",
        params: { id: "2" },
        query: { lastName: "heisenburg" },
        url: "/users"
      });
    });
  });

  describe("responses", function () {
    beforeEach(function () {
      logger = Logger.create();
      messages = [];
      writable = new stream.Writable();

      stream.write = message => {
        messages.push(JSON.parse(message));
      };

      logger.addStream({
        type: "stream",
        stream
      });
    });

    it("logs allowed properties only", function () {
      logger.info({
        res: {
          body: { },
          statusCode: 200,
          headers: {
            "Content-Type": "application/json"
          }
        }
      });

      expect(messages[0].res).to.eql({
        statusCode: 200,
        headers: {
          "Content-Type": "application/json"
        }
      });
    });
  });

  describe("errors", function () {
    beforeEach(function () {
      logger = Logger.create();
      messages = [];
      writable = new stream.Writable();

      stream.write = message => {
        messages.push(JSON.parse(message));
      };

      logger.addStream({
        type: "stream",
        stream
      });
    });

    it("logs allowed properties only", function () {
      logger.error(new restify.InternalServerError("Something broke"));

      const error = messages[0].err;

      expect(error.name).to.eql("InternalServerError");
      expect(error.message).to.eql("Something broke");
    });

    it("logs entire error if not an instance of Error", function () {
      logger.error({ err: "Something broke" });

      const error = messages[0].err;

      expect(error).to.eql("Something broke");
    });
  });
});
