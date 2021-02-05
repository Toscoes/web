import GameObject from "./gameobject.js"
import Asteroid from "./asteroid.js"
import Global from "./global.js"
import { Events } from "./app.js"

export default class Projectile extends GameObject {

    constructor(shooter,sprite) {
        super(shooter.x,shooter.y,sprite,1)
        this.shooter = shooter
        this.dx = Math.cos(shooter.rot) * 20
        this.dy = Math.sin(shooter.rot) * 20

        Projectile.Instances.push(this)
    }

    static Instances = []

    static new(shooter,sprite) {
        let projectile = GameObject.getInactive(Projectile.Instances)
        if (projectile) {
            return projectile.revive(shooter,sprite)
        } else {
            return new Projectile(shooter,sprite)
        }
    }

    revive(shooter,sprite) {
        super.revive(shooter.x,shooter.y,sprite,1)

        this.shooter = shooter
        this.dx = Math.cos(shooter.rot) * 20
        this.dy = Math.sin(shooter.rot) * 20

        return this
    }

    update() {
        this.x += this.dx
        this.y += this.dy

        this.collider.translate(this.dx, this.dy)
    }

    onCollision(other) {
        if (other.id == this.shooter.id) {
            return
        }

        if (other instanceof Asteroid) {
            other.hitpoints--;
            if (other.hitpoints == 0) {
                this.shooter.increaseScore()
            }
            Events.push({type: Events.CameraShake, duration: 40, intensity: 10})
        }

        this.active = false
    }
}