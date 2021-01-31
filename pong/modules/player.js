const Global = require("./GlobalVars")

module.exports = class Player {
    constructor(id, name, role, gameId) {
        this.id = id
        this.name = name
        this.role = role
        this.gameId = gameId
        this.dashPower = 150
        
        if (role != "spectator") {
            this.paddle1 = {
                x: role == "player2"? Global.GameWidth - Global.PaddleWidth - Global.PaddlePadding : Global.PaddlePadding,
                y: (Global.GameHeight - Global.PaddleHeight)/2,
                width: Global.PaddleWidth,
                height: Global.PaddleHeight,
            }
            this.paddle2 = {
                x: role == "player2"? Global.GameWidth - Global.PaddleWidth - Global.PaddlePadding : Global.PaddlePadding,
                y: Global.GameHeight + (Global.GameHeight - Global.PaddleHeight)/2,
                width: Global.PaddleWidth,
                height: Global.PaddleHeight,
            }

            this.up = false
            this.down = false
            this.dy = 0
            this.dashing = false
        }
    }

    update() {

        if (this.role != "spectator") {
            let paddle1 = this.paddle1
            let paddle2 = this.paddle2
            if (paddle1.y < 0) {
                paddle2.y = Global.GameHeight + paddle1.y
            }
            if (paddle2.y < 0) {
                paddle1.y = Global.GameHeight + paddle2.y
            }
            if (paddle1.y + Global.PaddleHeight > Global.GameHeight) {
                paddle2.y = paddle1.y - Global.GameHeight
            }
            if (paddle2.y + Global.PaddleHeight > Global.GameHeight) {
                paddle1.y = paddle2.y - Global.GameHeight
            }

            if (!this.dashing) {
                if (this.up) {
                    this.dy = Math.max(this.dy - 4, -32)
                }
                if (this.down) {
                    this.dy = Math.min(this.dy + 4, 32)
                }
            }
        
            this.dy *= Math.abs(this.dy) > Global.Epsilon? 0.75 : 0
        
            if (Math.abs(this.dy) < Global.MaxSpeed) {
                this.dashing = false
            }
        
            paddle1.y += this.dy
            paddle2.y += this.dy
        }
    }

    onKeyHeld(keys) {
        if (keys["KeyW"]) {
            this.up = true
        } else {
            this.up = false
        }
        if (keys["KeyS"]) {
            this.down = true
        } else {
            this.down = false
        }
    }

    onKeyPress(key) {
        if (key == "Space") {
            if (this.up) {
                this.dy = -this.dashPower
                this.dashing = true
            } else if (this.down) {
                this.dy = this.dashPower
                this.dashing = true
            }
        }
    }
}