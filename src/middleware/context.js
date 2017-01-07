"use strict";

module.exports = function context(app) {
  return function setContext(req, res, next) {
    req.app = app;
    next();
  };
};
