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
   * createRecord
   *
   * @param name
   * @returns {undefined}
   */
  createRecord(name) {
    const serializer = this._lookupSerializer(name);

    return super.createRecord(...arguments).then(
      record => serializer.normalizeResponse(record, "createRecord")
    );
  }

  /**
   * findAll
   *
   * @param name
   * @returns {undefined}
   */
  findAll(name) {
    const serializer = this._lookupSerializer(name);

    return super.findAll(...arguments).then(
      records => serializer.normalizeResponse(records, "findAll", name)
    );
  }

  /**
   * findOne
   *
   * @param name
   * @returns {undefined}
   */
  findOne(name) {
    const serializer = this._lookupSerializer(name);

    return super.findOne(...arguments).then(
      record => serializer.normalizeResponse(record, "findOne", name)
    );
  }

  /**
   * queryRecord
   *
   * @param name
   * @returns {undefined}
   */
  queryRecord(name) {
    const serializer = this._lookupSerializer(name);

    return super.queryRecord(...arguments).then(
      record => serializer.normalizeResponse(record, "queryRecord", name)
    );
  }

  /**
   * updateRecord
   *
   * @param name
   * @returns {undefined}
   */
  updateRecord(name) {
    const serializer = this._lookupSerializer(name);

    return super.updateRecord(...arguments).then(
      record => serializer.normalizeResponse(record, "updateRecord", name)
    );
  }

  /**
   * _lookupSerializer
   *
   * @param name
   * @returns {undefined}
   */
  _lookupSerializer(name) {
    return getOwner(this).lookup(`serializer:${name}`);
  }
}
