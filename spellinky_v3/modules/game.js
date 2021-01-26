class Game {
    constructor(id) {
        this.id = id
        this.players = {

        }
    }

    addPlayer(player) {
        this.players[player.id] = player
    }
}

module.exports = Game