import GameObject from "./gameobject.js"
import Asteroid from "./asteroid.js"
import Projectile from "./projectile.js"
import Global from "./global.js"
import { Events } from "./app.js"

export default class Spaceship extends GameObject {
    constructor(x,y,sprite) {
        super(x,y,sprite,1)
        this.maxSpeed = .05
        this.halfSpeed = .01
        this.rotSpeed = Global.deg2Rad(0.5)
        this.rotating = false
        this.accelerating = false
        this.hitpoints = 3
    }

    update() {
        this.rotating = false
        this.accelerating = false

        this.x += this.dx
        this.y += this.dy
        this.rot += this.dr

        this.collider.translate(this.dx, this.dy)
    }

    onKeyHeld(keysHeld) {
        if (keysHeld["KeyZ"]) {
            this.dr -= this.rotSpeed
            this.rotating = true
        }
        if (keysHeld["KeyX"]) {
            this.dr += this.rotSpeed
            this.rotating = true
        }
        if (keysHeld["ArrowRight"]) {
            this.dx += Math.cos(this.rot - Global.Deg90) * this.halfSpeed
            this.dy += Math.sin(this.rot - Global.Deg90) * this.halfSpeed
            this.accelerating = true
        }
        if (keysHeld["ArrowLeft"]) {
            this.dx += Math.cos(this.rot + Global.Deg90) * this.halfSpeed
            this.dy += Math.sin(this.rot + Global.Deg90) * this.halfSpeed
            this.accelerating = true
        }
        if (keysHeld["ArrowUp"]) {
            this.dx += Math.cos(this.rot) * this.maxSpeed
            this.dy += Math.sin(this.rot) * this.maxSpeed
            this.accelerating = true
        }
        if (keysHeld["ArrowDown"]) {
            
        }

        if (!this.rotating) {
            this.dr *= Math.abs(this.dr) > Global.Epsilon? Global.Decel : 0
        }
    
        if (!this.accelerating) {
            this.dx *= Math.abs(this.dx) > Global.Epsilon? Global.Decel : 0
            this.dy *= Math.abs(this.dy) > Global.Epsilon? Global.Decel : 0
        }

    }

    onCollision(other) {
        if (other instanceof Asteroid) {
            Events.push({
                type: Events.CameraShake,
                duration: 40,
                intensity: 10
            })

        }
    }
}