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
    const model = this.models[this.modelName] || this.models[inflect.capitalize(this.modelName)];

    this.model = model;
  }

  createRecord(data) {
    if (!data) {
      const error = this.errors.BadRequestError;
      const message = "Missing or invalid POST body";

      /* eslint-disable new-cap */
      return Promise.reject(new error(message).body);

      /* eslint-enable new-cap */
    }

    const record = this.model.build(data);

    return record.validate().then(error => {
      if (error && error.errors.length) {
        const { errors: [validationError] } = error;
        const err = this.errors.UnprocessableEntityError;
        const message = validationError.message;

        /* eslint-disable new-cap */
        throw new err(message);

        /* eslint-enable new-cap */
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
        throw new this.errors.NotFoundError(`${this.model.name} with id '${id}' does not exist`)
      }

      return record;
    });
  }

  updateRecord(id, data) {
    if (!data) {
      const error = this.errors.BadRequestError;
      const message = "Missing or invalid PUT body";

      /* eslint-disable new-cap */
      return Promise.reject(new error(message));

      /* eslint-enable new-cap */
    }

    return this.findOne(id).then(record => record.update(data)).catch(err => {
      if (err.name === "SequelizeValidationError") {
        const { errors: [validationError] } = err;
        const error = this.errors.UnprocessableEntityError;
        const message = validationError.message;

        /* eslint-disable new-cap */
        throw new error(message);

        /* eslint-enable new-cap */
      } else {
        throw err;
      }
    });
  }
}

export default Controller;
