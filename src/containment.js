"use strict";

const containmentMap = new WeakMap();

/**
 * getOwner
 *
 * @param child
 * @returns {undefined}
 */
export const getOwner = function getOwner(child) {
  return containmentMap.get(child);
};

/**
 * setOwner
 *
 * @param child
 * @param parent
 * @returns {undefined}
 */
export const setOwner = function setOwner(child, parent) {
  containmentMap.set(child, parent);
};

export default {
  getOwner,
  setOwner
};
