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

        let player = game.addPlayer(socket.id, data.playerName)
        Players[socket.id] = player

        game.setHost(socket.id)

        socket.join(gameID)

        socket.emit("join-success", {gameId: gameID, hostId: game.hostId})
    }) 

    socket.on("play", data => {
        let game = Games[data.gameId]
        if (game) {
            let player = game.addPlayer(socket.id, data.playerName)
            Players[socket.id] = player
            socket.join(data.gameId)
            socket.emit("join-success", {gameId: data.gameId, hostId: game.hostId})
            io.to(game.id).emit("host-update", {hostId: game.hostId})
        } else {
            socket.emit("join-fail")
        }
        
    })

    socket.on("disconnect", data => {

        let player = Players[socket.id]
        if (player) {
            let game = Games[player.gameId]
            game.removePlayer(player.id)
            
            delete Players[socket.id]

            if (!game.active) {
                delete Games[game.id]
            } else {
                io.to(game.id).emit("host-update", {hostId: game.hostId})
            }
        }
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

    socket.on("start", data => {
        let game = Games[data.gameId]
        if (game) {
            game.start()
        }
    })

})

function update() {
    
    for (let gameID in Games) {
        const game = Games[gameID]

        if(game.stateChanged) {

            io.to(gameID).emit(game.onStateChangeClient, game.data)
            game.stateChanged = false

        }

        game.update()

        io.to(gameID).emit("update", game)
    }
    

    Coroutine.step()
}

setInterval(update, 1000/120)

http.listen(port)
console.log("Server: Pong runnning...")

