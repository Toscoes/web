const express = require("express")
const app = express()
const http = require("http").createServer(app)
const port = process.env.PORT || 8000
const io = require("socket.io")(http)

const Player = require("./modules/player")
const Game = require("./modules/game")
const utils = require("./modules/utils")

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})
app.use("/", express.static(__dirname + "/public"))

const GAMES = {}

io.on("connection", socket => {

    socket.on("play", data => {
        let code = data.code
        if (GAMES[code]) {  
            let game = GAMES[code]
            game.addPlayer(new Player(socket.id, data.name))

            socket.emit("join", {game: game} )
        } else {
            socket.emit("play_error", "does_not_exist")
        }
    })

    socket.on("create", data => {
        let code = utils.generateRandomId(4)
        while (GAMES[code]) {
            code = utils.generateRandomId(4)
        }
        let game = new Game(code)
        game.addPlayer(new Player(socket.id, data.name))

        GAMES[code] = game

        socket.emit("join", {id: socket.id, game: game} )
        socket.emit("update", game)
    })
})

function update() {
    for(let id in GAMES) {
        let game = GAMES[id]
    }
}

setInterval(update, 1000)

http.listen(port)


