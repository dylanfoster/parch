"use strict";

import path from "path";

import chai, { expect } from "chai";
import restify from "restify";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import supertest from "supertest";

import RouteSegment from "../src/route_segment";

chai.use(sinonChai);

describe("RouteSegment", function () {
  let segment;

  describe("#hasLeadingSlash", function () {
    it("returns true if segment has a leading slash", function () {
      segment = new RouteSegment("/foo");

      expect(segment.hasLeadingSlash()).to.be.true;
    });

    it("returns false if segment does not have a leading slash", function () {
      segment = new RouteSegment("foo");

      expect(segment.hasLeadingSlash()).to.be.false;
    });

    it("returns true if segment has leading and trailing slash", function () {
      segment = new RouteSegment("/foo/");

      expect(segment.hasLeadingSlash()).to.be.true;
    });

    it("returns false if segment has trailing slash only", function () {
      segment = new RouteSegment("foo/");

      expect(segment.hasLeadingSlash()).to.be.false;
    });
  });

  describe("#hasTrailingSlash", function () {
    it("returns true if segment has a trailing slash", function () {
      segment = new RouteSegment("foo/");

      expect(segment.hasTrailingSlash()).to.be.true;
    });

    it("returns false if segment does not have a leading slash", function () {
      segment = new RouteSegment("foo");

      expect(segment.hasTrailingSlash()).to.be.false;
    });

    it("returns true if segment has leading and trailing slash", function () {
      segment = new RouteSegment("/foo/");

      expect(segment.hasTrailingSlash()).to.be.true;
    });

    it("returns false if segment has a leading slash only", function () {
      segment = new RouteSegment("/foo");

      expect(segment.hasTrailingSlash()).to.be.false;
    });
  });

  it("builds path with leading slash", function () {
    segment = new RouteSegment("/foo");

    expect(segment.path).to.eql("/foo");
  });

  it("builds path without leading slash", function () {
    segment = new RouteSegment("foo");

    expect(segment.path).to.eql("/foo");
  });

  it("builds path with leading and trailing slash", function () {
    segment = new RouteSegment("/foo/");

    expect(segment.path).to.eql("/foo");
  });

  it("builds path with a trailing slash", function () {
    segment = new RouteSegment("foo/");

    expect(segment.path).to.eql("/foo");
  });

  it("builds path with empty string", function () {
    segment = new RouteSegment("");

    expect(segment.path).to.eql("");
  });
});
