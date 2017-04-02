"use strict";

const containmentMap = new WeakMap();

/**
 * Get the owner of an object
 * @method getOwner
 * @param {Object} child object from which to fetch the parent
 * @returns {Object} parent (owner)
 *
 * @example
 * ```javascript
 * class UserController extends parch.Controller {
 *   doStuff(req, res, next) {
 *     const store = getOwner(this).lookup("service:store");
 *
 *     return store.findAll();
 *   }
 * }
 * ```
 */
export const getOwner = function getOwner(child) {
  return containmentMap.get(child);
};

/**
 * Set the owner object of the child object
 *
 * @method setOwner
 * @param {Object} child child object
 * @param {Object} parent parent (owner) object
 *
 * @example
 * ```javascript
 * setOwner({}, "service:store", "store");
 *
 * {}.store
 * ```
 */
export const setOwner = function setOwner(child, parent) {
  containmentMap.set(child, parent);
};

/**
 * @class containment
 */
export default {
  getOwner,
  setOwner
};
