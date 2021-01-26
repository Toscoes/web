const Object = require("./object");
const Player = require("./player");
const Item = require("./item");
const Monster = require("./monster");

exports.Entities = [] 

exports.init = function() {
	// test objects
	for(let i = -9; i < 10; i++) {
		this.Entities.push(new Object.Entity(i * 16, 16, "empty"))
	}

	for(let i = 0; i < 5; i++) {
		this.Entities.push(new Object.Entity(-9 * 16, -i * 16, "empty"))
	}

	for(let i = 0; i < 5; i++) {
		this.Entities.push(new Object.Entity(9 * 16, -i * 16, "empty"))
	}

	this.Entities.push(new Item(-23,-57,"stick"))
	this.Entities.push(new Item(0,0,"leaf"))
	this.Entities.push(new Monster(16,-16,"afroshroom"))

	// APPARENTLY FUNGRAL IS CURSED OR SOMETHING? WHAT THE IS GOOD WITH YOU????
	// WHY DON'T YOU WORK???
	// I AM IRREVOCABLY SO UPSET THAT I REALLY WISH I COULD MANIFEST A PHYSICAL ENTITY OF THIS PROGRAM TO LAUNCH IT TO THE MOON
	// BUT I WIN. HAHA YOU LOSE, NOT EVEN THE MOST UNFAIR BUGS CAN STOP ME FOOL!!!!!

	// PART 2: AHAHA IT GETS BETTER. I REMOVED SOME CODE FROM CLIENT THAT WAS DRAWING THE FUNGRAL IN A PARTICULAR FASHION,
	// SO NOW IT IS WORKING LIKE THE REST. THAT DOESN't EXCUSE THE TIME I WASTED WALKING IN A CIRCLE. HAHAHA
	//let monster_cursed = new Monster(64,-32,"fungral");
	//this.Entities[monster_cursed.id] = monster_cursed;

	//let monster1 = new Monster(64,8,"fungral");
	//this.Entities[monster1.id] = monster1;
},

exports.update = function() {

	for(let i = 0; i < this.Entities.length; i++) {
		if(this.Entities[i].destroyFlag) {
			this.Entities.splice(i, 1)
			i--
		}
		
	}

	this.Entities.forEach(object => {

		object.update();

		if(object.type != Object.Static && object.active) {
			//if object is affected by physics

			// apply gravity
			object.velocityY += 0.21;

			// update collider 
			object.updateColliders();

			let groundedCheck = false;
			let genericCollision = false;

			// collision detection
			for (let j in this.Entities) {
				let other = this.Entities[j];

				// test horizontal collisions
				if(Object.isColliding(object.colliderHorizontal, other.hitbox) && other.type < Object.Passable) {
					if(object.velocityX < 0) { // LEFT
						object.hitbox.x = other.hitbox.x + other.hitbox.width;
					}
					if(object.velocityX > 0) { // RIGHT
						object.hitbox.x = other.hitbox.x - object.hitbox.width;
					} 
					object.x = object.hitbox.x - object.hitboxOffsetX + object.animation.frameWidth/2;
					object.velocityX = 0;

					genericCollision = true;
				}

				// test vertical collisions
				if((Object.isColliding(object.colliderVertical, other.hitbox) && other.type < Object.Passable)) {
					if(object.velocityY < 0) { // UP
						object.hitbox.y = other.hitbox.y + other.hitbox.height;
					}
					if(object.velocityY > 0) { // DOWN
						object.hitbox.y = other.hitbox.y - object.hitbox.height;
						groundedCheck = true;
					}
					object.y = object.hitbox.y - object.hitboxOffsetY + object.animation.frameHeight/2;
					object.velocityY = 0;

					genericCollision = true;
				}

				// do i want to register multiple possible collisions?
				if(genericCollision) object.onCollision(other);
			}

			object.grounded = groundedCheck;

			// translate object's hitbox after collision detections
			object.translateX(object.velocityX);
			object.translateY(object.velocityY);

			object.x += object.velocityX;
			object.y += object.velocityY;
		}

		// update animation
		object.animation.frameIndex = Math.floor(object.animation.tick % object.animation.frameCount);
		object.animation.tick += object.animation.rate;
	})
}