// imports
import Coroutine from "./coroutine.js"

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
const start = document.getElementById("start")
const waitingHost = document.getElementById("waiting-host")
const winner = document.getElementById("winner")

const player1Name = document.querySelector("#player1 > .name")
const player1Score = document.querySelector("#player1 > .score")
const player2Name = document.querySelector("#player2 > .name")
const player2Score = document.querySelector("#player2 > .score")

const socket = io()

let GameData = null

function update() {
    Coroutine.step()
}

function draw(time) {
    
    context.fillStyle="white"

    const player1 = GameData.players.player1
    const player2 = GameData.players.player2
    const ball = GameData.ball

    if (player1) {
        const player1Paddle1 = player1.paddle1
        const player1Paddle2 = player1.paddle2
        context.fillRect(player1Paddle1.x, player1Paddle1.y, player1Paddle1.width, player1Paddle1.height)
        context.fillRect(player1Paddle2.x, player1Paddle2.y, player1Paddle2.width, player1Paddle2.height)
    }

    if (player2) {
        const player2Paddle1 = player2.paddle1
        const player2Paddle2 = player2.paddle2
        context.fillRect(player2Paddle1.x, player2Paddle1.y, player2Paddle1.width, player2Paddle1.height)
        context.fillRect(player2Paddle2.x, player2Paddle2.y, player2Paddle2.width, player2Paddle2.height)
    }

    if (ball) {
        context.fillRect(ball.x, ball.y, ball.size, ball.size)
    }

    player1Name.innerText = player1? player1.name : "Waiting for player..."
    player1Score.innerText = player1? GameData.scorePlayer1 : ""
    player2Name.innerText = player2? player2.name : "Waiting for player..."
    player2Score.innerText = player2? GameData.scorePlayer2 : ""


}


function main(time) {
    context.clearRect(0,0,canvas.width,canvas.height)
    update()
    draw()
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

socket.on("state-waiting", data => {
    winner.style.display = "initial"
    winner.innerText = ""
    if (GameData.hostId == socket.id) {
        start.style.display = "initial"
    } else {
        waitingHost.style.display = "initial"
    }
})

socket.on("state-displaymessage", data => {
    winner.style.display = "initial"
    let messenger = function* (msg) {
        let part = ""
        let i = 0
        while (part != msg) {
            part += msg[i]
            winner.innerText = part
            yield i++
        }
    }
    let generator = messenger(data.message)
    Coroutine.start(generator)
})

socket.on("state-loading", data => {
    start.style.display = "none"
    waitingHost.style.display = "none"
})

socket.on("update", data => {
    GameData = data
    requestAnimationFrame(main)
})

socket.on("join-success", data => {
    displayGameCode.innerText = "Game Code: " + data.gameId
    setScene("game")
})

socket.on("join-fail", () => {
    alert("This game does not exist!")
})

socket.on("host-update", data => {
    if (data.hostId == socket.id) {
        waitingHost.style.display = "none"
        start.style.display = "initial"
        start.querySelector("button").onclick = event => {
            if (GameData.players.player1 && GameData.players.player2) {
                socket.emit("start", {gameId: GameData.id})
            } else {
                alert("Not enough players!")
            }
        }
    } else {
        waitingHost.style.display = "initial"
    }
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