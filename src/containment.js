"use strict";

const containmentMap = new WeakMap();

/**
 * Get the owner of an object
 * @method getOwner
 * @param {Object} child object from which to fetch the parent
 * @returns {Object} parent (owner)
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
