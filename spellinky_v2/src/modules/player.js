const fs = require("fs");
const Object = require("./object");
const Item = require("./item");
const Input = JSON.parse(fs.readFileSync("./src/data/input.json"));

module.exports = class Player {
    constructor(socketId) {
		this.id = socketId;
		this.gameId = 0;
		this.username = "";
		this.character = null;
		this.isHost = 0;
	}

	setUsername(username) {
		this.username = username;
	}
 
	handleMouseClicked(point) {

	}

	// handle individual key presses
    handleKeyPressed(key) {

	}

	// handle keys held down
	handleKeysHeld(keys) {

	}
}
