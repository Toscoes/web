const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")

const TILESIZE = 16
const PADDING = 1

class Graph {
    constructor() {
        this.nodes = []
    }
}

// weighted, cost directed
class Grid extends Graph {
    constructor(grid, diagonals) {
        super()
        this.grid = grid
        this.diagonals = diagonals
        this.build()
    }

    // rebuild the graph
    build(d) {

        this.nodes = []

        const grid = this.grid
        const diagonals = d || this.diagonals

        grid.forEach( (row, y) => {
            row.forEach( (cell, x) => {
                if (cell) {

                    // Node: 
                    // {
                    //    id: number,
                    //    neighbors: array of Neighbor 
                    // }

                    // Neighbor:
                    // {
                    //    id: number,
                    //    cost: number
                    // }

                    const nodeId = this.xy2i(x,y)
                    const node = {id: nodeId, neighbors: null}

                    const neighbors = []

                    const TOP = y - 1
                    const BOTTOM = y + 1
                    const LEFT = x - 1
                    const RIGHT = x + 1

                    const LAST_ROW = row.length - 1
                    const LAST_COL = row[0].length - 1
                    
                    if (y != 0 && grid[TOP][x]) { // top middle
                        const neighborId = this.xy2i(x,TOP)
                        neighbors.push({
                            id: neighborId,
                            cost: grid[TOP][x]
                        })
                    }
                    if (y != LAST_ROW && grid[BOTTOM][x]) { // bottom middle
                        const neighborId = this.xy2i(x,BOTTOM)
                        neighbors.push({
                            id: neighborId,
                            cost: grid[BOTTOM][x]
                        })
                    }

                    if (x != 0 && grid[y][LEFT]) { // middle left
                        const neighborId = this.xy2i(LEFT,y)
                        neighbors.push({
                            id: neighborId,
                            cost: grid[y][LEFT]
                        })
                    }

                    if (x != LAST_COL && grid[y][RIGHT]) { // middle right
                        const neighborId = this.xy2i(RIGHT,y)
                        neighbors.push({
                            id: neighborId,
                            cost: grid[y][RIGHT]
                        })
                    }

                    if (diagonals) {
                        if (y != 0 && x != 0 && grid[TOP][LEFT]) { // top left
                            const neighborId = this.xy2i(LEFT,TOP)
                            neighbors.push({
                                id: neighborId,
                                cost: grid[TOP][LEFT]
                            })
                        }
                        if (y != 0 && x != 0 && grid[TOP][RIGHT]) { // top right
                            const neighborId = this.xy2i(RIGHT,TOP)
                            neighbors.push({
                                id: neighborId,
                                cost: grid[TOP][RIGHT]
                            })
                        }
                        if (y != LAST_ROW && x != 0 && grid[BOTTOM][LEFT]) { // bottom left
                            const neighborId = this.xy2i(LEFT,BOTTOM)
                            neighbors.push({
                                id: neighborId,
                                cost: grid[BOTTOM][LEFT]
                            })
                        }
                        if (y != LAST_ROW && x != LAST_COL && grid[BOTTOM][RIGHT]) { // bottom right
                            const neighborId = this.xy2i(RIGHT,BOTTOM)
                            neighbors.push({
                                id: neighborId,
                                cost: grid[BOTTOM][RIGHT]
                            })
                        }
                    }
                    node.neighbors = neighbors
                    this.nodes[nodeId] = node
                }
            })
        })
    }

    setCell(i, val) {
        const pos = this.i2xy(i)
        this.grid[pos.y][pos.x] = val
        this.nodes[i].neighbors.forEach(neighbor => {
            this.nodes[neighbor.id].neighbors.forEach(other => {
                if (other.id == i) {
                    other.cost = val
                }
            })
        })
    }

    xy2i (x, y) {
        return y * this.grid[0].length + x
    }
    
    i2xy (i) {
        return {
            x: i % this.grid[0].length,
            y: Math.floor(i / this.grid[0].length)
        }
    }
}

function initInf(graph) {
    let score = []
    for(let i = 0; i < graph.length; i++) {
        score[i] = Infinity
    }
    
    return score
}

function h(i, d, graph) {
    let a = i2xy(i, graph)
    let b = i2xy(d, graph)
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}


function astarRedux(a, b, graph) {

    let openSet = [a]
    let cameFrom = {}

    let gScore = initInf(graph.nodes)
    gScore[a] = 0

    let fScore = initInf(graph.nodes)
    fScore[a] = h(a, b, graph.grid)

    while(openSet.length != 0) {

        let lowestv = Infinity
        let lowesti = -1

        openSet.forEach((n, i) => {
            if (fScore[n] < lowestv) {
                lowestv = fScore[n]
                lowesti = i
            } else if (fScore[n] == lowestv && h(n, b, graph.grid) < h(lowesti, b, graph.grid)) {
                lowestv = fScore[n]
                lowesti = i
            }
        })

        let curr = openSet.splice(lowesti, 1)[0]

        if (curr == b) {
            let path = []
            path.push(curr)
            let prev = cameFrom[curr]
            while (prev != null) {
                path.push(prev)
                prev = cameFrom[prev]
            }
            return path
        }

        const neighbors = graph.nodes[curr].neighbors

        for (const neighbor of neighbors) {
            let tentativeGScore = gScore[curr] + neighbor.cost
            if (tentativeGScore < gScore[neighbor.id]) {
                cameFrom[neighbor.id] = curr
                gScore[neighbor.id] = tentativeGScore
                fScore[neighbor.id] = gScore[neighbor.id] + h(neighbor.id, b, graph.grid)
                if (!openSet.includes(neighbor.id)) {
                    openSet.push(neighbor.id)
                }
            }
        }
    }
    return
}

function astar(a, b, graph) {

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

        let curr_i = openSet.splice(lowesti, 1)[0]

        if (curr_i == b) {
            let path = []
            path.push(curr_i)
            let prev = cameFrom[curr_i]
            while (prev != null) {
                path.push(prev)
                prev = cameFrom[prev]
            }
            return path
        }

        let curr_xy = i2xy(curr_i, graph)
        let x = curr_xy.x
        let y = curr_xy.y

        let neighbors = {}
        if (x != 0 && graph[y][x-1]) {
            // left side
            neighbors.left = xy2i(x - 1, y, graph)
        }
        if (y != 0 && graph[y-1][x]) {
            // top side
            neighbors.top = xy2i(x, y - 1, graph)
        }
        if (x != graph[0].length - 1 && graph[y][x+1]) {
            // right side
            neighbors.right = xy2i(x + 1, y, graph)
        }
        if (y != graph.length - 1 && graph[y+1][x]) {
            // bottom side
            neighbors.bottom = xy2i(x, y + 1, graph)
        }

        for (let dir in neighbors) {
            let neighbor_i = neighbors[dir]
            let neighbor_xy = i2xy(neighbor_i, graph)
            let tentativeGScore = gScore[curr_i] + graph[neighbor_xy.y][neighbor_xy.x]
            if (tentativeGScore < gScore[neighbor_i]) {
                cameFrom[neighbor_i] = curr_i
                gScore[neighbor_i] = tentativeGScore
                fScore[neighbor_i] = gScore[neighbor_i] + h(neighbor_i, b, graph)
                if (!openSet.includes(neighbor_i)) {
                    openSet.push(neighbor_i)
                }
            }
        }
    }
    return
}


const rooms = 2
const grid = 50

const EMPTY = 0
const WALL = 1
const OPEN = 2
const START = 3
const EXIT = 4
const PATH = 5

function xy2i (x, y, graph) {
    return y * graph[0].length + x
}

function i2xy (i, graph) {
    return {
        x: i % graph[0].length,
        y: Math.floor(i / graph[0].length)
    }
}

function generateLevel(numRooms) {

    const RoomList = []
    let graph = []
    let nav = []

    // create graph to store drawing ids and graph to store random nav values for a*
    for(let i = 0; i < grid; i++) {
        graph[i] = []
        nav[i] = []
        for(let j = 0; j < grid; j++) {
            graph[i][j] = EMPTY
            nav[i][j] = Math.round(Math.random() * 5) + 1
        }
    }

    let navGrid = new Grid(nav)
    
    // place initial room
    let x = Math.floor(Math.random() * graph[0].length)
    let y = Math.floor(Math.random() * graph.length)
    RoomList.push({x: x, y: y})
    graph[y][x] = OPEN

    for(let r = 0; r < numRooms - 1; r++) {
        let x = Math.floor(Math.random() * graph[0].length)
        let y = Math.floor(Math.random() * graph.length)
        let err = 0
        while (graph[y][x]) {
            x = Math.floor(Math.random() * graph[0].length)
            y = Math.floor(Math.random() * graph.length) 
            if (err > 100) {
                break
            }
            err++
        }
        graph[y][x] = OPEN

        let connection = RoomList[Math.floor(Math.random() * RoomList.length)]
        RoomList.push({x: x, y: y})

        // path to connected room
        let a = xy2i(x,y,graph)
        let b = xy2i(connection.x, connection.y, graph)
        let path = astarRedux(a,b,navGrid)

        path.forEach( n => {
            let xy = i2xy(n,graph) 
            graph[xy.y][xy.x] = OPEN
        })
    }

    // expand rooms
    RoomList.forEach(node => {
        let x = node.x
        let y = node.y

        let left = Math.floor(Math.random() * 4) + 2
        let right = Math.floor(Math.random() * 4) + 1
        let top = Math.floor(Math.random() * 4) + 2
        let bottom = Math.floor(Math.random() * 4) + 1

        for (let r = y - top; r < y + bottom; r++) {
            for (let c = x - left; c < x + right; c++) {
                if (r > -1 && r < graph.length && c > -1 && c < graph[0].length) {
                    graph[r][c] = OPEN
                }
            }
        }
    })

    // add padding
    let rows = new Array(graph[0].length).fill(EMPTY)
    graph.unshift(rows)
    graph.push(rows)
    nav.unshift(rows)
    nav.push(rows)

    // wtf
    graph[0].push(EMPTY)
    graph[0].unshift(EMPTY)
    for (let i = 1; i < graph.length - 1; i++) {
        graph[i].push(EMPTY)
        graph[i].unshift(EMPTY)
        nav[i].push(EMPTY)
        nav[i].unshift(EMPTY)
    }

    // place walls
    for (let y = 0; y < graph.length; y++) {
        for (let x = 0; x < graph[0].length; x++) {
            if (
                graph[y][x] == EMPTY &&
                (
                (y != 0 && x != 0 && graph[y-1][x-1] == OPEN) ||
                (y != 0 && graph[y-1][x] == OPEN) ||
                (y != 0 && x != graph[0].length - 1 && graph[y-1][x + 1] == OPEN) ||
                (x != 0 && graph[y][x-1] == OPEN) ||
                (x != graph[0].length - 1 && graph[y][x + 1] == OPEN) ||
                (y != graph.length - 1 && x != 0 && graph[y+1][x-1] == OPEN) ||
                (y != graph.length - 1 && graph[y+1][x] == OPEN) ||
                (y != graph.length - 1 && x != graph[0].length - 1 && graph[y+1][x+1] == OPEN)
                )
            ) {
                graph[y][x] = WALL
            }
        }
    }
    
    // place start and exit
    x = Math.floor(Math.random() * graph[0].length)
    y = Math.floor(Math.random() * graph.length)
    while (graph[y][x] != OPEN) {
        x = Math.floor(Math.random() * graph[0].length)
        y = Math.floor(Math.random() * graph.length)
    }
    graph[y][x] = START
    let s = xy2i(x,y,graph)
    let player = {x: x, y: y}

    x = Math.floor(Math.random() * graph[0].length)
    y = Math.floor(Math.random() * graph.length)
    while (graph[y][x] != OPEN) {
        x = Math.floor(Math.random() * graph[0].length)
        y = Math.floor(Math.random() * graph.length)
    }
    graph[y][x] = EXIT
    let e = xy2i(x,y,graph)

    // recalculate nav graph based on drawn graph
    for (let y = 0; y < graph.length; y++) {
        for (let x = 0; x < graph[0].length; x++) {
            if (graph[y][x] != EMPTY && graph[y][x] != WALL) {
                nav[y][x] = 1
            }
        }
    }

    return {graph: graph, player: player}
}

function update() {

}

let reveal = true
let data = generateLevel(rooms)
let graph = data.graph
let px = data.player.x
let py = data.player.y
let viewDistance = 20
let vis = getVisibility(px, py, viewDistance, graph)

function draw() {
    for (let y = 0; y < graph.length; y++) {
        for (let x = 0; x < graph[0].length; x++) {
            //if (y > py - viewDistance && y < py + viewDistance && x > px - viewDistance && x < px + viewDistance) {
            if (vis[y][x] == 1 || reveal) {
                if(y == py && x == px) {
                    context.fillStyle = "cyan"
                } else if (graph[y][x] == EMPTY) {
                    context.fillStyle = "black"
                } else if (graph[y][x] == WALL) {
                    context.fillStyle = "red"
                } else if (graph[y][x] == OPEN) {
                    context.fillStyle = "white"
                } else if (graph[y][x] == START) {
                    context.fillStyle = "blue"
                } else if (graph[y][x] == EXIT) {
                    context.fillStyle = "yellow"
                }
            } else {
                context.fillStyle = "black"
            }
            context.fillRect(x * TILESIZE + (x * PADDING), y * TILESIZE + (y * PADDING), TILESIZE, TILESIZE)
        }
    }
}

document.addEventListener("keydown", e => {
    if (e.key == "w") {
        if (graph[py-1][px] != WALL) {
            py--
        }
    }
    if (e.key == "a") {
        if (graph[py][px-1] != WALL) {
            px--
        }
    }
    if (e.key == "s") {
        if (graph[py+1][px] != WALL) {
            py++
        }
    }
    if (e.key == "d") {
        if (graph[py][px+1] != WALL) {
            px++
        }
    }
    if (e.key == "p") {
        console.log("p")
        reveal = !reveal
    }
    vis = getVisibility(px, py, viewDistance, graph)
})

function main() {

    context.clearRect(0,0,canvas.width,canvas.height)

    update()
    draw()

    requestAnimationFrame(main)
}
main()

window.addEventListener("resize", resize)
function resize() {
    canvas.width = canvas.clientWidth * window.devicePixelRatio
    canvas.height = canvas.clientHeight * window.devicePixelRatio

    context.canvas.width = canvas.width
    context.canvas.height = canvas.height
}
resize()

function getVisibility(xo, yo, distance, graph) {
    let visibility = []
    for(let r = 0; r < graph.length; r++) {
        visibility[r] = []
        for(let c = 0; c < graph[0].length; c++) {
            visibility[r][c] = 0
        }
    }
    for (let y = yo - distance; y < yo + distance; y++) {
        for (let x = xo - distance; x < xo + distance; x++) {
            line(xo,yo,x,y,graph,visibility)
        }
    }
    return visibility
}

function line(x1,y1,x2,y2,graph,visibility) {
    let rise = y2 - y1
    let run = x2 - x1
    if (run == 0) {
        if (y2 < y1) {
            for (let y = y1; y > y2 - 1; y--) {
                visibility[y][x1] = 1
                if (graph[y][x1] == WALL) {
                    break
                }
            }
        } else {
            for (let y = y1; y < y2 + 1; y++) {
                visibility[y][x1] = 1
                if (graph[y][x1] == WALL) {
                    break
                }
            }
        }
    } else {
        let m = rise / run
        let adjust = m >= 0 ? 1 : -1
        let offset = 0
        let threshold = 0.5
        if (m <= 1 && m >= -1) {
            let delta = Math.abs(m)
            let y = y1
            if (x2 < x1) {
                for (let x = x1; x > x2 - 1; x--) {
                    visibility[y][x] = 1
                    if (graph[y][x] == WALL) {
                        break
                    }
                    offset += delta
                    if ( offset >= threshold) {
                        y -= adjust
                        threshold += 1
                    }
                }
            } else {
                for (let x = x1; x < x2 + 1; x++) {

                    visibility[y][x] = 1
                    if (graph[y][x] == WALL) {
                        break
                    }
    
                    offset += delta
                    if ( offset >= threshold) {
                        y += adjust
                        threshold += 1
                    }
                }
            }

        } else {
            let delta = Math.abs(run / rise)
            let x = x1
            if (y2 < y1) {
                for (let y = y1; y > y2 - 1; y--) {
                    visibility[y][x] = 1
                    if (graph[y][x] == WALL) {
                        break
                    }
                    offset += delta
                    if (offset >= threshold) {
                        x -= adjust
                        threshold += 1
                    }
                }
            } else {
                for (let y = y1; y < y2 + 1; y++) {
                    visibility[y][x] = 1
                    if (graph[y][x] == WALL) {
                        break
                    }
                    offset += delta
                    if (offset >= threshold) {
                        x += adjust
                        threshold += 1
                    }
                }
            }
        }
    }
}