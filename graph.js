const st = (edgeMap, {start = 0, end}) => {
  const queue = [start]
  const queued = {[start]: true}
  const distance = {[start]: 0}
  const parent = {}
  while (queue.length > 0 && !(distance[end] >= 0)) {
    const current = queue.shift()
    queued[current] = false
    Object.keys(edgeMap[current]).forEach(next => {
      const cost = distance[current] + edgeMap[current][next]
      if (!(next in distance) || distance[next] > cost) {
        parent[next] = current
        distance[next] = cost
      }
    })
    if (!queued[next]) {
      queued[next] = true
      queue.push(next)
    }
  }
  return {distance, parent}
}

const addEdge = (edgeMap, a, b, value = 1) => {
  if (!edgeMap[a]) {
    edgeMap[a] = {}
  }
  edgeMap[a][b] = value
}

const maxFlow = (edges, {sink, depth} = {}) => {
  const edgeMap = {[sink]: {}}
  edges.forEach(({start, end}) => {
    addEdge(edgeMap, 0, start)
    addEdge(edgeMap, start, end)
    addEdge(edgeMap, end, start, 0)
    addEdge(edgeMap, end, sink)
  })
  let visited, done

  let sum = 0
  const go = (v, d) => {
    if (v == sink) {
      return 1
    }
    if (visited[v]) {
      return
    }
    visited[v] = true
    return Object.keys(edgeMap[v]).some(next => {
      if (!edgeMap[v][next]) {
        return
      }
      edgeMap[v][next] = 0
      const result = go(next, d - 1)
      if (result) {
        edgeMap[next][v] = 1
        return true
      }
      edgeMap[v][next] = 1
    })
  }

  Array.from({length: depth}, (_, d) => {
    if (done) {
      return
    }
    visited = {}
    let roundSum = 0
    while (go(0, d + 2)) {
      roundSum += 1
    }
    if (roundSum < 1) {
      done = true
    }
    sum += roundSum
  })
  return sum
}

export {maxFlow}
