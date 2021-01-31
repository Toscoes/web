export default class Collider {
    constructor(x,y,radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = "white"
    }

    translate(dx, dy) {
        this.x += dx
        this.y += dy
    }

    collides(other) {
        return Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2) < Math.pow(other.radius + this.radius, 2)
    }
}