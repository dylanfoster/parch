"use strict";

import path from "path";

import Bunyan from "bunyan";

const LOG_ENV = process.env.NODE_ENV || "development";

class Logger {
  /* eslint-disable complexity */
  constructor(name, options = {}) {
    name = name || "api";

    const serializers = options.serializers || {};
    const streams = [];

    serializers.req = serializers.req || this.req;
    serializers.res = serializers.res || this.res;

    if (options.dir) {
      streams.push({
        path: path.join(options.dir, `${LOG_ENV}.log`)
      });
    }

    if (process.env.NODE_ENV !== "test") {
      streams.push({
        level: "info",
        stream: process.stdout
      });
    }

    return Bunyan.createLogger({ name, serializers, streams });
  }

  req(req) {
    if (!req) { return false; }

    return {
      httpVersion: req.httpVersion,
      method: req.method,
      params: req.params,
      query: req.query,
      url: req.url
    };
  }

  res(res) {
    if (!res) { return false; }

    return {
      statusCode: res.statusCode,
      headers: res.headers
    };
  }

  static create(name, options) {
    return new Logger(name, options);
  }
}

export default Logger;
