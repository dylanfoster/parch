"use strict";

import { expect } from "chai";

import Controller from "../src/controller";
import { application, modelManager, registry } from "./fixtures";

describe("Controller", function () {
  let controller;

  it("has a name", function () {
    class UserController extends Controller {}

    controller = new UserController(registry);
    expect(controller.name).to.eql("user");
  });

  it("has a corresponding model", function () {
    class UserController extends Controller {}

    controller = new UserController(registry);
    expect(controller.model.name).to.eql("User");
  });

  it("overrides model when provided", function () {
    class UserController extends Controller {}

    controller = new UserController(registry, { model: "foo" });
    expect(controller.model.name).to.eql("Foo");
  });

  describe("store", function () {
    beforeEach(function () {
      class UserController extends Controller {}
      controller = new UserController(registry);

      application.map(function () {
        this.resource("user");
      });

      return modelManager.sequelize.sync({ force: true });
    });

    afterEach(function () {
      return modelManager.sequelize.drop();
    });

    describe.only("#findAll", function () {
      it("returns all records of a model", function () {
        return controller.findAll().then(res => {
          expect(res.users).to.eql([]);

          return modelManager.models.User.create({ firstName: "john" });
        }).then(() => controller.findAll())
        .then(res => {
          expect(res.users[0].firstName).to.eql("john");
        });
      });

      it("allows for querying", function () {
        let user1, user2;

        return modelManager.models.User.create({ firstName: "john" }).then(john => {
          user1 = john;
          return modelManager.models.User.create({ firstName: "joe" }).then(joe => {
            user2 = joe;
          });
        }).then(() => controller.findAll({ firstName: "john" })).then(res => {
          expect(res.users.length).to.eql(1);
        });
      });

      it("allows for finder options", function () {
        return modelManager.models.User.create({ firstName: "john" }).then(
          () => controller.findAll({ firstName: "john" }, { attributes: ["firstName"] })
        ).then(res => {
          expect(res.users[0].firstName).to.eql("john");
        });
      });

      it("supports pagination");
    });

    describe("#findOne", function () {
      it("finds a single record by id", function () {
        return modelManager.models.User.create({ firstName: "john" })
          .then(john => controller.findOne(john.id))
          .then(john => {
            expect(john.firstName).to.eql("john");
          });
      });

      it("allows for finder options", function () {
        return modelManager.models.User.create({ firstName: "john" }).then(
          john => controller.findOne(john.id, { attributes: ["firstName"] })
        ).then(john => {
          expect(john.toJSON()).to.eql({ firstName: "john" });
        });
      });

      it("throws NotFoundError if no record is found", function (done) {
        controller.findOne(1).catch(err => {
          expect(err.code).to.eql("NotFound");
          expect(err.message).to.eql("user does not exist");
          done();
        });
      });
    });

    describe("#createRecord", function () {
      it("creates a new record", function () {
        return controller.createRecord({ firstName: "john" }).then(res => {
          expect(res.user.firstName).to.eql("john");
        });
      });

      it("throws BadRequestError for invalid body", function (done) {
        controller.createRecord().catch(err => {
          expect(err.code).to.eql("BadRequest");
          expect(err.message).to.eql("Missing or invalid body");
          done();
        });
      });

      it("throws UnprocessableEntityError for validation failures", function (done) {
        controller.createRecord({ firstName: 1 }).catch(err => {
          expect(err.code).to.eql("UnprocessableEntity");
          expect(err.message).to.eql("firstName must be a valid string");
          done();
        });
      });
    });

    describe("#updateRecord", function () {
      let user;

      beforeEach(function () {
        return modelManager.models.User.create({ firstName: "john" })
          .then(john => {
            user = john;
          });
      });

      afterEach(function () {
        return modelManager.sequelize.drop();
      });

      it("updates an existing record by id", function () {
        return controller.updateRecord(user.id, { firstName: "bob" }).then(bob => {
          expect(bob.firstName).to.eql("bob");
        });
      });

      it("throws NotFoundError if record is not found", function (done) {
        user.destroy().then(() => {
          controller.updateRecord(1, { firstName: "bob" }).catch(err => {
            expect(err.code).to.eql("NotFound");
            done();
          });
        }).catch(done);
      });

      it("throw BadRequestError for invalid or missing data", function (done) {
        controller.updateRecord(user.id).catch(err => {
          expect(err.code).to.eql("BadRequest");
          expect(err.message).to.eql("Missing or invalid body");
          done();
        });
      });

      it("throws UnprocessableEntityError for validation failures", function (done) {
        controller.updateRecord(user.id, { firstName: 1 }).catch(err => {
          expect(err.code).to.eql("UnprocessableEntity");
          expect(err.message).to.eql("firstName must be a valid string");
          done();
        });
      });
    });

    describe("#destroyRecord", function () {
      let user;

      beforeEach(function () {
        return modelManager.models.User.create({ firstName: "john" })
          .then(john => { user = john; });
      });

      afterEach(function () {
        return modelManager.sequelize.drop();
      });

      it("destroys a record by id", function () {
        return controller.destroyRecord(user.id).then(() =>
            modelManager.models.User.findById(user.id)
        ).then(found => {
          expect(found).to.be.null;
        });
      });

      it("throws NotFoundError if record doesn't exist", function (done) {
        user.destroy().then(() => {
          controller.destroyRecord(user.id).catch(err => {
            expect(err.code).to.eql("NotFound");
            expect(err.message).to.eql("user does not exist");
            done();
          });
        }).catch(done);
      });
    });
  });
});
