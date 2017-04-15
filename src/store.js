"use strict";

import ORM from "@parch-js/orm";

import { getOwner, setOwner } from "./containment";

/**
 * @class Store
 * @constructor
 * @extends <a href="https://github.com/parch-js/orm" target="_blank">Parch ORM</a>
 */
export default class Store extends ORM {
  constructor(registry) {
    const models = registry.lookup("service:model-manager").models;

    super(models);

    setOwner(this, registry);
  }

  createRecord(name) {
    const serializer = this._lookupSerializer(name);

    return super.createRecord(...arguments).then(
      record => serializer.normalizeResponse(record, "createRecord")
    );
  }

  findAll(name) {
    const serializer = this._lookupSerializer(name);

    return super.findAll(...arguments).then(
      records => serializer.normalizeResponse(records, "findAll", name)
    );
  }

  _lookupSerializer(name) {
    return getOwner(this).lookup(`serializer:${name}`);
  }
}
