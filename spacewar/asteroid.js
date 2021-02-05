import GameObject from "./gameobject.js"
import Projectile from "./projectile.js"
import Global from "./global.js"

const calculateHitPoints = size => ((size - 1) * 2) + 1
const limDr = 10

export default class Asteroid extends GameObject {

    constructor(x,y,sprite,dx,dy,size) {
        super(x,y,sprite,size)
        this.dx = dx
        this.dy = dy
        this.dr = Global.deg2Rad(Global.random(-limDr, limDr))
        this.size = size
        this.hitpoints = calculateHitPoints(size)

        Asteroid.Instances.push(this)
    }

    static Instances = []

    static new(x,y,sprite,dx,dy,size) {
        let asteroid = GameObject.getInactive(Asteroid.Instances)
        if (asteroid) {
            return asteroid.revive(x,y,sprite,dx,dy,size)
        } else {
            return new Asteroid(x,y,sprite,dx,dy,size)
        }
    }

    revive(x,y,sprite,dx,dy,size) {
        super.revive(x,y,sprite,size)

        this.dx = dx
        this.dy = dy
        this.dr = Global.deg2Rad(Global.random(-limDr, limDr))
        this.hitpoints = calculateHitPoints(size)
        
        return this
    }

    update() {
        this.x += this.dx
        this.y += this.dy
        this.rot += this.dr

        this.collider.translate(this.dx, this.dy)

        if (this.hitpoints <= 0) {
            this.active = false
        }
    }

    onCollision(other) {
        if (other instanceof Projectile) {

        }
    }
}