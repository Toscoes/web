const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")

const Mouse = {
    x: -1,
    y: -1
}

const Rectangles = []
const Edges = []
const Points = []
const Rays = []

class Point {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw() {
        context.beginPath();
        context.fillStyle = "red";
        context.arc(this.x, this.y, 2, 0, Math.PI * 2);
        context.fill();
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
    }
    drawTo(x, y) {
        context.beginPath();
        context.strokeStyle = "red";
        context.moveTo(this.x, this.y);
        context.lineTo(x,y);
        context.stroke();
        context.beginPath();
        context.fillStyle = "red";
        context.arc(x, y, 4, 0, Math.PI * 2);
        context.fill();
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
            new Point(this.x,this.y), // top left
            new Point(this.x + this.w,this.y), // top right
            new Point(this.x+this.w,this.y+this.h), // bottom right
            new Point(this.x,this.y+this.h) // bottom left
        ];

        let edgeA =  new Line(this.x, this.y, this.x+this.w, this.y) //top
        let edgeB =  new Line(this.x+this.w, this.y, this.x+this.w, this.y+this.h) // right
        let edgeC =  new Line(this.x+this.w, this.y+this.h, this.x, this.y+this.h) // bottom
        let edgeD =  new Line(this.x, this.y, this.x, this.y+this.h) //left

        this.edges = [edgeA, edgeB, edgeC, edgeD]

        Edges.push(edgeA, edgeB, edgeC, edgeD)
    }
    draw() {
        context.beginPath();
        context.fillStyle = "white";
        context.rect(this.x, this.y, this.w, this.h);
        context.fill();
    }

    contains(x,y) {
        return (x < this.x + this.w) && (x > this.x) && (y < this.y + this.h) && (y > this.y)
    }
}

const originRay = new Line(0,0,0,0)

function init() {

    Rectangles.push(new Rectangle (
        200,200,200,200
    ))

    Rays.push(originRay)

    requestAnimationFrame(update)
}

const radBetweenPoints = (x1,y1,x2,y2) => Math.atan2(y2 - y1, x2- x1)

function update() {

    context.clearRect(0,0,context.canvas.width,context.canvas.height)

    originRay.setEndpoint(Mouse.x,Mouse.y)

    // calculate where each ray collides
    Rays.forEach(ray => {
        let closest = 9999;
        Rectangles.forEach(rectangle => {
            rectangle.edges.forEach(edge => {
                let result = ray.intersects(edge);
                if(result != -1 && result < closest) {
                    closest = result;
                }
            })
        })
        let ex = ray.x + (ray.dx * closest);
        let ey = ray.y + (ray.dy * closest);
        ray.drawTo(ex,ey);
    })

    Rectangles.forEach( rectangle => {
        rectangle.draw()
    })

    requestAnimationFrame(update)
}

// input handlers
function onMouseClick(x, y) {

}

function onMouseMove(x, y) {

}

function onKeyPress(key) {

}

const keysLast = {}
const keysHeld = {}

document.addEventListener("mousemove", event => {
    Mouse.x = event.clientX
    Mouse.y = event.clientY
    onMouseMove(Mouse.x, Mouse.y)
})

document.addEventListener("click", event => {
    onMouseClick(Mouse.x, Mouse.y)
})

document.addEventListener("keydown", event => {
    const key = event.code

    setKeysLast()

    keysHeld[key] = true

    if (isKeyPressed(key)) {
        onKeyPress(key)
    }

})

document.addEventListener("keyup", event => {
    const key = event.code

    setKeysLast()

    keysHeld[key] = false
})

function isKeyPressed(key) {
    return keysHeld[key] && !keysLast[key]
}

function setKeysLast() {
    for (let key in keysHeld) {
        keysLast[key] = keysHeld[key]; 
    }
}

window.addEventListener("resize", resize)
function resize() {
    canvas.width = canvas.clientWidth * window.devicePixelRatio
    canvas.height = canvas.clientHeight * window.devicePixelRatio
    context.canvas.width = canvas.width
    context.canvas.height = canvas.height
    context.imageSmoothingEnabled = false

    init()
}
resize()