"use strict";

import RouteSegment from "./route_segment";

class Route {
  constructor() {
    const segments = Array.from(arguments);
    const routeParts = segments.map(segment => new RouteSegment(segment));

    this.path = routeParts.map(part => part.path).join("");
  }
}

export default Route;
