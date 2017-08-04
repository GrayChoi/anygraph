import { has } from 'lodash';

export default class Graph {

  static defalutEdgeName = 'edge';

  constructor() {
    this._nodes = {};
    this._edges = {};
    this._in = {};
    this._predecessors = {};
    this._out = {}
    this._successors = {};
  }

  setNode = (vertex, node = {}) => {
    if (has(this._nodes, vertex)) {
      this._nodes[vertex] = node;
      return this;
    }

    this._in[vertex] = {};
    this._predecessors[vertex] = {};
    this._out[vertex] = {};
    this._successors[vertex] = {};
    this._nodeCount = 0;
    this._edgeCount = 0;

    this._edges = {};

    this._nodeCount = this._nodeCount + 1;
    return this;
  }

  node = vertex => this._nodes[vertex];

  hasNode = (vertex) => has(this._nodes, vertex);

  removeNode = (vertex) => {
    if (has(this._nodes, vertex)) {
      delete this._nodes[vertex];
      this._nodeCount = this._nodeCount - 1;
    }
    return this;
  }

  setEdge = (vertexA, vertexB, options = {}) => {
    // ensures the node A and node B exist
    if (!has(this._nodes, vertexA)) this.setNode(vertexA);
    if (!has(this._nodes, vertexB)) this.setNode(vertexB);

    const edgeId = generateEdgeId(vertexA, vertexB, { isDirected: this.isDirected, ...options });
    const edge = generateEdge(vertexA, vertexB, options);

    this.edges[edgeId] = edge;

    this._out[vertexA]= edgeId;
    this._in[vertexB]= edgeId;

    this._predecessors[vertexB] =
      this._predecessors[vertexB] ? [...this._predecessors[vertexB], vertexA] : [vertexA];
    this._successors[vertexA] =
      this._predecessors[vertexA] ? [...this._predecessors[vertexA], vertexB] : [vertexB];

    this._edgeCount = this._edgeCount + 1;
    return this;
  }

}

function generateEdge(vertexA, vertexB, options = {}) {
  const { name = Graph.defalutEdgeName, value } = options;
  return {
    vertexA,
    vertexB,
    name,
    value
  };
}

function generateEdgeId(vertexA, vertexB, options = {}) {
  const { isDirected, name =  Graph.defalutEdgeName} = options;
  if (isDirected) {
    return `${vertexA}->${vertexB}@${name}`;
  }
  return `${vertexA}-${vertexB}@${name}`
}