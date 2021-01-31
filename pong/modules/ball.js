const Global = require("./GlobalVars")

module.exports = class Ball {
    constructor() {
        this.size = Global.BallSize
        this.x = (Global.GameWidth - this.size)/2
        this.y = (Global.GameHeight - this.size)/2
        this.dx = Global.BallStartDx * (Math.random() < 0.5? -1 : 1)
        this.dy = Global.BallStartDy * (Math.random() < 0.5? -1 : 1)
    }

    update() {
        this.x += this.dx
        this.y += this.dy
    }

    reset() {
        this.x = (Global.GameWidth - this.size)/2
        this.y = (Global.GameHeight - this.size)/2
        this.dx = Global.BallStartDx
        this.dy = Global.BallStartDy
    }
}