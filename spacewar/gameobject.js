import Collider from "./collider.js"
import Global from "./global.js"

let idCount = 0
const id = () => idCount++

export default class GameObject {
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
    }

    update() {

    }

    onCollision(other) {
        
    }
}