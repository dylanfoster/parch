"use strict";

import Sequelize from "sequelize";
import { setOwner } from "./containment";

/**
 * Manages all models
 *
 * @class ModelManager
 * @constructor
 *
 * @param {Object} settings
 * @param {Object} settings.connection
 */
class ModelManager {
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
   */
  addModel(Model) {
    const instance = new Model();
    const modelAttributes = instance.define(this.Sequelize);
    const model = this.sequelize.define(
      instance.name,
      modelAttributes,
      instance.options
    );

    if (instance.options && instance.options.classMethods) {
      const methods = instance.options.classMethods;

      Object.keys(methods).forEach(method => {
        if (methods[method].bind && typeof methods[method].bind === "function") {
          model[method] = methods[method].bind(null, model);
        } else {
          model[method] = methods[method];
        }
      });
    }

    if (instance.options && instance.options.instanceMethods) {
      const methods = instance.options.instanceMethods;

      Object.keys(methods).forEach(method => {
        model.prototype[method] = methods[method];
      });
    }

    model.associate = instance.associate;
    this.models[model.name] = model;
  }

  get models() {
    return this._models;
  }
}

export default ModelManager;
