import { Level } from "./level.js"

const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")

console.log(new Level(40, 10))

const TILESIZE = 8
const PADDING = 1

function xy2i (x, y, map) {
    return y * map[0].length + x
}

function i2xy (i, map) {
    return {
        x: i % map[0].length,
        y: Math.floor(i / map[0].length)
    }
}

function initInf(map) {
    let score = []
    for(let i = 0; i < map.length * map[0].length; i++) {
        score[i] = Infinity
    }
    return score
}

function h(i, d, map) {
    let a = i2xy(i, map)
    let b = i2xy(d, map)
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

function astar(a, b, map) {

    let openSet = [a]
    let cameFrom = {}

    let gScore = initInf(map)
    gScore[a] = 0

    let fScore = initInf(map)
    fScore[a] = h(a, b, map)

    while(openSet.length != 0) {

        let lowestv = Infinity
        let lowesti = -1

        openSet.forEach((n, i) => {
            if (fScore[n] < lowestv) {
                lowestv = fScore[n]
                lowesti = i
            } else if (fScore[n] == lowestv && h(n, b, map) < h(lowesti, b, map)) {
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

        let curr_xy = i2xy(curr_i, map)
        let x = curr_xy.x
        let y = curr_xy.y

        let neighbors = {}
        if (x != 0 && map[y][x-1]) {
            // left side
            neighbors.left = xy2i(x - 1, y, map)
        }
        if (y != 0 && map[y-1][x]) {
            // top side
            neighbors.top = xy2i(x, y - 1, map)
        }
        if (x != map[0].length - 1 && map[y][x+1]) {
            // right side
            neighbors.right = xy2i(x + 1, y, map)
        }
        if (y != map.length - 1 && map[y+1][x]) {
            // bottom side
            neighbors.bottom = xy2i(x, y + 1, map)
        }

        for (let dir in neighbors) {
            let neighbor_i = neighbors[dir]
            let neighbor_xy = i2xy(neighbor_i, map)
            let tentativeGScore = gScore[curr_i] + map[neighbor_xy.y][neighbor_xy.x]
            if (tentativeGScore < gScore[neighbor_i]) {
                cameFrom[neighbor_i] = curr_i
                gScore[neighbor_i] = tentativeGScore
                fScore[neighbor_i] = gScore[neighbor_i] + h(neighbor_i, b, map)
                if (!openSet.includes(neighbor_i)) {
                    openSet.push(neighbor_i)
                }
            }
        }
    }
    return
}

const rooms = 10
const grid = 40

const EMPTY = 0
const WALL = 1
const OPEN = 2
const START = 3
const EXIT = 4
const PATH = 5

function generateLevel(numRooms) {

    const RoomList = []
    let map = []
    let nav = []

    // create map to store drawing ids and map to store random nav values for a*
    for(let i = 0; i < grid; i++) {
        map[i] = []
        nav[i] = []
        for(let j = 0; j < grid; j++) {
            map[i][j] = EMPTY
            nav[i][j] = Math.round(Math.random() * 5) + 1
        }
    }
    
    // place initial room
    let x = Math.floor(Math.random() * map[0].length)
    let y = Math.floor(Math.random() * map.length)
    RoomList.push({x: x, y: y})
    map[y][x] = OPEN

    for(let r = 0; r < numRooms - 1; r++) {
        let x = Math.floor(Math.random() * map[0].length)
        let y = Math.floor(Math.random() * map.length)
        let err = 0
        while (map[y][x]) {
            x = Math.floor(Math.random() * map[0].length)
            y = Math.floor(Math.random() * map.length) 
            if (err > 100) {
                break
            }
            err++
        }
        map[y][x] = OPEN

        let connection = RoomList[Math.floor(Math.random() * RoomList.length)]
        RoomList.push({x: x, y: y})

        // path to connected room
        let a = xy2i(x,y,map)
        let b = xy2i(connection.x, connection.y, map)
        let path = astar(a,b,nav)

        path.forEach( n => {
            let xy = i2xy(n,map) 
            map[xy.y][xy.x] = OPEN
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
                if (r > -1 && r < map.length && c > -1 && c < map[0].length) {
                    map[r][c] = OPEN
                }
            }
        }
    })

    // add padding
    let rows = new Array(map[0].length).fill(EMPTY)
    map.unshift(rows)
    map.push(rows)
    nav.unshift(rows)
    nav.push(rows)

    // wtf
    map[0].push(EMPTY)
    map[0].unshift(EMPTY)
    for (let i = 1; i < map.length - 1; i++) {
        map[i].push(EMPTY)
        map[i].unshift(EMPTY)
        nav[i].push(EMPTY)
        nav[i].unshift(EMPTY)
    }

    // place walls
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
            if (
                map[y][x] == EMPTY &&
                (
                (y != 0 && x != 0 && map[y-1][x-1] == OPEN) ||
                (y != 0 && map[y-1][x] == OPEN) ||
                (y != 0 && x != map[0].length - 1 && map[y-1][x + 1] == OPEN) ||
                (x != 0 && map[y][x-1] == OPEN) ||
                (x != map[0].length - 1 && map[y][x + 1] == OPEN) ||
                (y != map.length - 1 && x != 0 && map[y+1][x-1] == OPEN) ||
                (y != map.length - 1 && map[y+1][x] == OPEN) ||
                (y != map.length - 1 && x != map[0].length - 1 && map[y+1][x+1] == OPEN)
                )
            ) {
                map[y][x] = WALL
            }
        }
    }
    
    // place start and exit
    x = Math.floor(Math.random() * map[0].length)
    y = Math.floor(Math.random() * map.length)
    while (map[y][x] != OPEN) {
        x = Math.floor(Math.random() * map[0].length)
        y = Math.floor(Math.random() * map.length)
    }
    map[y][x] = START
    let s = xy2i(x,y,map)
    let player = {x: x, y: y}

    x = Math.floor(Math.random() * map[0].length)
    y = Math.floor(Math.random() * map.length)
    while (map[y][x] != OPEN) {
        x = Math.floor(Math.random() * map[0].length)
        y = Math.floor(Math.random() * map.length)
    }
    map[y][x] = EXIT
    let e = xy2i(x,y,map)
    let chaser = {x: x, y: y}

    // recalculate nav map based on drawn map
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
            if (map[y][x] != EMPTY && map[y][x] != WALL) {
                nav[y][x] = 1
            }
        }
    }

    return {map: map, nav: nav, player: player, chaser: chaser}

    /* for testing
    let start2exit = astar(s,e,nav)
    start2exit.forEach( n => {
        let xy = i2xy(n,map) 
        map[xy.y][xy.x] = PATH
    })
    */

    /* 
    const RoomList = [] 
    const EdgeList = []
    
    // place rooms
    for(let r = 0; r < numRooms; r++) {
        let x = Math.floor(Math.random() * drawnMap[0].length)
        let y = Math.floor(Math.random() * drawnMap.length)
        while (drawnMap[y][x]) {
            x = Math.floor(Math.random() * drawnMap[0].length)
            y = Math.floor(Math.random() * drawnMap.length) 
        }
        drawnMap[y][x] = 1
        RoomList.push({x: x, y: y})
    }

    // create complete graph
    for (let i = 0; i < RoomList.length; i++) {
        let nodeA = RoomList[i]
        for (let j = i + 1; j < RoomList.length; j++) {
            let nodeB = RoomList[j]
            let distance = Math.abs(nodeB.x - nodeA.x) + Math.abs(nodeB.y - nodeA.y)
            EdgeList.push({a: i, b: j, cost: distance})
        }
    }

    // sort edges by cost from lowest to highest
    EdgeList.sort((a, b) => {
        return a.cost - b.cost
    })

    console.log(EdgeList)

    // make MST
    const MST = []
    EdgeList.forEach( edge => {
        
    })
    */

    /*
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
            if (map[y][x] == EMPTY) {
                context.fillStyle = "black"
            }
            if (map[y][x] == WALL) {
                context.fillStyle = "red"
            }
            if (map[y][x] == OPEN) {
                context.fillStyle = "white"
            }
            if (map[y][x] == START) {
                context.fillStyle = "blue"
            }
            if (map[y][x] == EXIT) {
                context.fillStyle = "yellow"
            }
            if (map[y][x] == PATH) {
                context.fillStyle = "green"
            }
            context.fillRect(x * TILESIZE + (x * PADDING), y * TILESIZE + (y * PADDING), TILESIZE, TILESIZE)
        }
    }
    */
}

function update() {

}

let reveal = true
let data = generateLevel(10)
let map = data.map
let nav = data.nav
let px = data.player.x
let py = data.player.y
let viewDistance = 12
let vis = getVisibility(px, py, viewDistance, map)

let cx = data.chaser.x
let cy = data.chaser.y

console.log(cx + " " + cy)

function draw() {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
            //if (y > py - viewDistance && y < py + viewDistance && x > px - viewDistance && x < px + viewDistance) {
            if (vis[y][x] == 1 || reveal) {
                if(y == py && x == px) {
                    context.fillStyle = "cyan"
                } else if (y == cy && x == cx) {
                    context.fillStyle = "green"
                } else if (map[y][x] == EMPTY) {
                    context.fillStyle = "black"
                } else if (map[y][x] == WALL) {
                    context.fillStyle = "red"
                } else if (map[y][x] == OPEN) {
                    context.fillStyle = "white"
                } else if (map[y][x] == START) {
                    context.fillStyle = "blue"
                } else if (map[y][x] == EXIT) {
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
        if (map[py-1][px] != WALL) {
            py--
        }
    }
    if (e.key == "a") {
        if (map[py][px-1] != WALL) {
            px--
        }
    }
    if (e.key == "s") {
        if (map[py+1][px] != WALL) {
            py++
        }
    }
    if (e.key == "d") {
        if (map[py][px+1] != WALL) {
            px++
        }
    }
    if (e.key == "p") {
        console.log("p")
        reveal = !reveal
    }
    vis = getVisibility(px, py, viewDistance, map)
    processChaser()
})

function processChaser() {
    // should process their own internal nav map

    let chaserNav = []
    for (let y = 0; y < map.length; y++) {
        chaserNav[y] = []
        for (let x = 0; x < map[0].length; x++) {
            chaserNav[y][x] = map[y][x] != WALL? 1 : 0
        }
    }
    let path = astar(xy2i(cx,cy,nav), xy2i(px,py,nav), chaserNav)
    let next = i2xy(path[path.length-2], map)
    if (next.x == px && next.y == py) {
        return
        // attack!
    }
    cx = next.x
    cy = next.y
}

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

function getVisibility(xo, yo, distance, map) {
    let visibility = []
    for(let r = 0; r < map.length; r++) {
        visibility[r] = []
        for(let c = 0; c < map[0].length; c++) {
            visibility[r][c] = 0
        }
    }
    for (let y = yo - distance; y < yo + distance; y++) {
        for (let x = xo - distance; x < xo + distance; x++) {
            line(xo,yo,x,y,map,visibility)
        }
    }
    return visibility
}

function line(x1,y1,x2,y2,map,visibility) {
    let rise = y2 - y1
    let run = x2 - x1
    if (run == 0) {
        if (y2 < y1) {
            for (let y = y1; y > y2 - 1; y--) {
                visibility[y][x1] = 1
                if (map[y][x1] == WALL) {
                    break
                }
            }
        } else {
            for (let y = y1; y < y2 + 1; y++) {
                visibility[y][x1] = 1
                if (map[y][x1] == WALL) {
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
                    if (map[y][x] == WALL) {
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
                    if (map[y][x] == WALL) {
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
                    if (map[y][x] == WALL) {
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
                    if (map[y][x] == WALL) {
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