"use strict";

const containmentMap = new WeakMap();

export const getOwner = function getOwner(child) {
  return containmentMap.get(child);
};

export const setOwner = function setOwner(child, parent) {
  containmentMap.set(child, parent);
};

export default {
  getOwner,
  setOwner
};
