"use strict";

import { expect } from "chai";
import sinon from "sinon";

import deprecate from "../../src/utils/deprecate";

describe("util | deprecate", function () {
  beforeEach(function () {
    sinon.stub(process.stderr, "write");
  });

  afterEach(function () {
    process.stderr.write.restore();
  });

  describe("#deprecate", function () {
    it("logs a deprecation message", function () {
      deprecate(function () {}, "foo", "1.0.0");

      expect(process.stderr.write).to.have.been.called;
    });

    it("throws an error for missing target", function () {
      expect(function () {
        deprecate();
      }).to.throw("You must pass a target to deprecate");
    });

    it("throws an error if target isn't an function", function () {
      expect(function () {
        deprecate("foo");
      }).to.throw("'target' must be a function or object");
    });

    it("doesn't throw if target is an object or class", function () {
      class Foo {
        constructor() {}

        bar() {
          deprecate(this, "bar", "foo");
        }
      }
      const instance = new Foo();

      instance.bar();

      expect(function () {
        deprecate(instance, "foo", "bar");
      }).to.not.throw;
    });

    it("throws an error for missing value", function () {
      expect(function () {
        deprecate(function () {});
      }).to.throw("You must pass a value to deprecate");
    });

    it("throws an error for missing version", function () {
      expect(function () {
        deprecate(function () {}, "foo");
      }).to.throw("You must pass a version to deprecate");
    });
  });
});
