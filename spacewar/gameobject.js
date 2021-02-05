import Collider from "./collider.js"
import Global from "./global.js"

let idCount = 0
const id = () => idCount++

export default class GameObject {

    static List = []

    constructor(x,y,sprite,size) {
        this.id = id()
        this.x = x
        this.y = y
        this.rot = Global.deg2Rad(-90)
        this.dx = 0
        this.dy = 0
        this.dr = 0
        this.size = size
        this.sprite = sprite 
        this.radius = (sprite.width/2) * size
        this.collider = new Collider(this.x,this.y,this.radius)
        this.active = true

        GameObject.List.push(this)
    }

    static getInactive(instances) {
        for(let i = 0; i < instances.length; i++) {
            if (!instances[i].active) {
                return instances[i]
            }
        }
        return null
    }

    revive(x,y,sprite,size) {
        this.x = x
        this.y = y
        this.size = size
        this.sprite = sprite
        this.radius = (sprite.width/2) * size 
        this.collider.x = x
        this.collider.y = y
        this.collider.radius = this.radius
        this.active = true
    }

    update() { throw new Error("update not implemented") }
    onCollision(other) { throw new Error("onCollision not implemented")}
}