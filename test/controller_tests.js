"use strict";

import { expect } from "chai";

import Controller from "../src/controller";
import { loader } from "./fixtures";

describe("Controller", function () {
  let controller;

  it("has a name", function () {
    class UserController extends Controller {
      constructor(settings) {
        super(settings);
      }
    }

    const controller = new UserController({ loader });
    expect(controller.name).to.eql("user");
  });

  it("has a corresponding model", function () {
    class UserController extends Controller {
      constructor(settings) {
        super(settings);
      }
    }

    const controller = new UserController({ loader });
    expect(controller.model.name).to.eql("User");
  });

  it("overrides model when provided", function () {
    class UserController extends Controller {
      constructor(settings) {
        super(settings);
      }
    }

    const controller = new UserController({ loader, model: "foo" });
    expect(controller.model.name).to.eql("Foo");
  });
});
