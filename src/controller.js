"use strict";

import errors from "restify-errors";
import inflect from "inflect";

import STATUS_CODES from "./utils/status_codes";
import deprecate from "./utils/deprecate";
import { setOwner } from "./containment";

/**
 * Base controller
 *
 * @module parch
 * @class Controller
 * @constructor
 * @todo add default restfull methods (index, show, etc)
 * @todo implement store
 */
class Controller {
  get name() {
    return inflect.singularize(
      this.constructor.name.split(/controller/i)[0].toLowerCase()
    );
  }

  /**
   * @constructor
   *
   * @param {Object} registry module registry
   * @param {Object} options configuration options
   * @param {String} options.model override the default model name
   */
  constructor(registry, options = {}) {
    setOwner(this, registry);

    this.errors = errors;
    this.models = registry.lookup("service:model-manager").models;
    this.modelName = options.model || this.name;
    this.modelNameLookup = inflect.singularize(this.modelName).toLowerCase();
    this.STATUS_CODES = STATUS_CODES;

    registry.inject(this, "service:store", "store");
    registry.inject(this, `model:${this.modelNameLookup}`);
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
    deprecate(this, "createRecord", "2.0.0");

    return this.store.createRecord(this.modelNameLookup, data);
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
    deprecate(this, "destroyRecord", "2.0.0");

    return this.store.destroyRecord(this.modelNameLookup, id);
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
    deprecate(this, "findAll", "2.0.0");

    return this.store.findAll(this.modelNameLookup, where, options);
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
    deprecate(this, "findOne", "2.0.0");

    return this.store.findOne(this.modelNameLookup, id, options);
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
    deprecate(this, "updateRecord", "2.0.0");

    return this.store.updateRecord(this.modelNameLookup, id, data);
  }

  _addOptionsToQuery(query, options) {
    Object.keys(options).forEach(prop => {
      query[prop] = options[prop];
    });
  }
}

export default Controller;
