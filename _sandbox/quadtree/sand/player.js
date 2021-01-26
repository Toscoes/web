//const diagonalSpeed = Math.sqrt(2)/2;

class Player {
    constructor (x, y) {
        // 
        this.range = new Bounds(0,0,32,32);
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.dy = 0;
        this.speed = 1;
        this.up = false;
        this.left = false;
        this.down = false;
        this.right = false;
    }
    handleMovement() {

        /*
        if((this.up || this.down) && (this.left || this.right)) {
            this.speed = diagonalSpeed;
        } else {
            this.speed = 1;
        }
        */

        if (this.up) {
           this.dy = -this.speed; 
        } else if (this.down) {
            this.dy = this.speed;
        } else {
            this.dy = 0;
        }

        if (this.left) {
            this.dx = -this.speed;
        } else if (this.right) {
            this.dx = this.speed;
        } else {
            this.dx = 0;
        }

        this.range.x = this.x - 16 + 4;
        this.range.y = this.y - 16 + 4;
    }
}