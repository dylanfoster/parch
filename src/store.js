"use strict";

import ORM from "@parch-js/orm";

import { getOwner, setOwner } from "./containment";

/**
 * Parch overrides the base ORM class to implement the serializer defined for
 * each controller. If no serializer is defined, the
 * {{#crossLink "RestSerializer"}}RestSerializer{{/crossLink}} is used.
 *
 * @class Store
 * @constructor
 * @extends <a href="parch-js/orm" target="_blank">Parch ORM</a>
 */
export default class Store extends ORM {
  constructor(registry) {
    const models = registry.lookup("service:model-manager").models;

    super(models);

    setOwner(this, registry);
  }

  /**
   * Creates a record
   *
   * @method createRecord
   * @param name
   * @returns {Object} seralized record instance
   *
   * @example
   * ```javascript
   * return store.createRecord("user", {
   *   firstName: "hank",
   *   lastName: "hill"
   * });
   * ```
   */
  createRecord(name) {
    const serializer = this._lookupSerializer(name);

    return super.createRecord(...arguments).then(
      record => serializer.normalizeResponse(record, "createRecord")
    );
  }

  /**
   * Returns all records. Passing an optional query will query those records.
   *
   * @method findAll
   * @param name
   * @returns {Array|Object} serialized record arry
   *
   * @example
   * ```javascript
   * return store.findAll("user");
   *
   * return store.findAll("user", {
   *   firstName: "Jon"
   * })
   * ```
   */
  findAll(name) {
    const serializer = this._lookupSerializer(name);

    return super.findAll(...arguments).then(
      records => serializer.normalizeResponse(records, "findAll", name)
    );
  }

  /**
   * Returns a single record by id
   *
   * @method findOne
   * @param name
   * @returns {Array|Object} serialized record array
   *
   * @example
   * ```javascript
   * return store.findOne("user", 1);
   * ```
   */
  findOne(name) {
    const serializer = this._lookupSerializer(name);

    return super.findOne(...arguments).then(
      record => serializer.normalizeResponse(record, "findOne", name)
    );
  }

  /**
   * Returns the first record matching the passed query
   *
   * @method queryRecord
   * @param name
   * @returns {Object} serialized record instance
   *
   * @example
   * ```javascript
   * return store.queryRecord("user", {
   *   firstName: "jon"
   * })
   * ```
   */
  queryRecord(name) {
    const serializer = this._lookupSerializer(name);

    return super.queryRecord(...arguments).then(
      record => serializer.normalizeResponse(record, "queryRecord", name)
    );
  }

  /**
   * Updates a record by id
   *
   * @method updateRecord
   * @param name
   * @returns {Object} seralized record instance
   *
   * @example
   * ```javascript
   * return store.updateRecord("user", 1, { firstName: "Jane" });
   * ```
   */
  updateRecord(name) {
    const serializer = this._lookupSerializer(name);

    return super.updateRecord(...arguments).then(
      record => serializer.normalizeResponse(record, "updateRecord", name)
    );
  }

  /**
   * Attempts to load the serialized for a particular model
   *
   * @method _lookupSerializer
   * @private
   * @param name
   * @returns {Object} serializer
   */
  _lookupSerializer(name) {
    return getOwner(this).lookup(`serializer:${name}`);
  }
}
