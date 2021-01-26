const Object = require("./object")
const Item = require("./item")
const Arrow = require("./behavior/arrow")
const Game = require("./game")

const INVENTORY_SIZE = 36

module.exports = class Player extends Object.Entity { 
    constructor(socketId, name) {
		super(0,-32,"player")
        this.id = socketId
		this.name = name
		this.inventory = []
	}
	
	getInventoryLoad() {
		let load = 0;
		for (let i = 0; i < INVENTORY_SIZE; i++) {
			if(this.inventory[i]) {
				load++;
			}
		}
		return load;
	}

	insertItem(item) {
		for (let i = 0; i < INVENTORY_SIZE; i++) {
			if(!this.inventory[i]) {
				this.inventory[i] = item;
				break;
			}
		}
	}

	addItem(itemname) {
		if(this.getInventoryLoad() < INVENTORY_SIZE) {
			// if player inventory not is full
			let item = new Item(itemname);
			item.visible = false;
			Game.Entities[item.id] = item;
			this.insertItem(item);
		}
	}

	pickupItem(item) {
		if(this.getInventoryLoad() < INVENTORY_SIZE) {
			item.visible = false
			this.insertItem(item)
		}
	}

	moveItem(from, to) {
		let a = this.inventory[from];
		let b = this.inventory[to];
		this.inventory[from] = b;
		this.inventory[to] = a;
	}

	dropItem(index) {
		// get item from index, index from entities, set x and y, set visible, 'remove' from inventory
		let item = Game.Entities[index]
		item.setX(this.getX())
		item.setY(this.getY())
		item.visible = true
		this.inventory[index] = undefined
	}
	
	handleMouseClicked(point) {
		// point contains x and y coordinates in world space
		
		// firing arrows
		let dx = point.x - this.x;
		let dy = point.y - this.y;

		let angle = 0;

		// little bit bulky, could probably use different trig equations, but this is what came to mind...
		if (dx == 0) {
			angle = (dy < 0)? 90 : 270;
		} else {
			let rads = Math.atan(dy / dx);
			angle = (rads / Math.PI) * 180;
			if(dx < 0) {
				angle += 180;
			} else if (dx > 0 && dy < 0) {
				angle += 360;
			}
		}

		let rads = (angle / 180) * Math.PI;
		let radius = 6; // arbitrary value to offset spawn of arrow around player
		let x = this.x + (Math.cos(rads) * radius);
		let y = this.y + (Math.sin(rads) * radius);
		
		let arrow = new Arrow(x,y);
		let speed = 6;
		arrow.velocityX = Math.cos(rads) * speed;
		arrow.velocityY = Math.sin(rads) * speed;
		arrow.rotate(angle);
		Game.Entities.push(arrow);

	}

	// handle individual key presses
    handleKeyPressed(key) {
		if (key == "KeyQ") {
			Game.Entities.forEach( object => {
				if (object.type == "ITEM" && object.visible && Object.isColliding(this.hitbox, object.hitbox)) {
					this.pickupItem(object)
				}
			})
		}
	}

	// handle keys held down
	handleKeysHeld(keys) {
		if((keys["KeyW"] || keys["Space"]) && this.grounded) {
			// jump of -5 is too weak for g of 0.98
			// jump of -3 is weird for g of 0.21
			this.velocityY = -4;
		}
		if(keys["KeyA"]) {
			this.lastDir = -1
			this.animation.flippedX = true
			this.velocityX = -2
			this.setAnimation("character1_run")
		} else if (keys["KeyD"]) {
			this.lastDir = 1
			this.animation.flippedX = false
			this.velocityX = 2
			this.setAnimation("character1_run")
		} else {
			this.velocityX = 0
			this.setAnimation("character1_idle")
		}
	}
}
