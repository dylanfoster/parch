"use strict";

module.exports = function (app) {
  return function (req, res, next) {
    req.app = app;
    next();
  }
};
