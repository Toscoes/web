const Player = require("./player")
const Ball = require("./ball")
const Global = require("./GlobalVars")

const GameState = {
    Waiting: 0,
    InProgress: 1,
    End: 2
}

module.exports = class Game {
    constructor(id) {
        this.id = id
        this.players = {
            player1: null,
            player2: null
        }
        this.ball = null
        this.state = GameState.Waiting
        this.score = 0
        this.spectators = {}
    }

    update() {

        if (this.players.player1) {
            this.players.player1.update()
        }

        if (this.players.player2) {
            this.players.player2.update()
        }
        
        if (this.ball) {
            this.ball.update()

            if (this.ball.y < 0) {
                this.ball.dy *= -1
            } 
            if (this.ball.y + this.ball.size > Global.GameHeight) {
                this.ball.dy *= -1
            }
            
            if (this.ball.x < 0) {
                this.ball.dx *= -1
            } 
            if (this.ball.x + this.ball.size > Global.GameWidth) {
                this.ball.dx *= -1
            }

            if (this.paddleBallCollision(this.players.player1.paddle1, this.ball) || this.paddleBallCollision(this.players.player1.paddle2, this.ball)) {
                this.ball.dx *= -1.1
            }
        }
    }

    addPlayer(name) {
        let player = null
        if (!this.players.player1) {
            player = new Player(name, "player1")
            this.players.player1 = player
        } else if (!this.players.player2) {
            player = new Player(name, "player1")
            this.players.player2 = player
        } else {
            // spectator
            player = new Player(name, "spectator")
            this.spectators.push(player)
        }
        return player
    }

    start() {
        this.ball = new Ball()
    }

    paddleBallCollision(paddle, ball) {
        return paddle.x < ball.x + ball.size && paddle.y < ball.y + ball.size && paddle.x + paddle.width > ball.x && paddle.y + paddle.height > ball.y
    }
}