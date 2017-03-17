"use strict";

const containmentMap = new WeakMap();

/**
 * Find the owner of the give object
 *
 * @method getOwner
 * @param {Object} child object from which to fetch the parent
 * @returns {Object} parent (owner)
 *
 * @example
 *     const owner = getOwner(this);
 *
 *     owner.lookup("service:foo");
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
 *     setOwner(this, registry);
 *
 *     const owner = getOwner(this);
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
