const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")

const Spaceship1 = new Image()
Spaceship1.src = "spaceship1.png"

const HalfPi = Math.PI / 180
const Half360 = 180 / Math.PI
const TwoPi = Math.PI * 2
const PlayerRadius = 8

const deg2Rad = degrees => HalfPi * degrees
const rad2Deg = radians => radians * Half360
const degrees2Points = (x1,y1,x2,y2) => rad2Deg(Math.atan2(y2- y1, x2 - x1))
const radians2Points = (x1,y1,x2,y2) => Math.atan2(y2- y1, x2 - x1);


const Global = {
    GameWidth: 900,
    GameHeight: 450,
    Epsilon: 0.01,
    Deg90: deg2Rad(-90),
    PlayRadius: 450
}

const Player = {
    x: Global.GameWidth/2,
    y: Global.GameHeight/2,
    dx: 0,
    dy: 0,
    dr: 0,
    maxSpeed: .05,
    halfSpeed: .01,
    rot: deg2Rad(-90),
    rotationSpeed: deg2Rad(0.5),
    rotating: false,
    accelerating: false
}

const View = {
    x: 0,
    y: 0,
}

const Rocks = []
const Projectiles = []

function update() {

    Player.rotating = false
    Player.accelerating = false

    if (keysHeld["KeyZ"]) {
        Player.dr -= Player.rotationSpeed
        Player.rotating = true
    }
    if (keysHeld["KeyX"]) {
        Player.dr += Player.rotationSpeed
        Player.rotating = true
    }
    if (keysHeld["ArrowRight"]) {
        Player.dx += Math.cos(Player.rot - Global.Deg90) * Player.halfSpeed
        Player.dy += Math.sin(Player.rot - Global.Deg90) * Player.halfSpeed
        Player.accelerating = true
    }
    if (keysHeld["ArrowLeft"]) {
        Player.dx += Math.cos(Player.rot + Global.Deg90) * Player.halfSpeed
        Player.dy += Math.sin(Player.rot + Global.Deg90) * Player.halfSpeed
        Player.accelerating = true
    }
    if (keysHeld["ArrowUp"]) {
        Player.dx += Math.cos(Player.rot) * Player.maxSpeed
        Player.dy += Math.sin(Player.rot) * Player.maxSpeed
        Player.accelerating = true
    }
    if (keysHeld["ArrowDown"]) {
        
    }

    Player.x += Player.dx
    Player.y += Player.dy
    Player.rot += Player.dr

    View.x = Player.x
    View.y = Player.y

    if (!Player.rotating) {
        Player.dr *= Math.abs(Player.dr) > Global.Epsilon? 0.98 : 0
    }

    if (!Player.accelerating) {
        Player.dx *= Math.abs(Player.dx) > Global.Epsilon? 0.98 : 0
        Player.dy *= Math.abs(Player.dy) > Global.Epsilon? 0.98 : 0
    }

    if (Math.pow(Player.x, 2) + Math.pow(Player.y, 2) > Math.pow(Global.PlayRadius, 2)) {
        Player.x = 0
        Player.y = 0
    }

    Projectiles.forEach(projectile => {
        projectile.x += projectile.dx
        projectile.y += projectile.dy

        if (Math.pow(projectile.x, 2) + Math.pow(projectile.y, 2) > Math.pow(Global.PlayRadius, 2)) {
            projectile.active = false
        }
    })



}

function draw() {

    context.setTransform(1,0,0,1,Player.x - View.x + Global.GameWidth/2,Player.y - View.y + Global.GameHeight/2)
    context.rotate(Player.rot)
    context.drawImage(Spaceship1,-8,-8)
    context.strokeStyle = "green"
    context.beginPath()
    context.arc(0, 0, PlayerRadius, 0, TwoPi)
    context.stroke()

    context.setTransform(1,0,0,1, -View.x, -View.y )
    context.beginPath()
    context.arc(Global.GameWidth/2, Global.GameHeight/2, Global.PlayRadius, 0, TwoPi)
    context.stroke()


    Projectiles.forEach(projectile => {
        if (projectile.active) {
            context.setTransform(1,0,0,1, projectile.x-View.x + Global.GameWidth/2, projectile.y-View.y + Global.GameHeight/2)
            context.fillStyle = "white"
            context.beginPath()
            context.arc(0, 0, 2, 0, TwoPi)
            context.fill()
        }
    })
}

function main(time) {
    context.resetTransform()
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

function onKeyPress(key) {
    if (key == "Space") {
        Projectiles.push({
            x: Player.x,
            y: Player.y,
            dx: Math.cos(Player.rot) * 20,
            dy: Math.sin(Player.rot) * 20,
            active: true
        })
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