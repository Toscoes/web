import { Tile } from "./tile.js"

// THERE IS A BUG THAT IS NOT PROPERLY RECORDING THE XY VALUES OF OPEN TILES (SOMETIMES WALL TILES- WHICH IS HOW THEY END UP OPPOSITE TO
// WHERE THEY TOUCH THE TOP AND BOTTOM EDGES)

// CAN WORK AROUND IT

export class Level {
    constructor(data, dim, numRooms, width, height) {

        this.TileData = data.tiles
        this.SpriteData = data.sprites

        this.width = width? width : dim
        this.height = height? height : dim
        this.map = this.generateLevel(numRooms)
    }

    generateLevel(numRooms) {

        let map = []

        // temp arrays
        let RoomOriginList = []
        let nav = []

        // helpers
        const randomX = () => Math.floor(Math.random() * this.width)
        const randomY = () => Math.floor(Math.random() * this.height)
        const randomRoom = () => Math.floor(Math.random() * RoomOriginList.length)
    
        // create map to store tiles and map to store random nav values for a*
        for(let i = 0; i < this.height; i++) {
            map[i] = []
            nav[i] = []
            for(let j = 0; j < this.width; j++) {
                map[i][j] = Tile.Empty
                nav[i][j] = Math.round(Math.random() * 5) + 1
            }
        }
        
        // place initial room
        let x = randomX()
        let y = randomY()
        RoomOriginList.push({x: x, y: y})
        map[y][x] = new Tile(x,y,this.TileData.Floor)
        let startXy = {x: x, y: y}
        let exitXy = {x: 0, y: 0}
    
        for(let r = 1; r < numRooms; r++) {
            let x = randomX()
            let y = randomY()
            let err = 0
            while (map[y][x]) {
                // while there is already something at the selected coordinates
                x = randomX()
                y = randomY()
                if (err > 100) {
                    break
                }
                err++
            }
            // get random room to connect to
            let dest = RoomOriginList[randomRoom()]

            // mark the room and add it to the list
            map[y][x] = new Tile(x,y, this.TileData.Floor)
            RoomOriginList.push({x: x, y: y})
    
            // path to connected room
            let a = this.xy2i(x,y)
            let b = this.xy2i(dest.x, dest.y)
            let path = this.astar(a,b,nav)
    
            // trace path between a and b
            path.forEach( n => {
                let xy = this.i2xy(n) 
                map[xy.y][xy.x] = new Tile(xy.x,xy.y, this.TileData.Floor)
            })

            if (r == numRooms - 1) {
                exitXy.x = x
                exitXy.y = y
            }
        }
    
        // expand rooms
        RoomOriginList.forEach(node => {
            let x = node.x
            let y = node.y
    
            let left = Math.floor(Math.random() * 4) + 2
            let right = Math.floor(Math.random() * 4) + 1
            let top = Math.floor(Math.random() * 4) + 2
            let bottom = Math.floor(Math.random() * 4) + 1
    
            for (let r = y - top; r < y + bottom; r++) {
                for (let c = x - left; c < x + right; c++) {
                    if (r > -1 && r < this.height && c > -1 && c < this.width) {
                        map[r][c] = new Tile(c,r, this.TileData.Floor)
                    }
                }
            }
        })
    
        // add padding
        let rows = new Array(this.width).fill(Tile.Empty)
        map.unshift(rows)
        map.push(rows)
        nav.unshift(rows)
        nav.push(rows)
    
        // wtf - real jank shit
        map[0].push(Tile.Empty)
        map[0].unshift(Tile.Empty)
        for (let i = 1; i < this.height - 1; i++) {
            map[i].push(Tile.Empty)
            map[i].unshift(Tile.Empty)
            nav[i].push(Tile.Empty)
            nav[i].unshift(Tile.Empty)
        }

        // update height and width
        this.width += 2
        this.height += 2
    
        // place walls
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (
                    map[y][x] == Tile.Empty &&
                    (
                    (y != 0 && x != 0 && map[y-1][x-1] && map[y-1][x-1].navigatable) ||
                    (y != 0 && map[y-1][x] && map[y-1][x].navigatable) ||
                    (y != 0 && x != this.width - 1 && map[y-1][x + 1] && map[y-1][x + 1].navigatable) ||
                    (x != 0 && map[y][x-1] && map[y][x-1].navigatable) ||
                    (x != this.width - 1 && map[y][x + 1] && map[y][x + 1].navigatable) ||
                    (y != this.height - 1 && x != 0 && map[y+1][x-1] && map[y+1][x-1].navigatable) ||
                    (y != this.height - 1 && map[y+1][x] && map[y+1][x].navigatable) ||
                    (y != this.height - 1 && x != this.width - 1 && map[y+1][x+1] && map[y+1][x+1].navigatable)
                    )
                ) {
                    map[y][x] = new Tile(x,y, this.TileData.Wall)
                }
            }
        }
        
        // place start
        startXy.x++
        startXy.y++
        map[startXy.y][startXy.x] = new Tile(startXy.x,startXy.y, this.TileData.Start)
        this.start = startXy
    
        // place exit
        exitXy.x++
        exitXy.y++
        map[exitXy.y][exitXy.x] = new Tile(exitXy.x,exitXy.y, this.TileData.Exit)
        this.exit = exitXy
    
        // return final map
        return map
    }

    xy2i (x, y) {
        return y * this.width + x
    }
    
    i2xy (i) {
        return {
            x: i % this.width,
            y: Math.floor(i / this.width)
        }
    }
    
    initInf() {
        let score = []
        for(let i = 0; i < this.height * this.width; i++) {
            score[i] = Infinity
        }
        return score
    }
    
    h(i, d) {
        let a = this.i2xy(i)
        let b = this.i2xy(d)
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
    }
    
    astar(a, b, nav) {

        let map = nav? nav : this.map

        let openSet = [a]
        let cameFrom = {}
    
        let gScore = this.initInf()
        gScore[a] = 0
    
        let fScore = this.initInf()
        fScore[a] = this.h(a, b)
    
        while(openSet.length != 0) {
    
            let lowestv = Infinity
            let lowesti = -1
    
            openSet.forEach((n, i) => {
                if (fScore[n] < lowestv) {
                    lowestv = fScore[n]
                    lowesti = i
                } else if (fScore[n] == lowestv && this.h(n, b) < this.h(lowesti, b)) {
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
    
            let curr_xy = this.i2xy(curr_i)
            let x = curr_xy.x
            let y = curr_xy.y
    
            let neighbors = {}
            if (x != 0 && map[y][x-1]) {
                // left side
                neighbors.left = this.xy2i(x - 1, y)
            }
            if (y != 0 && map[y-1][x]) {
                // top side
                neighbors.top = this.xy2i(x, y - 1)
            }
            if (x != map[0].length - 1 && map[y][x+1]) {
                // right side
                neighbors.right = this.xy2i(x + 1, y)
            }
            if (y != map.length - 1 && map[y+1][x]) {
                // bottom side
                neighbors.bottom = this.xy2i(x, y + 1)
            }
    
            for (let dir in neighbors) {
                let neighbor_i = neighbors[dir]
                let neighbor_xy = this.i2xy(neighbor_i)
                let tentativeGScore = gScore[curr_i] + map[neighbor_xy.y][neighbor_xy.x]
                if (tentativeGScore < gScore[neighbor_i]) {
                    cameFrom[neighbor_i] = curr_i
                    gScore[neighbor_i] = tentativeGScore
                    fScore[neighbor_i] = gScore[neighbor_i] + this.h(neighbor_i, b)
                    if (!openSet.includes(neighbor_i)) {
                        openSet.push(neighbor_i)
                    }
                }
            }
        }
        return
    }

    copyDim() {
        let copy = []
        for(let r = 0; r < this.height; r++) {
            copy[r] = []
            for(let c = 0; c < this.width; c++) {
                copy[r][c] = 0
            }
        }
        return copy
    }
}