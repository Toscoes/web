const Player = require("./player")
const Ball = require("./ball")
const Global = require("./GlobalVars")

const GameState = {
    Waiting: 0,
    Loading: 1,
    InProgress: 2,
    DisplayMessage: 3
}

const GameStateSocketId = {}
GameStateSocketId[GameState.Waiting] = "state-waiting"
GameStateSocketId[GameState.Loading] = "state-loading"
GameStateSocketId[GameState.InProgress] = "state-inprogress"
GameStateSocketId[GameState.DisplayMessage] = "state-displaymessage"

module.exports = class Game {
    constructor(id) {
        this.id = id
        this.hostId = 0

        this.players = {
            player1: null,
            player2: null
        }
        this.ball = null
        this.state = null
        this.spectators = {}

        this.scorePlayer1 = null
        this.scorePlayer2 = null

        this.tick = 0;
        this.message = "";

        this.stateChanged = false //bool
        this.onStateChangeClient = null // string - client side on state change
        this.update = null

        this.data = null // data to send to the client on state change
        this.active = true

        this.changeState(GameState.Waiting)
    }

    addPlayer(id, name) {
        let player = null
        if (!this.players.player1) {
            player = new Player(id, name, "player1", this.id)
            this.players.player1 = player
        } else if (!this.players.player2) {
            player = new Player(id, name, "player2", this.id)
            this.players.player2 = player
        } else {
            player = new Player(id, name, "spectator", this.id)
            this.spectators[player.id] = player
        }
        return player
    }

    setHost(id) {
        this.hostId = id
    }

    removePlayer(playerId) {
        let p1 = this.players.player1
        let p2 = this.players.player2

        if (p1 && p1.id == playerId) {
            this.players.player1 = null
            if (p2) {
                if (this.hostId == p1.id) {
                    this.setHost(p2.id)
                }
                if(this.state == GameState.InProgress || this.state == GameState.Loading) {
                    this.data = {message: this.players.player2.name + " has left the game!"}
                    this.changeState(GameState.DisplayMessage)
                }
            } else {
                this.active = false
            }
        }
        if (p2 && p2.id == playerId) {
            this.players.player2 = null
            if (p1) {
                if (this.hostId == p2.id) {
                    this.setHost(p1.id)
                }
                if(this.state == GameState.InProgress || this.state == GameState.Loading) {
                    this.data = {message: this.players.player1.name + " has left the game!"}
                    this.changeState(GameState.DisplayMessage)
                }
            } else {
                this.active = false
            }
        }
        if (this.spectators[playerId]) {
            delete this.spectators[playerId]
        }
    }

    paddleBallCollision(paddle, ball) {
        return paddle.x < ball.x + ball.size && paddle.y < ball.y + ball.size && paddle.x + paddle.width > ball.x && paddle.y + paddle.height > ball.y
    }

    changeState(state) {

        // do not execute if the state is not changed
        if (this.state == state) {
            return
        }

        this.state = state
        this.stateChanged = true

        if (state == GameState.Waiting) {
            this.update = function () {
                if (this.players.player1) {
                    this.players.player1.update()
                }
        
                if (this.players.player2) {
                    this.players.player2.update()
                }
            }
            
            this.onStateChangeClient = GameStateSocketId[GameState.Waiting]
        }

        if (state == GameState.Loading) {
                
            this.ball = new Ball()

            this.update = function () {

                if (this.players.player1) {
                    this.players.player1.update()
                }
        
                if (this.players.player2) {
                    this.players.player2.update()
                }

                if (this.tick > Global.LoadTime) {
                    this.tick = 0
                    this.changeState(GameState.InProgress)
                }
                
                this.ball.update()
    
                if (this.tick % 30 == 0) {
                    this.ball.x = (Global.GameWidth - this.ball.size)/2
                    this.ball.y = (Global.GameHeight - this.ball.size)/2
                }
    
                this.tick++
            }

            this.onStateChangeClient = GameStateSocketId[GameState.Loading]
        }

        if (state == GameState.InProgress) {
            this.update = function () {

                if (this.players.player1) {
                    this.players.player1.update()
                }
        
                if (this.players.player2) {
                    this.players.player2.update()
                }

                this.ball.update()

                if (this.ball.y < 0) {
                    this.ball.dy *= -1
                } 
                if (this.ball.y + this.ball.size > Global.GameHeight) {
                    this.ball.dy *= -1
                }
                
                if (this.ball.x < 0) {
                    this.scorePlayer2++
                    this.changeState(GameState.Loading)
                } 
                if (this.ball.x + this.ball.size > Global.GameWidth) {
                    this.scorePlayer1++
                    this.changeState(GameState.Loading)
                }

                if (this.players.player1 && (this.paddleBallCollision(this.players.player1.paddle1, this.ball) || this.paddleBallCollision(this.players.player1.paddle2, this.ball))) {
                    this.ball.dx *= -1.1
                }

                if (this.players.player2 && (this.paddleBallCollision(this.players.player2.paddle1, this.ball) || this.paddleBallCollision(this.players.player2.paddle2, this.ball))) {
                    this.ball.dx *= -1.1
                }

                if (this.scorePlayer1 >= Global.GamePoint) {
                    this.data = {message: this.players.player1.name + " has won!"}
                    this.changeState(GameState.DisplayMessage)
                }
        
                if (this.scorePlayer2 >= Global.GamePoint) {
                    this.data = {message: this.players.player2.name + " has won!"}
                    this.changeState(GameState.DisplayMessage)
                }
            }
            this.onStateChangeClient = GameStateSocketId[GameState.InProgress]
        }

        if (state == GameState.DisplayMessage) {

            this.tick = 0
            this.scorePlayer1 = null
            this.scorePlayer2 = null
            this.ball = null

            this.update = function () {
                if (this.tick > Global.WinnerDisplayTime) {
                    this.changeState(GameState.Waiting)
                }
                this.tick++
            }

            this.onStateChangeClient = GameStateSocketId[GameState.DisplayMessage]
        }
    }

    start() {
        this.scorePlayer1 = 0
        this.scorePlayer2 = 0
        this.changeState(GameState.Loading)
    }
}