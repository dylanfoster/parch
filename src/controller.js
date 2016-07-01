"use strict";

import errors from "restify-errors";
import inflect from "inflect";

class Controller {
  get name() {
    return this.constructor.name.split(/controller/i)[0].toLowerCase();
  }
  constructor(settings) {
    this.errors = errors;
    this.loader = settings.loader;
    this.models = this.loader.models;

    this.modelName = settings.model || this.name;
    this.model = this.models[this.modelName] || this.models[inflect.capitalize(this.modelName)];
  }

  createRecord(data) {
    if (!data) {
      const error = this.errors.BadRequestError;
      const message = "Missing or invalid POST body";

      return Promise.reject(new error(message).body);
    }

    const record = this.model.build(data);

    return record.validate().then(err => {
      if (err && err.errors && err.errors.length) {
        const { errors: [validationError] } = err;
        const error = this.errors.UnprocessableEntityError;
        const message = validationError.message;

        throw new error(message);
      }

      return record.save();
    });
  }

  destroyRecord(id) {
    return this.findOne(id).then(record => record.destroy());
  }

  findAll(where) {
    return this.model.findAll({ where });
  }

  findOne(id) {
    return this.model.findById(id).then(record => {
      if (!record) {
        const error = this.errors.NotFoundError;
        const message = `${this.model.name} with id '${id}' does not exist`;

        throw new error(message);
      }

      return record;
    });
  }

  updateRecord(id, data) {
    if (!data) {
      const error = this.errors.BadRequestError;
      const message = "Missing or invalid PUT body";

      return Promise.reject(new error(message));
    }

    return this.findOne(id).then(record => record.update(data)).catch(err => {
      /**
       * HACK: if this is a sequelize validation error, we transform it, otherwise
       * we can't be totally sure so just throw it up the stack
       */
      if (err.name === "SequelizeValidationError") {
        const { errors: [validationError] } = err;
        const error = this.errors.UnprocessableEntityError;
        const message = validationError.message;

        throw new error(message);
      } else {
        throw err;
      }
    });
  }
}

export default Controller;
