"use strict";

import { expect } from "chai";

import Model from "../src/model";

describe("Model", function () {
  let model;

  beforeEach(function () {
    model = new Model();
  });

  describe("#define", function () {
    it("is required", function () {
      expect(model.define).to.throw("Models must supply a 'define' method");
    });
  });
});
