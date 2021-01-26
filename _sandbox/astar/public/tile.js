export class Tile {

    static Dimension = 16
    static HalfDimension = Tile.Dimension/2

    // visibility
    static Hidden = 0
    static Seen = 1
    static Visible = 2

    // type
    static Empty = 0
    static Blocked = 1
    static Open = 2
    static Chasm = 3
    static Start = 4
    static Exit = 5
    
    constructor(x,y,data) {
        this.x = x
        this.y = y
        this.screenX = this.x * Tile.Dimension
        this.screenY = this.y * Tile.Dimension
        this.sprite = data.sprite
        this.transparent = data.transparent // bool
        this.navigatable = data.navigatable // bool
        this.cost = data.cost
        this.type = data.type
        this.visibility = Tile.Hidden
        this.entities = []
    }

    validStartExit() {
        return this.type == Tile.Open
    }

    setType(type) {
        this.type = type
    }
}