"use strict";

export default function (options) {
  return function logger(req, res, next) {
    const log = options.log;

    req.log = log.child({ reqID: req.getId() });
    next();
  };
}
