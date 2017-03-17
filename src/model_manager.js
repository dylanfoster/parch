"use strict";

import Sequelize from "sequelize";
import { setOwner } from "./containment";

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
  constructor(registry) {
    const config = registry.lookup("config:main");
    const { database: { connection }} = config;

    setOwner(this, registry);

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
   * @method addModel
   * @param {Object} Model parch model class
   * @example
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
   */
  addModel(Model) {
    const instance = new Model();
    const modelAttributes = instance.define(this.Sequelize);
    const model = this.sequelize.define(
      instance.name,
      modelAttributes,
      instance.options
    );

    model.associate = instance.associate;
    this.models[model.name] = model;
  }

  get models() {
    return this._models;
  }
}

export default ModelManager;
