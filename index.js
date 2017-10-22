"use strict";

const Application = require("./lib/application");
const Controller = require("./lib/controller");
const Model = require("./lib/model");
const Route = require("./lib/route");
const RouteSegment = require("./lib/route_segment");
const Store = require("./lib/store");
const containment = require("./lib/containment");
const serializers = require("./lib/serializers");

/**
 * @module parch
 */
module.exports = {
  Application,
  Controller,
  JSONSerializer: serializers.JSONSerializer,
  Model,
  Route,
  RouteSegment,
  Store,
  containment
};
