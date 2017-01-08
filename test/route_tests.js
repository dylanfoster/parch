"use strict";

import path from "path";

import chai, { expect } from "chai";
import restify from "restify";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import supertest from "supertest";

import Route from "../src/route";

chai.use(sinonChai);

describe("Route", function () {
  let route;

  it("builds a route from an array of segments", function () {
    route = new Route("foo", "/bar", "baz/");

    expect(route.path).to.eql("/foo/bar/baz");
  });
});
