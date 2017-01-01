"use strict";

import Sequelize from "sequelize";

class ModelManager {
  /**
   * constructor
   *
   * @param {Object} settings
   * @param {Object} settings.connection
   */
  constructor(settings) {
    const connection = settings.connection;

    this._models = {};
    this.Sequelize = Sequelize;
    this.sequelize = new Sequelize(
      connection.database,
      connection.username,
      connection.password,
      connection
    );
  }

  /**
   * addModel adds a model to internal cache
   * @todo: check for existence before adding (i.e. caching)
   *
   * @param {Object} Model parch model class
   */
  addModel(Model) {
    const _model = new Model();
    const modelAttributes = _model.define(this.Sequelize);
    const model = this.sequelize.define(
      _model.name,
      modelAttributes,
      _model.options
    );

    model.associate = _model.associate;
    this.models[model.name] = model;
  }

  get models() {
    return this._models;
  }
}

export default ModelManager;
