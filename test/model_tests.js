"use strict";

import { expect } from "chai";

import FooModel from "./fixtures/models/foo_model";
import Model from "../src/model";
import { registry } from "./fixtures";

describe("Model", function () {
  let model, modelManager;

  beforeEach(function () {
    model = new Model();
    modelManager = registry.lookup("service:model-manager");
    modelManager.addModel(FooModel);

    return modelManager.sequelize.sync({ force: true });
  });

  describe("#define", function () {
    it("is required", function () {
      expect(model.define).to.throw("Models must supply a 'define' method");
    });
  });

  it("can be initialized with options", function () {
    const { Foo } = modelManager.models;

    return Foo.create({ type: "bar" })
      .then(bar => bar.getBaz())
      .then(baz => {
        expect(baz.name).to.eql("instance");

        return Foo.getBaz();
      }).then(baz => {
        expect(baz.name).to.eql("class");
      });
  });
});
