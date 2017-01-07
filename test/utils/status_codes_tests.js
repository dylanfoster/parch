"use strict";

import chai, { expect } from "chai";

import STATUS_CODES from "../../src/utils/status_codes";

const CODES = [
  { name: "SUCCESS", code: 200 },
  { name: "CREATED", code: 201 },
  { name: "NO_CONTENT", code: 204 },
  { name: "BAD_REQUEST", code: 400 },
  { name: "UNAUTHORIZED", code: 401 },
  { name: "FORBIDDEN", code: 403 },
  { name: "NOT_FOUND", code: 404 },
  { name: "METHOD_NOT_ALLOWED", code: 405 },
  { name: "CONFLICT", code: 409 },
  { name: "UNPROCESSABLE_ENTITY", code: 422 },
  { name: "TOO_MANY_REQUESTS", code: 429 },
  { name: "INTERNAL_SERVER_ERROR", code: 500 }
];

describe("Util | status codes", function () {
  CODES.forEach(function (code) {
    it(`${code.name} is ${code.code}`, function () {
      expect(STATUS_CODES[code.name]).to.eql(code.code);
    });
  });
});
