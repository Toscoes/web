let ID = 0;

exports.Static = 0; // things that don't move at all
exports.Dynamic = 1; // things that move and are obstacles
exports.Passable = 2; // things that move and can be moved though
exports.Trigger = 3; // things that don't move but can detect collision

function id() {
    return ID++; 
};

const fs = require("fs");
const animation = JSON.parse(fs.readFileSync("./src/data/animation.json"));
const entity = JSON.parse(fs.readFileSync("./src/data/entity.json"));

//const Game = require("./game"); can't import because of cyclic importing (game already imports object)
// might add another flag variable to remove items in a loop inside of Game

class Collider {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.color = "green";
    }
}

class Sprite {
    constructor(data) {
        this.atlas = data.spritesheet;
        this.flippedX = false;
        this.flippedY = false;
        this.frameCount = data.count;
        this.frameIndex = 0;
        this.frameWidth = data.width;
        this.frameHeight = data.height;
        this.frameX = data.x;
        this.frameY = data.y;
        this.rate = data.rate;
        this.tick = 0;
        this.rotation = 0;
        this.rotationRate = 0;
        this.compOp = "none"
    }
}

exports.Entity = class {
    constructor(x, y, name) {
        let entityData = entity[name];
        let animationData = animation[entityData.default_animation];
        let hitboxData = entityData.hitbox;

        this.hitboxOffsetX = hitboxData.x;
        this.hitboxOffsetY = hitboxData.y;

        this.x = x;
        this.y = y;
        this.name = name;
        this.id = id();
        this.type = entityData.type;
        this.speed = entityData.speed;
        this.animation = animationData? new Sprite(animationData) : 0;
        this.hitbox = new Collider(x - animationData.width/2 + hitboxData.x, y - animationData.height/2  + hitboxData.y, hitboxData.width, hitboxData.height);
        // colliders don't have to be created if entity is static
        this.colliderHorizontal = new Collider(x + hitboxData.width, y, 0, hitboxData.height);
        this.colliderVertical = new Collider(x, y + hitboxData.height, hitboxData.width, 0);
        this.velocityX = 0;
        this.velocityY = 0;
        this.accelerationX = 0;
        this.accelerationY = 0;
        this.lastDir = 1;
        this.grounded = false;
        this.visible = true;
        this.active = true;
        this.destroyFlag = false;
        this.particlesystem = 0;
        this.lightsource = 0;
    }
    update() {
        // no generic functionality
    }
    onCollision(other) {
        // no generic functionality
    }
    assignId(id) {
        this.id = id;
    }
    translateX(dx) {
        this.hitbox.x += dx;
    }
    translateY(dy) {
        this.hitbox.y += dy;
    }
    getX() {
        return this.hitbox.x;
    }
    getY() {
        return this.hitbox.y;
    }
    setX(x) {
        this.hitbox.x = x;
    }
    setY(y) {
        this.hitbox.y = y;
    }
    accelerateX(ax) {
        this.velocityX += ax;
    }
    accelerateY(ay) {
        this.velocityY += ay;
    }
    setVelocityX(vx) {
        this.velocityX = vx;
    }
    setVelocityY(vy) {
        this.velocityY = vy;
    }
    setAccelerationX(ax) {
        this.accelerationX = ax;
    }
    setAccelerationY(ay) {
        this.accelerationY = ay;
    }
    setAnimation(name) {
        let data = animation[name];
        this.animation.atlas = data.spritesheet;
        this.animation.flipped = false;
        this.animation.frameCount = data.count;
        this.animation.frameIndex = 0;
        this.animation.frameWidth = data.width;
        this.animation.frameHeight = data.height;
        this.animation.frameX = data.x;
        this.animation.frameY = data.y;
        this.animation.rate = data.rate;
    }
    updateColliders() {
        this.colliderHorizontal.width = Math.abs(this.velocityX);
        this.colliderVertical.height = Math.abs(this.velocityY);
        this.colliderHorizontal.y = this.hitbox.y;
        this.colliderVertical.x = this.hitbox.x;
        
        if (this.velocityX > 0) {
            this.colliderHorizontal.x = this.hitbox.x + this.hitbox.width;
        } else if (this.velocityX < 0) {
            // I have no idea why this works
            this.colliderHorizontal.x = this.hitbox.x - this.colliderHorizontal.width;
        } else {
            this.colliderHorizontal.x = this.hitbox.x;
        }

        if (this.velocityY > 0) {
            this.colliderVertical.y = this.hitbox.y + this.hitbox.height;
        } else if (this.velocityY < 0) {
            // I have no idea why this works
            this.colliderVertical.y = this.hitbox.y - this.colliderVertical.height;
        } else {
            this.colliderVertical.y = this.hitbox.y;
        }
    }
    destroy() {
        this.destroyFlag = true;
    }
}

exports.isColliding = function (a, b) {
	return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}