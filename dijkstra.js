class Path {
  constructor (cost, node, moreinfo) {
    /** @member {Number} cost */
    this.cost = cost
    /** @member {Node} node */
    this.node = node
    // arbitrary field that you can add to debug your code
    /** @member {Object} moreinfo */
    this.moreinfo = moreinfo
  }
}

class Node {
  /**
   * @param {String} name
   * @param {Path[]} paths
   */
  constructor (name, paths = []) {
    /** @member {Boolean} visited */
    this.visited = false
    /** @member {String} name */
    this.name = name
    /** @member {Array<Path>} paths */
    this.paths = paths
    /** @member {Number} distance */
    this.distance = Infinity
    /** @member {Node} visitedFrom */
    this.visitedFrom = null
  }

  /**
   * @param {Node} node
   * @param {Number} cost
   * @param {Object} [moreinfo]
   */
  addOrientedPath (node, cost, moreinfo) {
    const current = this.paths.findIndex(n => n.node === node)
    if (current !== -1) {
      this.paths.splice(current, 1)
    }
    this.paths.push(new Path(cost, node, moreinfo))
  }

  /**
   * @param {Node} node
   * @param {Function} cost
   */
  addNonOrientedPath (node, cost) {
    this.addOrientedPath(node, cost)
    node.addOrientedPath(this, cost)
  }

  /**
   * Calculates the new distance for each node
   * Already visited nodes shouldn't be updated
   * The {@link Node}s returned are the nodes which were never calculated before
   * @returns {Node[]}
   */
  calcNeighboursTentativeDistance () {
    const neverCalculated = []
    this.paths.forEach((p) => {
      if (p.node.visited) { return }
      if (p.node.distance === Infinity) {
        neverCalculated.push(p.node)
      }
      const dist = p.cost + this.distance
      if (dist >= p.node.distance) { return }
      p.node.distance = dist
      p.node.visitedFrom = this
    })
    return neverCalculated
  }
}

class Dijkstra {
  /**
   * Calculates the shortest path, and returns a list of nodes
   * that we need to go through to have the path
   * @param {Node} startNode
   * @param {Node} endNode
   * @returns {Node[]}
   */
  static shortestPathFirst (startNode, endNode) {
    if (startNode === endNode) return []
    const nextNodes = []
    nextNodes.push(startNode)
    startNode.distance = 0

    while (nextNodes.length) {
      const curr = nextNodes.shift()
      curr.visited = true
      if (curr === endNode) { return this.generatePath(endNode) }
      const next = curr.calcNeighboursTentativeDistance()
      nextNodes.push(...next)
      nextNodes.sort((a, b) => a.distance < b.distance)
    }

    return []
  }

  /**
   * Generates the path from an endNode to the startNode
   * it uses the `visitedFrom` property to navigate backwards
   * to the starting point
   * @param {Node} endNode
   * @returns {Node[]}
   */
  static generatePath (endNode) {
    const path = []
    let curr = endNode
    while (curr) {
      path.unshift(curr)
      curr = curr.visitedFrom
    }
    return path
  }

  /**
   * Print the path like a linked list
   * @param {Node[]} listOfNodes
   */
  /* istanbul ignore next */
  static printPath (listOfNodes) {
    let out = ''
    for (const n of listOfNodes) {
      out += `(${n.name}, ${n.distance}) => `
    }
    out += 'x'
    console.log(out)
  }
}

module.exports = { Dijkstra, Path, Node }
