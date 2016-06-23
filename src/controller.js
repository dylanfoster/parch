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

  findAll() {
    return this.model.findAll();
  }

  findOne(id) {
    return this.model.findById(id).then(record => {
      if (!record) {
        throw new this.errors.NotFoundError(`${this.model.name} with id '${id}' does not exist`)
      }

      return record;
    });
  }
}

export default Controller;
