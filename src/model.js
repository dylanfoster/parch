"use strict";

/**
 * Base model
 *
 * @module parch
 * @class Model
 */
class Model {
  get name() {
    return this.constructor.name.split(/model/i)[0];
  }

  /**
   * @constructor
   *
   * @param {Object} options sequelize model options
   * @see http://docs.sequelizejs.com/en/v3/docs/models-definition/#configuration
   */
  constructor(options = {}) {
    this.options = options;
  }

  /**
   * Model definition
   *
   *     define(DataTypes) {
   *       const user = {
   *         username: {
   *           allowNull: false
   *           type: DataTypes.STRING
   *         }
   *       };
   *
   *       return user;
   *     }
   *
   * @method define
   * @param {Object} DataTypes sequelize DataTypes Object
   * @see http://docs.sequelizejs.com/en/v3/docs/models-definition/#data-types
   */
  define() {
    throw new Error("Models must supply a 'define' method");
  }
}

export default Model;
