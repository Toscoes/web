const Object = require("./object");
const Player = require("./player");
const Item = require("./item");
const Monster = require("./monster");

exports.DEFAULT_STATE = 1;

module.exports = class Game {
	constructor(id) {
		this.id = 0;
		this.state = DEFAULT_STATE;
		this.entities = [];
		this.players  = [];
		this.gameStateLoop = this.characterSelectLoop();
		this.time = -1;
	}

	changeState(state) {

	}

	addPlayer(player) {
		if (this.players.length >= 4) {
			return false;
		} else {
			if(this.players.length == 0) {
				player.isHost = 1;
			}
			this.players.push(player);
			return true;
		}
	}

	loop() {
		this.objectLoop();
		this.gameStateLoop;
	}

	characterSelectLoop() {

	}

	objectLoop() {
		for (let i in this.entities) {
			let object = this.entities[i];
			object.update();
	
			// update animation
			object.animation.frameIndex = Math.floor(object.animation.tick % object.animation.frameCount);
			object.animation.tick += object.animation.rate;
		}
	}
}