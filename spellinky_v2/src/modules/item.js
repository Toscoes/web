const Object = require("./object");

module.exports = class Item extends Object.Entity {
    constructor(x,y,name) {
        super(x,y,name);
        this.type = "ITEM";
        this.itemTick = 0;
    }
    update() {
        // can have variable to record ticks (aka lifetime)
        // can be used to float item indepently and get rid of item if out for too long
    }
}