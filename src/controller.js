"use strict";

import errors from "restify-errors";
import inflect from "inflect";

import STATUS_CODES from "./utils/status_codes";
import { setOwner } from "./containment";

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
  constructor(registry, options = {}) {
    setOwner(this, registry);

    this.errors = errors;
    this.models = registry.lookup("service:model-manager").models;

    const modelName = options.model || this.name;

    try {
      registry.inject(this, `model:${modelName}`);
    } catch (err) {
    }

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
   * @return {Promise<Model, Error>} the model instance
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
   * @return {Promise<undefined, Error}
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
   * As well as any finder options
   *
   *     return this.findAll(null, {
   *       attributes: ["title"],
   *       include: [this.models.User]
   *     }).then(user => {
   *
   *     });
   *
   * @method findAll
   * @param {Object} where sequelize where clause
   * @param {Object} options <a href="http://docs.sequelizejs.com/en/v3/api/model/#findoneoptions-promiseinstance" target="_blank">
   *   sequelize finder options
   * </a>
   * @see http://docs.sequelizejs.com/en/v3/docs/querying/#where
   *
   * @return {Promise<Model[], Error} an array of model instance
   */
  findAll(where, options = {}) {
    const query = { where };

    this._addOptionsToQuery(query, options);

    return this.model.findAll(query);
  }

  /**
   * Find a single instance by id
   *
   *     return this.findOne(1).then(record => {
   *
   *     });
   *
   * The same options apply to findOne
   *
   *     return this.findOne(1, {
   *       attributes: ["firstName"]
   *     }).then(user => {
   *
   *     });
   *
   * @method findOne
   * @param {Number} id the id of the instance to search for
   * @param {Object} options <a href="http://docs.sequelizejs.com/en/v3/api/model/#findoneoptions-promiseinstance" target="_blank">
   *   sequelize finder options
   * </a>
   * @return {Promise<Model, Error>}
   */
  findOne(id, options = {}) {
    const query = { where: { id }};

    this._addOptionsToQuery(query, options);

    return this.model.findOne(query).then(record => {
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
   * @return {Promise<Model, Error>}
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

  _addOptionsToQuery(query, options) {
    Object.keys(options).forEach(prop => {
      query[prop] = options[prop];
    });
  }
}

export default Controller;
