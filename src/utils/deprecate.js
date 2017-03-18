"use strict";

import { ok as assert } from "assert";

import depd from "depd";

const _deprecate = depd("[parch]");

const BASE_MESSAGE = "is deprecated and will be removed in";

export default function deprecate(target, value, version) {
  const targetType = typeof target;
  const isValidType = ["function", "object"].some(type => type === targetType);

  assert(target, "You must pass a target to deprecateFunction");
  assert(isValidType, "'target' must be a function or object");
  assert(value, "You must pass a value to deprecateFunction");
  assert(version, "You must pass a version to deprecateFunction");

  const targetName = target.constructor.name;
  const message = `${targetName}#${value} ${BASE_MESSAGE} ${version}`;

  _deprecate(message);
}
