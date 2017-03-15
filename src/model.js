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
   * <a href="http://docs.sequelizejs.com/en/v3/docs/models-definition/#configuration">
   *   see http://docs.sequelizejs.com/en/v3/docs/models-definition/#configuration
   * </a>
   *
   * @param {Object} options sequelize model options
   * @todo: set owner and inject this model and all models (from manager)
   * @see http://docs.sequelizejs.com/en/v3/docs/models-definition/#configuration
   */
  constructor(options = {}) {
    /**
     * Model options get passed directly to sequelize model definition. The main
     * difference is the separation of model constructor options and model
     * attribute definitions.
     *
     * <a href="http://docs.sequelizejs.com/en/v3/docs/models-definition/">
     *   see http://docs.sequelizejs.com/en/v3/docs/models-definition/
     * </a>
     *
     * @property {Object} options
     * @see http://docs.sequelizejs.com/en/v3/docs/models-definition/
     */
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
   * <a href="http://docs.sequelizejs.com/en/v3/docs/models-definition/#data-types">
   *   see http://docs.sequelizejs.com/en/v3/docs/models-definition/#data-types
   * </a>
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
