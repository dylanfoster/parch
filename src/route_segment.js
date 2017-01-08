"use strict";

/**
 * Represents a single route segment, providing a consistent output segment
 * regardless of trailing/leading slashes
 *
 *     new RouteSegment("/foo"); => /foo
 *     new RouteSegment("foo"); => /foo
 *     new RouteSegment("foo/"); => /foo
 *     new RouteSegment("/foo/"); => /foo
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
   *     new RouteSegment("foo").hasLeadingSlash(); => false
   *     new RouteSegment("foo/").hasLeadingSlash(); => false
   *     new RouteSegment("/foo/").hasLeadingSlash(); => true
   *     new RouteSegment("/foo").hasLeadingSlash(); => true
   *
   * @method hasLeadingSlash
   * @returns {Boolean}
   */
  hasLeadingSlash() {
    return this.segment.indexOf("/") === 0;
  }

  /**
   * Determines if a path segment contains a trailing slash /
   *
   *     new RouteSegment("foo").hasTrailingSlash(); => false
   *     new RouteSegment("/foo").hasTrailingSlash(); => false
   *     new RouteSegment("/foo/").hasTrailingSlash(); => true
   *     new RouteSegment("foo/").hasTrailingSlash(); => true
   *
   * @method hasTrailingSlash
   * @returns {Boolean}
   */
  hasTrailingSlash() {
    return this.segment.charAt(this.segment.length - 1) === "/";
  }

  /**
   * Builds a consistent path segment, regardless of slashes
   *
   * @method _buildSegment
   * @returns {String} path segment
   */
  _buildSegment() {
    let segment = this.segment;

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
