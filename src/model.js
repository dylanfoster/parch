"use strict";

import inflect from "inflect";

/**
 * Base model
 *
 * @class Model
 * @constructor
 *
 * @param {Object} options sequelize model options
 * <a href="http://docs.sequelizejs.com/en/v3/docs/models-definition/#configuration" target="_blank">
 *   Sequelize Configuration
 * </a>
 */
class Model {
  get name() {
    return inflect.singularize(
      this.constructor.name.split(/model/i)[0]
    );
  }

  constructor(options = {}) {
    /**
     * Model options get passed directly to sequelize model definition. The main
     * difference is the separation of model constructor options and model
     * attribute definitions.
     *
     * <a href="http://docs.sequelizejs.com/en/v3/docs/models-definition/" target="_blank">
     *   see http://docs.sequelizejs.com/en/v3/docs/models-definition/
     * </a>
     *
     * @property {Object} options
     */
    this.options = options;
  }

  /**
   * Model definition
   *
   * @method define
   * @param {Object} DataTypes sequelize DataTypes Object
   * <a href="http://docs.sequelizejs.com/en/v3/docs/models-definition/#data-types" target="_blank">
   *   See Sequelize DataTypes
   * </a>
   *
   * @example
   * ```javascript
   * define(DataTypes) {
   *   const user = {
   *     username: {
   *       allowNull: false
   *       type: DataTypes.STRING
   *     }
   *   };
   *
   *   return user;
   * }
   * ```
   */
  define() {
    throw new Error("Models must supply a 'define' method");
  }
}

export default Model;
