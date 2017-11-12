"use strict";

import RouteSegment from "./route_segment";

/**
 * Builds a consistent route path from a set of path segments
 *
 * @class Route
 * @constructor
 * @param {String} ...segment
 * @return {Object} path object
 *
 * @example
 * ```javascript
 * new Route("foo", "/bar", "baz/");
 * /**
 *  * {
 *  *   path: "/foo/bar/baz"
 *  *   segments: [
 *  *     {{#crossLink "RouteSegment"}}RouteSegment{{/crossLink}},
 *  *     {{#crossLink "RouteSegment"}}RouteSegment{{/crossLink}},
 *  *     {{#crossLink "RouteSegment"}}RouteSegment{{/crossLink}}
 *  *   ]
 *  * }
 *  *
 * ```
 */
class Route {
  constructor() {
    const segments = Array.from(arguments);
    const routeParts = segments.map(segment => new RouteSegment(segment));

    /**
     * The path is the fully built path from segments e.g. /foo/bar/baz
     *
     * @property path
     * @type {String}
     */
    this.path = routeParts.map(part => part.path).join("");

    /**
     * All segments that make up this route. Consists of an array of {{#crossLink "RouteSegment"}}RouteSegments{{/crossLink}}
     *
     * @property segments
     * @type {Array}
     */
    this.segments = routeParts;
  }
}

export default Route;
