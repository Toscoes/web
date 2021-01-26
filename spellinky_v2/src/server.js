const express = require("express");
const app = express();
const serv = require("http").Server(app);

app.get('/',function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.use('/',express.static(__dirname));
 
serv.listen(process.env.PORT || 6969);
console.log("Server started: Spellinky v2");

const io = require('socket.io')(serv,{}); 

const Player = require("./modules/player");
const Game = require("./modules/game");
const USER_LIST = {};
const GAME_LIST = {};

io.sockets.on('connection', function(socket) {
	
	console.log("User connected (ID: " + socket.id + ")");

	let player = new Player(socket.id);
	USER_LIST[socket.id] = player;

	socket.on("gameConnect", function(data) {
		let player = USER_LIST[socket.id];
		let username = data.username;
		player.setUsername(username);
		let gameId = data.gameId;
		let game = GAME_LIST[gameId];

		if(game) {
			game.addPlayer(player);
		} else {

		}
	});

	socket.on("gameCreate", function(data) {
		let id = generateId(); // create id
		let game = new Game(id); // make new game with id
		GAME_LIST[id] = game; // add game to object with reference to it via id
		let player = USER_LIST[socket.id]; // get the player
		game.addPlayer(player); // add player to game player list
	});

	socket.on("gameDisconnect", function() {

	});

    socket.on("disconnect", function() {
		console.log("User disconnected (ID: " + socket.id + ")");
		delete USER_LIST[socket.id];
	});

	socket.on("keyPress", function(data) {
		let player = USER_LIST[socket.id];
		if (player) {
			player.handleKeyPressed(data.input);
		}
	});

	socket.on("keyHeld", function(data) {
		let player = USER_LIST[socket.id];
		if (player) {
			player.handleKeysHeld(data.inputs);
		}
	});

	socket.on("mouseClicked", function(data) {
		let player = USER_LIST[socket.id];
		if (player) {
			player.handleMouseClicked(data);
		}
	});
});
 
setInterval(update,1000/60);

function update() {
	for (let i in GAME_LIST) {
		let game = GAME_LIST[i];
		game.loop();
		for(let u in game.players) {
			let player = USER_LIST[u];
			if(player) {
				let data = {
					objectData: game.entities,
					playerData: game.players,
					clientData: player
				};
				io.to(player.id).emit("update", data);
			}
		}
	}
}

function generateId() {
	let length = 4; 
	let result = "";
	let characters = "abcdefghijklmnopqrstuvwxyz0123456789";
	let charactersLength = characters.length;
	let unique = false;

	while (!unique) {
		for (let i=0; i<length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		 }
		 for (let i in GAME_LIST) {
			 let game = GAME_LIST[i];
			 if(game.id == result) {
				 break;
			 }
			 unique = true;
		 }
	}
	return result;
}

function sendErrorMessage(socketId, msg) {
	io.to(socketId).emit("error", msg);
}
