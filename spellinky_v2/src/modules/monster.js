const Object = require("./object");

module.exports = class Monster extends Object.Entity {
    constructor(x, y, name) {
        super(x,y,name);
    }
    update() {
        //console.log(this.grounded);
    }
}