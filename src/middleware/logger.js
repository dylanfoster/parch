"use strict";

export default function (options = {}) {
  return function logger(req, res, next) {
    const log = options.log;

    log.child({ reqID: req.getId() }).info({ req, res });
    req.log = log.child({ reqID: req.getId() });
    next();
  };
}
