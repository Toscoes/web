const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")

const scoreText = document.getElementById("score")

const Global = {
    StartingX: 100,
    PlayerSize: 50,
    GameWidth: 1200,
    GameHeight: 600,
    ObstacleSize: 50,
    Gravity: 1.2,
    MaxObstacleDistance: 500
}

const Player = {
    x: Global.StartingX,
    y: 0,
    dy: 0,
    speed: 10,
    jump: -15,
    grounded: false,
    hovering: false,
    hoverDuration: 0,
    maxHoverDuration: 50
}

let distance = 0
let score = 0

let obstacles = []
let nextObstacle = Math.random() * Global.ObstacleSize 

function update() {

    Player.dy += Global.Gravity 
    if (Player.y + Global.PlayerSize + Player.dy > Global.GameHeight) {
        Player.y = Global.GameHeight - Global.PlayerSize
        Player.dy = 0
        Player.grounded = true
        Player.hoverDuration = Player.maxHoverDuration
    } else {
        Player.grounded = false
        
    }

    if (keysHeld["Space"] && Player.hovering && Player.hoverDuration > 0) {
        Player.dy = 0
        Player.hoverDuration--
    } else {
        Player.hovering = false
    }

    Player.y += Player.dy

    distance += Player.speed

    scoreText.innerText = distance

    if (nextObstacle < distance) {
        createObstacle()
    }

    for (let i = 0; i < obstacles.length; i++) {
        let ob = obstacles[i]
        ob.x -= Player.speed

        if (Player.x < ob.x + Global.ObstacleSize && Player.y < ob.y + Global.ObstacleSize && Player.x + Global.PlayerSize > ob.x && Player.y + Global.PlayerSize > ob.y) {
            restart()
            break
        }
    }

    if (obstacles[0] && obstacles[0].x < -100) {
        obstacles.shift()
    }

}

function draw() {
    context.fillStyle = "white"
    context.fillRect(Global.StartingX, Player.y, Global.PlayerSize, Global.PlayerSize)

    obstacles.forEach( ob => {
        context.fillRect(ob.x, ob.y, Global.ObstacleSize, Global.ObstacleSize)
    })
}

function main(time) {
    context.clearRect(0,0,context.canvas.width,context.canvas.height)
    update()
    draw()
    requestAnimationFrame(main)
}
requestAnimationFrame(main)

// input handlers
function onMouseClick(x, y) {

}

function onMouseMove(x, y) {

}

function restart() {
    nextObstacle = Math.random() * Global.ObstacleSize + Global.MaxObstacleDistance
    distance = 0
    obstacles = []
}

function createObstacle() {
    obstacles.push({
        x: Global.GameWidth + Global.ObstacleSize,
        y: Global.GameHeight - Global.ObstacleSize,
        dx: 0,
        dy: 0
    })
    nextObstacle += Math.random() * Global.ObstacleSize + Global.MaxObstacleDistance
}

function onKeyPress(key) {
    if (key == "Space") {
        if (Player.grounded) {
            Player.dy = Player.jump
        } else {
            Player.hovering = true
        }
    }
}

const keysLast = {}
const keysHeld = {}
const Mouse = {
    x: -1,
    y: -1
}

document.addEventListener("mousemove", event => {
    Mouse.x = event.clientX
    Mouse.y = event.clientY
    onMouseMove(Mouse.x, Mouse.y)
})

document.addEventListener("click", event => {
    onMouseClick(Mouse.x, Mouse.y)
})

document.addEventListener("keydown", event => {
    const key = event.code

    setKeysLast()

    keysHeld[key] = true

    if (isKeyPressed(key)) {
        onKeyPress(key)
    }

})

document.addEventListener("keyup", event => {
    const key = event.code

    setKeysLast()

    keysHeld[key] = false
})

function isKeyPressed(key) {
    return keysHeld[key] && !keysLast[key]
}

function setKeysLast() {
    for (let key in keysHeld) {
        keysLast[key] = keysHeld[key]; 
    }
}

window.addEventListener("resize", resize)
function resize() {
    canvas.width = canvas.clientWidth * window.devicePixelRatio
    canvas.height = canvas.clientHeight * window.devicePixelRatio

    context.canvas.width = Global.GameWidth
    context.canvas.height = Global.GameHeight

    context.imageSmoothingEnabled = false
}
resize()