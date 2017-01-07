"use strict";

class RouteSegment {
  constructor(segment) {
    this.segment = segment;
    this.path = this._buildPath();
  }

  hasLeadingSlash() {
    return this.segment.indexOf("/") === 0;
  }

  hasTrailingSlash() {
    return this.segment.charAt(this.segment.length - 1) === "/";
  }

  _buildPath() {
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
