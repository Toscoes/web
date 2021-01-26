let toggleBounds = false;
let toggleRects = false;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const displayWidth = 768;
const displayHeight = 768;

const unitWidth = 768;
const unitHeight = 768;

canvas.style.width = displayWidth;
canvas.style.height = displayHeight;

ctx.canvas.width = unitWidth;
ctx.canvas.height = unitHeight;

let bouncers = [];
let balls = [];
let quadTree = new QuadTree(
    // keep the bounds square
    new Bounds(0,0,unitWidth, unitHeight),
    "root"
);

function init() {
    balls.push(new Ball(100, 100, "green"));
}

function update() {
    resize();
    reset();

    drawBalls();

    requestAnimationFrame(update);
}

function physics() {
    for(let i = 0; i < balls.length; i++) {
        let ball = balls[i];
    }
}

function drawBalls() {
    for(let i = 0; i < balls.length; i++) {
        balls[i].draw();
    }
}

function includes(range, x, y) {
    return range.x < x && range.y < y && range.x + range.w > x && range.y + range.h > y;
}

let rect = canvas.getBoundingClientRect(); 
document.addEventListener("mousemove", function(event) {
    let x = event.clientX - rect.left; 
    let y = event.clientY - rect.top; 
    range.x = x - range.w/2;
    range.y = y - range.h/2;

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