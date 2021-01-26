// imports

// input
const gameCode = document.getElementById("game-code")
const name = document.getElementById("name")

// buttons
const create = document.getElementById("create")
const play = document.getElementById("play")

// screens
const menu = document.getElementById("menu")
const game = document.getElementById("game")

// canvas
const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")

// other
const displayGameCode = document.getElementById("display-game-code")

const socket = io()

let GameData = null

function update() {

}

function draw(time) {
    
    context.fillStyle="white"

    if (GameData.players.player1) {
        const player1Paddle1 = GameData.players.player1.paddle1
        const player1Paddle2 = GameData.players.player1.paddle2
        context.fillRect(player1Paddle1.x, player1Paddle1.y, player1Paddle1.width, player1Paddle1.height)
        context.fillRect(player1Paddle2.x, player1Paddle2.y, player1Paddle2.width, player1Paddle2.height)
    }

    if (GameData.players.player2) {
        const player2Paddle1 = GameData.players.player2.paddle1
        const player2Paddle2 = GameData.players.player2.paddle2
        context.fillRect(player2Paddle1.x, player2Paddle1.y, player2Paddle1.width, player2Paddle1.height)
        context.fillRect(player2Paddle2.x, player2Paddle2.y, player2Paddle2.width, player2Paddle2.height)
    }

    if (GameData.ball) {
        const ball = GameData.ball
        context.fillRect(ball.x, ball.y, ball.size, ball.size)
    }
}


function main(time) {
    context.clearRect(0,0,canvas.width,canvas.height)
    update()
    draw()
    //requestAnimationFrame(main)
}

// ======= listeners ======= //
create.addEventListener("click", event => {
    socket.emit("create", {playerName: name.value})
})

play.addEventListener("click", event => {
    if (gameCode.value != "") {
        socket.emit("play", {playerName: name.value, gameId: gameCode.value})
    }
})

// ======= socket listeners ======= //
socket.on("play", data => {

})

socket.on("update", data => {
    GameData = data
    requestAnimationFrame(main)
})

socket.on("join-success", data => {
    displayGameCode.innerText = "Game Code: " + data.gameId
    setScene("game")
})

// input handlers
function onMouseClick(x, y) {

}

function onMouseMove(x, y) {

}

function onKeyPress(key) {
    socket.emit("keypress", key)
}

function onKeyHold(keys) {
    socket.emit("keyheld", keys)
}

const keysLast = {}
const keysHeld = {}
const Mouse = {
    x: -1,
    y: -1
}
const keyBinds = {
    MOVE_UP: "KeyW",
    MOVE_DOWN: "KeyS",
    STRAFE: "Space"
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

    onKeyHold(keysHeld)

})

document.addEventListener("keyup", event => {
    const key = event.code

    setKeysLast()

    keysHeld[key] = false

    onKeyHold(keysHeld)
})

function isKeyPressed(key) {
    return keysHeld[key] && !keysLast[key]
}

function setKeysLast() {
    for (let key in keysHeld) {
        keysLast[key] = keysHeld[key]; 
    }
}

function setScene(scene) {
    menu.style.display = "none"
    game.style.display = "none"

    if(scene == "menu") {
        menu.style.display = "initial"
    } else if (scene == "game") {
        game.style.display = "initial"
    }
}

window.addEventListener("resize", resize)
function resize() {
    canvas.width = canvas.clientWidth * window.devicePixelRatio
    canvas.height = canvas.clientHeight * window.devicePixelRatio

    context.canvas.width = 1600
    context.canvas.height = 1200

    context.imageSmoothingEnabled = false;
}
resize()