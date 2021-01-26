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

const numberOfPoints = 500;

let points = [];
let quadTree = new QuadTree(
    // keep the bounds square
    new Bounds(0,0,unitWidth, unitHeight),
    "root"
);

function init() {
    for(let i = 0; i < numberOfPoints; i++) {

        let point = new Point(
            Math.random() * ctx.canvas.width,
            Math.random() * ctx.canvas.height
        );

        points[i] = point;

        quadTree.insert(point);
    }
}

function update() {
    resize();
    reset();

    for(let i = 0; i < numberOfPoints; i++) {
        points[i].draw();
    }

    quadTree.draw();

    requestAnimationFrame(update);
}

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

document.addEventListener("keydown", function(event) {
    if(event.keyCode == 82) {
        toggleRects = !toggleRects;
    }
    if(event.keyCode == 66) {
        toggleBounds = !toggleBounds;
    }
});