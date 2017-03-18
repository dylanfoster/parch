"use strict";

import { expect } from "chai";

import containment from "../src/containment";
import { registry } from "./fixtures";

describe("containment", function () {
  let child, parent;

  beforeEach(function () {
    child = { foo: "bar" };
    parent = { baz: "qxu" };
  });

  describe("#setOwner", function () {
    it("sets an object as owner of another", function () {
      containment.setOwner(child, parent);

      expect(containment.getOwner(child)).to.eql(parent);
    });
  });

  describe("#getOwner", function () {
    it("returns the owner of the object", function () {
      containment.setOwner(child, parent);

      expect(containment.getOwner(child)).to.eql(parent);
    });
  });
});
