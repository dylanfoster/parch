"use strict";

import RouteSegment from "./route_segment";

/**
 * Builds a consistent route path from a set of path segments
 *
 *     new Route("foo", "/bar", "baz/");
 *
 * @class Route
 */
class Route {
  /**
   * The constructor takes an unknown number of string segments and
   * converts them to a path
   *
   * @constructor
   * @param {String} ...segment
   * @returns {Object} path object
   */
  constructor() {
    const segments = Array.from(arguments);
    const routeParts = segments.map(segment => new RouteSegment(segment));

    /**
     * The path is the fully built path from segments e.g. /foo/bar/baz
     * @property {String} path
     */
    this.path = routeParts.map(part => part.path).join("");

    /**
     * All segments that make up this route. Consists of an array of RouteSegments
     * @property {Array} segments
     */
    this.segments = routeParts;
  }
}

export default Route;
