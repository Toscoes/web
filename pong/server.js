const express = require("express")
const app = express()
const http = require("http").createServer(app)
const io = require("socket.io")(http)
const port = process.env.PORT || 8000

const utils = require("./modules/utils")
const Game = require("./modules/game")
const Player = require("./modules/player")
const Coroutine = require("./modules/coroutine")

let Games = {}
let Players = {}

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})
app.use("/", express.static(__dirname + "/public"))

io.on("connection", (socket) => {

    socket.on("create", data => {
        let gameID = utils.generateRandomId(4)
        while (Games[gameID]) {
            gameID = utils.generateRandomId(4)
        }
        let game = new Game(gameID)
        Games[gameID] = game

        let player = game.addPlayer(data.playerName)
        Players[socket.id] = player

        game.start()

        socket.join(gameID)

        socket.emit("join-success", {gameId: gameID})
    }) 

    socket.on("play", data => {
        let game = Games[data.gameId]
        if (game) {
            let player = game.addPlayer(data.playerName)
            Players[socket.id] = player
            socket.join(data.gameId)
            socket.emit("join-success", {gameId: gameID})
        }
        
    })

    socket.on("disconnect", data => {

    })

    socket.on("keyheld", keys => {
        let player = Players[socket.id]
        if (player && player.role != "spectator") {
            player.onKeyHeld(keys)
        }
    })

    socket.on("keypress", key => {
        let player = Players[socket.id]
        if (player && player.role != "spectator") {
            player.onKeyPress(key)
        }
    })

})

function update() {
    
    for (let gameID in Games) {
        const game = Games[gameID]

        game.update()

        io.to(gameID).emit("update", game)
    }
    

    Coroutine.step()
}

setInterval(update, 1000/120)

http.listen(port)
console.log("Server: Pong runnning...")

