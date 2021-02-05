function initInf(graph) {
    let score = []
    for(let i = 0; i < graph.length * graph[0].length; i++) {
        score[i] = Infinity
    }
    return score
}

function astar(a, b, graph, h) {

    let openSet = [a]
    let cameFrom = {}

    let gScore = initInf(graph)
    gScore[a] = 0

    let fScore = initInf(graph)
    fScore[a] = h(a, b, graph)

    while(openSet.length != 0) {

        let lowestv = Infinity
        let lowesti = -1

        openSet.forEach((n, i) => {
            if (fScore[n] < lowestv) {
                lowestv = fScore[n]
                lowesti = i
            } else if (fScore[n] == lowestv && h(n, b, graph) < h(lowesti, b, graph)) {
                lowestv = fScore[n]
                lowesti = i
            }
        })

        const curr = openSet.splice(lowesti, 1)[0]

        if (curr == b) {
            const path = []
            path.push(curr)
            let prev = cameFrom[curr]
            while (prev != null) {
                path.push(prev)
                prev = cameFrom[prev]
            }
            return path
        }

        for (const neighbor in curr.neighbors) {
            const tentativeGScore = gScore[curr] + graph[neighbor_xy.y][neighbor_xy.x]
            if (tentativeGScore < gScore[neighbor]) {
                cameFrom[neighbor_i] = curr_i
                gScore[neighbor_i] = tentativeGScore
                fScore[neighbor_i] = gScore[neighbor] + h(neighbor_i, b, graph)
                if (!openSet.includes(neighbor_i)) {
                    openSet.push(neighbor_i)
                }
            }
        }
    }
    return
}