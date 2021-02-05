import { Level } from "./level.js"
import { Tile } from "./tile.js"
import { Coroutine } from "./coroutine.js"

const canvas = document.getElementById("main-canvas")
const context = canvas.getContext("2d")
context.fillStyle = "#010101"

const renderer = document.getElementById("renderer")
const ctx = renderer.getContext("2d")
ctx.fillStyle = "rgba(0, 0, 0, 0.4)"

class Player {
    constructor(x,y) {
        this.x = x   
        this.y = y
        this.screenX = this.x * Tile.Dimension
        this.screenY = this.y * Tile.Dimension
    }
}

let player = 0
let reveal = false
let ready = false
let hasKeyBoardControl = true
let level = 0
let map = 0
let SpriteData = 0
let viewDistance = 12
let dir = 1
let lastDir = 1
let flippedX = 0
let flippedY = 0

let view = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    halfWidth: 0,
    halfHeight: 0
}

const sheet = new Image()
sheet.src = "./assets/tileset1.png"

let req = new XMLHttpRequest()
req.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        let data = JSON.parse(this.response)
        SpriteData = data.sprites

        level = new Level(data, 60, 10)
        map = level.map

        player = new Player(level.start.x, level.start.y)

        view.x = player.screenX
        view.y = player.screenY
        
        getVisibility(player.x, player.y, viewDistance, map)

        ready = true
    }
}
req.open("GET", "./data/level1.json", true)
req.send()

function update() {
    if (ready) {
        view.x = player.screenX
        view.y = player.screenY
    }
}

function draw() {
    if (ready) {

        for (let y = 0; y < level.height; y++) {

            if (player.y - y > view.halfHeight / Tile.Dimension || player.y - y < -view.halfHeight / Tile.Dimension) {
                continue;
            }

            for (let x = 0; x < level.width; x++) {

                if (player.x - x > view.halfWidth / Tile.Dimension || player.x - x < -view.halfWidth / Tile.Dimension) {
                    continue;
                }

                let screenX = x * Tile.Dimension
                let screenY = y * Tile.Dimension
                let drawX = (screenX - view.x) + view.halfWidth - Tile.HalfDimension
                let drawY = (screenY - view.y) + view.halfHeight - Tile.HalfDimension

                if (map[y][x]) {
                    let tile = map[y][x]
                    let sprite = SpriteData[tile.sprite]
                    
                    if (tile.visibility == Tile.Visible || reveal) {

                        // normal
                        context.drawImage(sheet, sprite.x, sprite.y, sprite.width, sprite.height, drawX, drawY, Tile.Dimension, Tile.Dimension)

                    } else if (tile.visibility == Tile.Seen) {

                        // darkened
                        ctx.drawImage(sheet, sprite.x, sprite.y, sprite.width, sprite.height, 0, 0, Tile.Dimension, Tile.Dimension)
                    
                        ctx.fillRect(0,0,Tile.Dimension,Tile.Dimension)

                        context.drawImage(renderer, 0, 0, sprite.width, sprite.height, drawX, drawY, Tile.Dimension, Tile.Dimension)
                    }
                }
            }
        }

        let drawX = (player.screenX - view.x) + view.halfWidth - Tile.HalfDimension
        let drawY = (player.screenY - view.y) + view.halfHeight - Tile.HalfDimension

        /* produces the skybox bleeding effect (might want to set transform for all sprites drawn - might also be too slow)
        // could opt for mirroring sprites
        context.setTransform(
            flippedX? -1 : 1,
            0,0,
            flippedY? -1 : 1,
            drawX + Tile.HalfDimension, 
            drawY + Tile.HalfDimension
        ); 
        */

        context.drawImage(sheet, 32, 0, 16, 16, drawX, drawY, Tile.Dimension, Tile.Dimension)

    }
}

document.addEventListener("keydown", e => {
    if (ready && hasKeyBoardControl) {
        if (e.key == "w") {
            if (map[player.y-1][player.x].type != Tile.Blocked) {
                player.y--

                let transition = function* (player) {
                    let sy = player.y * Tile.Dimension
                    while(player.screenY != sy) {
                        yield player.screenY -= 4
                    }
                    hasKeyBoardControl = true
                }
                let transitionCoroutine = transition(player)
                Coroutine.start(transitionCoroutine)
                hasKeyBoardControl = false
            }
        }
        if (e.key == "a") {
            if (map[player.y][player.x-1].type != Tile.Blocked) {
                player.x--
                dir = -1
                if (dir != lastDir) {
                    lastDir = dir
                    flippedX = true
                }

                let transition = function* (player) {
                    let sx = player.x * Tile.Dimension
                    while(player.screenX != sx) {
                        yield player.screenX -= 4
                    }
                    hasKeyBoardControl = true
                }
                let transitionCoroutine = transition(player)
                Coroutine.start(transitionCoroutine)
                hasKeyBoardControl = false
            }
        }
        if (e.key == "s") {
            if (map[player.y+1][player.x].type != Tile.Blocked) {
                player.y++
            }

            let transition = function* (player) {
                let sy = player.y * Tile.Dimension
                while(player.screenY != sy) {
                    yield player.screenY += 4
                }
                hasKeyBoardControl = true
            }
            let transitionCoroutine = transition(player)
            Coroutine.start(transitionCoroutine)
            hasKeyBoardControl = false
        }
        if (e.key == "d") {
            if (map[player.y][player.x+1].type != Tile.Blocked) {
                player.x++
                dir = 1
                if (dir != lastDir) {
                    lastDir = dir
                    flippedX = false
                }

                let transition = function* (player) {
                    let sx = player.x * Tile.Dimension
                    while(player.screenX != sx) {
                        yield player.screenX += 4
                    }
                    hasKeyBoardControl = true
                }
                let transitionCoroutine = transition(player)
                Coroutine.start(transitionCoroutine)
                hasKeyBoardControl = false
            }
        }
        if (e.key == "p") {
            reveal = !reveal
        }
        getVisibility(player.x, player.y, viewDistance, map)
        //processChaser()
    }
})

function processChaser() {
    // should process their own internal nav map
/*
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
    */
}

function main() {

    context.clearRect(0,0,canvas.width,canvas.height)
    ctx.clearRect(0,0,renderer.width,renderer.height)

    Coroutine.step()
    update()
    draw()

    requestAnimationFrame(main)
}
main()

let zoom = 4
const maxZoom = 8
window.addEventListener("resize", resize)
function resize() {
    canvas.width = canvas.clientWidth * window.devicePixelRatio
    canvas.height = canvas.clientHeight * window.devicePixelRatio

    context.canvas.width = canvas.width/zoom
    context.canvas.height = canvas.height/zoom

    view.width = context.canvas.width % 2 == 1? context.canvas.width + 1 : context.canvas.width
    view.height = context.canvas.height % 2? context.canvas.height + 1 : context.canvas.height

    view.halfWidth = view.width/2
    view.halfHeight = view.height/2
}
resize()

function getVisibility(xo, yo, distance, map) {

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
            if(map[y][x]) {
                map[y][x].visibility = map[y][x].visibility == Tile.Visible || map[y][x].visibility == Tile.Seen? Tile.Seen : 0
            }
        }
    }

    for (let y = yo - distance; y < yo + distance; y++) {
        for (let x = xo - distance; x < xo + distance; x++) {
            line(xo,yo,x,y,map)
        }
    }
}

function line(x1,y1,x2,y2,map) {
    let rise = y2 - y1
    let run = x2 - x1
    if (run == 0) {
        if (y2 < y1) {
            for (let y = y1; y > y2 - 1; y--) {

                map[y][x1].visibility = Tile.Visible

                if (!map[y][x1].transparent) {
                    break
                }
            }
        } else {
            for (let y = y1; y < y2 + 1; y++) {

                map[y][x1].visibility = Tile.Visible

                if (!map[y][x1].transparent) {
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

                    map[y][x].visibility = Tile.Visible

                    if (!map[y][x].transparent) {
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

                    map[y][x].visibility = Tile.Visible

                    if (!map[y][x].transparent) {
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

                    map[y][x].visibility = Tile.Visible

                    if (!map[y][x].transparent) {
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

                    map[y][x].visibility = Tile.Visible

                    if (!map[y][x].transparent) {
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