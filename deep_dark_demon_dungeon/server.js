// apparently setX() and setY() of Entity is reversed
// well fuck you computer because i can work around it
// and you are fucking stupid for not working

const express = require("express")
const app = express()
const http = require("http").createServer(app)
const port = process.env.PORT || 8000
const io = require('socket.io')(http)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
});
app.use('/',express.static(__dirname + "/public"))
http.listen(port)

const Player = require("./modules/player")
const Game = require("./modules/game")

const USER_LIST = {}

Game.init()

io.on('connection', socket => {
	// create new Player instance
	let player = new Player(socket.id, "Tosco")

	// add Player instance to user list
	USER_LIST[socket.id] = player

	// add Player's character to object list
	Game.Entities.push(player)

	socket.emit("ClientUpdate", player)

    socket.on("disconnect", function() {
		// set player character to inactive
		delete USER_LIST[socket.id];
	});

	socket.on("keyPress", function(key) {
		let player = USER_LIST[socket.id]
		if (player) {
			player.handleKeyPressed(key)
			socket.emit("ClientUpdate", player)
		}
	});

	socket.on("keyHeld", function(keys) {
		let player = USER_LIST[socket.id]
		if (player) {
			player.handleKeysHeld(keys)
		}
	});

	socket.on("moveItem", function(data) {
		let player = USER_LIST[socket.id]
		if (player) {
			player.moveItem(data.from, data.to)
			socket.emit("ClientUpdate", player)
		}
	}); 

	socket.on("dropItem", function(index) {
		let player = USER_LIST[socket.id]
		if (player) {
			player.dropItem(index)
			socket.emit("ClientUpdate", player)
		}
	});

	socket.on("mouseClicked", function(data) {
		let player = USER_LIST[socket.id]
		if (player) {
			player.handleMouseClicked(data)
		}
	});
});
 
setInterval(update,1000/60);

function update() {

	let data = []

	Game.update()

	// can sort which objects to send based on what player can see
	Game.Entities.forEach(object => {
		if(object.visible) {
			data.push(object)
		}
	})

	io.emit("update", data)
}
