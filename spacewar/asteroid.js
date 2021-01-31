import GameObject from "./gameobject.js"
import Projectile from "./projectile.js"
import Global from "./global.js"

export default class Asteroid extends GameObject {
    constructor(x,y,sprite,size,hitpoints) {
        super(x,y,sprite,size)
        this.dx = (Math.random() * 2) - 1
        this.dy = (Math.random() * 2) - 1
        this.dr = Global.deg2Rad((Math.random() * 4) - 2)
        this.size = size
        this.hitpoints = hitpoints
    }

    update() {
        this.x += this.dx
        this.y += this.dy
        this.rot += this.dr

        this.collider.translate(this.dx, this.dy)

        if (this.hitpoints == 0) {
            this.active = false
        }
    }

    onCollision(other) {
        if (other instanceof Projectile) {

        }
    }
}