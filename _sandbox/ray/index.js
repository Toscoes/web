const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const displayWidth = window.innerWidth;
const displayHeight = window.innerHeight;

const unitWidth = window.innerWidth;
const unitHeight = window.innerHeight;

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Line {
    constructor(x,y,sx,sy) {
        this.x = x;
        this.y = y;
        this.sx = sx;
        this.sy = sy;
        this.dx = this.sx - this.x;
        this.dy = this.sy - this.y;
        this.endpoint = new Point(sx,sy);
    }
    draw() {
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.sx,this.sy);
        ctx.stroke();
        this.endpoint.draw();
    }
    drawTo(x, y) {
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(x,y);
        ctx.stroke();
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    }
    setOrigin(x,y) {
        this.x = x;
        this.y = y;
        this.dx = this.sx - this.x;
        this.dy = this.sy - this.y;
    }
    setEndpoint(x,y) {
        this.sx = x;
        this.sy = y;
        this.dx = this.sx - this.x;
        this.dy = this.sy - this.y;
    }
    intersects(other) {
        let s_dx = other.dx;
        let s_dy = other.dy;
        let s_px = other.x;
        let s_py = other.y;
        let T2Denominator = ((s_dx*this.dy)-(s_dy*this.dx));
        let T2 = ((this.dx*(s_py-this.y)) + (this.dy*(this.x-s_px)))/T2Denominator;
        let T1 = (s_px+(s_dx*T2)-this.x)/this.dx;
        return (T1 >= 0 && T2 >= 0 && T2 <= 1)? T1 : -1;
    }
}

class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.corners = [
            new Point(this.x,this.y),
            new Point(this.x + this.w,this.y),
            new Point(this.x+this.w,this.y+this.h),
            new Point(this.x,this.y+this.h)
        ];
        this.edges = [
            new Line(this.x, this.y, this.x+this.w, this.y),
            new Line(this.x+this.w, this.y, this.x+this.w, this.y+this.h),
            new Line(this.x+this.w, this.y+this.h, this.x, this.y+this.h),
            new Line(this.x, this.y, this.x, this.y+this.h)
        ]
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.fill();
    }
}

let rects         = [];
let edges         = [];
let rays          = [];
let corners       = [];
let sortedCorners = [];
let cursor;

const numberOfRects = 1;
const maxWidth = 250;
const minWidth = 10;
const maxHeight = 250;
const minHeight = 10;

let pointer;

function init() {

    resize();

    // init cursor
    cursor = new Point(ctx.canvas.width/2,ctx.canvas.height/2);

    // initialize with canvas corners and edges
    corners.push(    
        new Point(0,0),
        new Point(ctx.canvas.width,0),
        new Point(ctx.canvas.width,ctx.canvas.height),
        new Point(0,ctx.canvas.height)
    );

    edges.push(
        new Line(0,0,ctx.canvas.width,0),
        new Line(ctx.canvas.width,0,ctx.canvas.width,ctx.canvas.height),
        new Line(ctx.canvas.width,ctx.canvas.height,-ctx.canvas.width,ctx.canvas.height),
        new Line(0,0,0,ctx.canvas.height)
    );

    // place rectangles
    for (let i = 0; i < numberOfRects; i++) {
        rects.push(
            new Rectangle(
                Math.random() * ctx.canvas.width,
                Math.random() * ctx.canvas.height,
                (Math.random() * maxWidth) + minWidth,
                (Math.random() * maxHeight) + minHeight,
            )
        );
    }

    // add rectangle corners to list of corners and edges to list
    // of edges
    for (let i = 0; i < rects.length; i++) {
        let rect = rects[i];
        corners = corners.concat(rect.corners);
        edges = edges.concat(rect.edges);
    }

    // cast rays to corners 
    for (let i = 0; i < corners.length; i++) {
        let ray = new Line(cursor.x, cursor.y, corners[i].x, corners[i].y);
        rays.push(ray);
    }

    pointer = new Line(ctx.canvas.width/2,ctx.canvas.height/2,0,0);
}

function update() {
    resize();
    reset();

    /*
    let closest = 9999;
    for (let i = 0; i < edges.length; i++) {
        let result = pointer.intersects(edges[i]);
        if(result != -1 && result < closest) {
            closest = result;
        }
    }
    let ex = pointer.x + (pointer.dx * closest);
    let ey = pointer.y + (pointer.dy * closest);
    pointer.drawTo(ex,ey);
    */

    for(let i = 0; i < rays.length; i++) {
        let ray = rays[i];
        ray.setOrigin(cursor.x,cursor.y);
    }

    // calculate where each ray collides
    for (let i = 0; i < rays.length; i++) {
        let ray = rays[i];
        let closest = 9999;
        for (let j = 0; j < edges.length; j++) {
            let result = ray.intersects(edges[j]);
            if(result != -1 && result < closest) {
                closest = result;
            }
        }
        let ex = ray.x + (ray.dx * closest);
        let ey = ray.y + (ray.dy * closest);
        ray.drawTo(ex,ey);
    }

    // draw rectangles
    for (let i = 0; i < rects.length; i++) {
        rects[i].draw();
    }

    requestAnimationFrame(update);
}

function drawAngle(a) {
    ctx.beginPath();
    let rads = (a / 180) * Math.PI;
    let toX = Math.cos(rads);
    let toY = Math.sin(rads);
    ctx.strokeStyle="red";
    ctx.lineWidth="1";
    ctx.moveTo(cursor.x, cursor.y);
    ctx.lineTo(cursor.x + (toX * 100),cursor.y + (toY * 100));
    ctx.stroke();
}

function sort(arr) {
    
}

canvas.addEventListener("mousemove", function(event) {
    cursor.x = event.clientX;
    cursor.y = event.clientY;

    pointer.setEndpoint(cursor.x,cursor.y);

    /*
    // re-sort corners
    sortedCorners = [];
    for (let i = 0; i < corners.length; i++) {
        let corner = corners[i];
        let opposite = corner.y - cursor.y; 
        let adjacent = corner.x - cursor.x;
        let adjuster = 0;
        if((adjacent < 0 && ( opposite > 0 || opposite < 0))) {
            adjuster = 180
        } else if (adjacent > 0 && opposite < 0) {
            adjuster = 360;
        }
        
        let angleToCorner = {
            angle: Math.atan(((opposite/adjacent) * 180 / Math.PI) + adjuster),
            cornerIndex: i
        }
        sortedCorners.push(angleToCorner);
    }
    sort(sortedCorners);
    */
});

function resize() {
    canvas.style.width = displayWidth;
    canvas.style.height = displayHeight;
    
    ctx.canvas.width = unitWidth;
    ctx.canvas.height = unitHeight;
}

function reset() {
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
}

init();
update();