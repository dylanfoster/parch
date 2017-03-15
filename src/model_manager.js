"use strict";

import Sequelize from "sequelize";
import { getOwner, setOwner } from "./containment";

/**
 * Manages all models
 *
 * @class ModelManager
 */
class ModelManager {
  /**
   * @constructor
   *
   * @param {Object} settings
   * @param {Object} settings.connection
   */
  constructor(container) {
    setOwner(this, container);
    const config = getOwner(this).lookup("config:main");
    const { database: { connection }} = config;

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
   * Adds a model to internal cache
   *
   *     class FooModel extends parch.Model {
   *       constructor(options) {
   *         super(options);
   *       }
   *
   *       associate(Foo, models) {
   *       }
   *
   *       define(DataTypes) {
   *       }
   *     }
   *
   *     modelManager.addModel(Model);
   *
   * @method addModel
   * @param {Object} Model parch model class
   * @todo: check for existence before adding (i.e. caching)
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
