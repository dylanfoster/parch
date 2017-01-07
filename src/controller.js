"use strict";

import errors from "restify-errors";
import inflect from "inflect";

import STATUS_CODES from "./utils/status_codes";

/**
 * Base controller
 *
 * @module parch
 * @class Controller
 */
class Controller {
  get name() {
    return this.constructor.name.split(/controller/i)[0].toLowerCase();
  }

  /**
   * @constructor
   *
   * @param {Object} settings controller settings
   * @param {Object} settings.loader loader for controllers and models
   */
  constructor(settings) {
    this.errors = errors;
    this.loader = settings.loader;
    this.models = this.loader.models;

    this.modelName = settings.model || this.name;
    this.model = this.models[this.modelName] || this.models[inflect.capitalize(this.modelName)];
    this.STATUS_CODES = STATUS_CODES;
  }

  /**
   * Builds, validates and saves a model instance.
   *
   *     return this.createRecord({ firstname: 'bar' }).then(record => {
   *
   *     });
   *
   * @method createRecord
   * @param {Object} data the model data to create the instance with
   * @returns {Promise<Model, Error>} the model instance
   */
  createRecord(data) {
    if (!data) {
      const error = this.errors.BadRequestError;
      const message = "Missing or invalid POST body";

      return Promise.reject(new error(message));
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

  /**
   * Destroy a model instance and remove it from the db
   *
   *     return this.destroyRecord(1).then(() => {
   *
   *     });
   *
   * @method destroyRecord
   * @param {Number} id the id of the resource to destroy
   * @returns {Promise<undefined, Error}
   */
  destroyRecord(id) {
    return this.findOne(id).then(record => record.destroy());
  }

  /**
   * Find all records.
   *
   *     return this.findAll().then(records => {
   *
   *     })
   *
   * You can optionally pass in a where clause
   *
   *     return this.findAll({ username: 'john' }).then(user => {
   *
   *     });
   *
   * @method findAll
   * @param {Object} where sequelize where clause
   * @see http://docs.sequelizejs.com/en/v3/docs/querying/#where
   * @todo: add support for other find options (attributes, order, limit, etc)
   *
   * @returns {Promise<Model[], Error} an array of model instance
   */
  findAll(where) {
    return this.model.findAll({ where });
  }

  /**
   * Find a single instance by id
   *
   *     return this.findOne(1).then(record => {
   *
   *     });
   *
   * @method findOne
   * @param {Number} id the id of the instance to search for
   * @returns {Promise<Model, Error>}
   */
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

  /**
   * Update a single record
   *
   *     return this.updateRecord(1, { firstName: 'foo' }).then(record => {
   *
   *     });
   *
   * @method updateRecord
   * @param {Number} id the id of the record to update
   * @param {Object} data the data to update on the record
   * @returns {Promise<Model, Error>}
   */
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
