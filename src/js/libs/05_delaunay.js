(function(global) {
  var EPSILON = 1.0e-6;

  function Vertex(x, y) {
    this.x = x;
    this.y = y;
  }

  function Triangle(v0, v1, v2) {
    this.v0 = v0;
    this.v1 = v1;
    this.v2 = v2;

    this.calcCircumcircle();
  }
  
  Triangle.prototype.calcCircumcircle = function() {
    
    var A = this.v1.x - this.v0.x;
    var B = this.v1.y - this.v0.y;
    var C = this.v2.x - this.v0.x;
    var D = this.v2.y - this.v0.y;

    var E = A * (this.v0.x + this.v1.x) + B * (this.v0.y + this.v1.y);
    var F = C * (this.v0.x + this.v2.x) + D * (this.v0.y + this.v2.y);

    var G = 2.0 * (A * (this.v2.y - this.v1.y) - B * (this.v2.x - this.v1.x));

    var dx, dy;

    if (Math.abs(G) < EPSILON) {
      // Collinear - find extremes and use the midpoint

      var minx = Math.min(this.v0.x, this.v1.x, this.v2.x);
      var miny = Math.min(this.v0.y, this.v1.y, this.v2.y);
      var maxx = Math.max(this.v0.x, this.v1.x, this.v2.x);
      var maxy = Math.max(this.v0.y, this.v1.y, this.v2.y);

      this.center = new Vertex((minx + maxx) / 2, (miny + maxy) / 2);

      dx = this.center.x - minx;
      dy = this.center.y - miny;
    } else {
      var cx = (D * E - B * F) / G;
      var cy = (A * F - C * E) / G;

      this.center = new Vertex(cx, cy);

      dx = this.center.x - this.v0.x;
      dy = this.center.y - this.v0.y;
    }

    this.radius_squared = dx * dx + dy * dy;
    this.radius = Math.sqrt(this.radius_squared);
  };

  Triangle.prototype.inCircumcircle = function(v) {
    var dx = this.center.x - v.x;
    var dy = this.center.y - v.y;
    var dist_squared = dx * dx + dy * dy;

    return (dist_squared <= this.radius_squared);
  };

  function Edge(v0, v1) {
    this.v0 = v0;
    this.v1 = v1;
  }

  Edge.prototype.equals = function(other) {
    return (this.v0 === other.v0 && this.v1 === other.v1);
  };

  Edge.prototype.inverse = function() {
    return new Edge(this.v1, this.v0);
  };

  function triangulate(vertices) {
    var triangles = [];

    var st = createBoundingTriangle(vertices);
    triangles.push(st);

    vertices.forEach(function(vertex) {
      triangles = addVertex(vertex, triangles);
    });

    triangles = triangles.filter(function(triangle) {
      return !(triangle.v0 == st.v0 || triangle.v0 == st.v1 || triangle.v0 == st.v2 ||
        triangle.v1 == st.v0 || triangle.v1 == st.v1 || triangle.v1 == st.v2 ||
        triangle.v2 == st.v0 || triangle.v2 == st.v1 || triangle.v2 == st.v2);
    });

    return triangles;
  }

  function createBoundingTriangle(vertices) {
    
    var minx, miny, maxx, maxy;
    vertices.forEach(function(vertex) {
      if (minx === undefined || vertex.x < minx) { minx = vertex.x; }
      if (miny === undefined || vertex.y < miny) { miny = vertex.y; }
      if (maxx === undefined || vertex.x > maxx) { maxx = vertex.x; }
      if (maxy === undefined || vertex.y > maxy) { maxy = vertex.y; }
    });

    var dx = (maxx - minx) * 10;
    var dy = (maxy - miny) * 10;

    var stv0 = new Vertex(minx - dx, miny - dy * 3);
    var stv1 = new Vertex(minx - dx, maxy + dy);
    var stv2 = new Vertex(maxx + dx * 3, maxy + dy);

    return new Triangle(stv0, stv1, stv2);
  }

  function addVertex(vertex, triangles) {
    var edges = [];
    triangles = triangles.filter(function(triangle) {
      if (triangle.inCircumcircle(vertex)) {
        edges.push(new Edge(triangle.v0, triangle.v1));
        edges.push(new Edge(triangle.v1, triangle.v2));
        edges.push(new Edge(triangle.v2, triangle.v0));
        return false;
      }

      return true;
    });

    edges = uniqueEdges(edges);
    edges.forEach(function(edge) {
      triangles.push(new Triangle(edge.v0, edge.v1, vertex));
    });

    return triangles;
  }

  function uniqueEdges(edges) {
    var uniqueEdges = [];
    for (var i = 0; i < edges.length; ++i) {
      var edge1 = edges[i];
      var unique = true;

      for (var j = 0; j < edges.length; ++j) {
        if (i === j)
          continue;
        var edge2 = edges[j];
        if (edge1.equals(edge2) || edge1.inverse().equals(edge2)) {
          unique = false;
          break;
        }
      }

      if (unique)
        uniqueEdges.push(edge1);
    }
    return uniqueEdges;
  }
  global.Vertex = Vertex;
  global.Triangle = Triangle;
  global.Edge = Edge;
  global.triangulate = triangulate;

}(self));