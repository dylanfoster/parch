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
    if (this.hasLeadingSlash() && this.hasTrailingSlash()) {
      return this.segment.slice(0, -1);
    } else if (this.hasLeadingSlash()) {
      return this.segment;
    }

    return this._getSegment();
  }

  _getSegment() {
    return `/${this.segment}`;
  }
}

export default RouteSegment;
