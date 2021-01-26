const Object = require("../object");

module.exports = class Arrow extends Object.Entity {
    constructor(x,y,name) {
        super(x,y,"arrow");
        this.type = "ARROW";
    }
    update() {
        let rads = Math.atan(this.velocityY / this.velocityX)
        let angle = (rads / Math.PI) * 180
        if(this.velocityX < 0) {
            angle += 180
        } else if (this.velocityX > 0 && this.velocityY < 0) {
            angle += 360
        }
        this.setRotation(angle);
    }

    onCollision(other) {
        this.destroy();
    }
}