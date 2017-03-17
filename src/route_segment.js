"use strict";

/**
 * Represents a single route segment, providing a consistent output segment
 * regardless of trailing/leading slashes
 *
 *     new RouteSegment("/foo"); => { path: "/foo", segment: "/foo" }
 *     new RouteSegment("foo"); => { path: "/foo", segment: "foo" }
 *     new RouteSegment("/foo/"); => { path: "/foo", segment: "/foo/" }
 *     new RouteSegment("foo/"); => { path: "/foo", segment: "foo/" }
 *
 * @class RouteSegment
 */
class RouteSegment {
  /**
   * constructor
   *
   * @param {String} segment A single route segment
   */
  constructor(segment) {
    this.segment = segment;
    this.path = this._buildSegment();
  }

  /**
   * Determines if a path segment contains a leading slash /
   *
   * @method hasLeadingSlash
   * @return {Boolean}
   * @example
   *     new RouteSegment("foo").hasLeadingSlash(); => false
   *     new RouteSegment("foo/").hasLeadingSlash(); => false
   *     new RouteSegment("/foo/").hasLeadingSlash(); => true
   *     new RouteSegment("/foo").hasLeadingSlash(); => true
   */
  hasLeadingSlash() {
    return this.segment.indexOf("/") === 0;
  }

  /**
   * Determines if a path segment contains a trailing slash /
   *
   * @method hasTrailingSlash
   * @return {Boolean}
   * @example
   *     new RouteSegment("foo").hasTrailingSlash(); => false
   *     new RouteSegment("/foo").hasTrailingSlash(); => false
   *     new RouteSegment("/foo/").hasTrailingSlash(); => true
   *     new RouteSegment("foo/").hasTrailingSlash(); => true
   */
  hasTrailingSlash() {
    return this.segment.charAt(this.segment.length - 1) === "/";
  }

  /**
   * Builds a consistent path segment, regardless of slashes
   *
   * @method _buildSegment
   * @return {String} path segment
   */
  _buildSegment() {
    let segment = this.segment;

    if (!segment) { return ""; }

    if (!this.hasLeadingSlash()) {
      segment = `/${segment}`;
    }

    if (this.hasTrailingSlash()) {
      segment = segment.slice(0, -1);
    }

    return segment;
  }
}

export default RouteSegment;
