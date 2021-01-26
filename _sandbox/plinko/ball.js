class Ball {
    constructor(x,y,r,color) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color;
    }
    draw(c) {
        ctx.beginPath();
        ctx.fillStyle = c? c : this.color;
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
    }
}