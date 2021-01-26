const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// screen resolution;
console.log(window.innerWidth+"x"+window.innerHeight);

canvas.style.width = window.innerWidth;
canvas.style.height = window.innerHeight;

ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

const resolution = 10;
const rows = (ctx.canvas.width / resolution) + 1;
const cols = (ctx.canvas.height / resolution) + 1;

let points = [];

function init() {
    for(let i = 0; i < rows; i++ ) {
        points[i] = [];
        for(let j = 0; j < cols; j++) {
            points[i][j] = Math.random() < 0.5? 0 : 1;
        }
    }
}

init();

function update() {
    resize();
    reset();
    
    /*
    for(let i = 0; i < rows; i++ ) {
        for(let j = 0; j < cols; j++) {
            drawCircle(i * resolution, j * resolution, 4, "rgb("+points[i][j]*255+","+points[i][j]*255+","+points[i][j]*255+")");
        }
    }
    */

    for(let i = 0; i < rows - 1; i++ ) {
        for(let j = 0; j < cols - 1; j++) {
            march(i, j);
        }
    }

    requestAnimationFrame(update);
}

function resize() {
    canvas.style.width = window.innerWidth;
    canvas.style.height = window.innerHeight;
    
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
}

function reset() {
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
}

update();

function convert(i, j) {
    return points[i][j + 1] + points[i + 1][j + 1] * 2 + points[i + 1][j] * 4 + points[i][j] * 8;
}

function getLine(i, j, k) {

    let px = i * resolution;
    let py = j * resolution;

    switch(k) {
        case 'a':
            return {x: px + resolution/2, y: py};
        break;
        case 'b':
            return {x: px + resolution, y: py + resolution/2};
        break;
        case 'c':
            return {x: px + resolution/2, y: py + resolution};
        break;
        case 'd':
            return {x: px, y: py + resolution/2};
        break;
    }
}

function march(i, j) {  
    let square = convert(i, j);
    switch(square) {
        case 1:
            drawLine(getLine(i,j,'d'), getLine(i,j,'c'));
        break;
        case 2:
            drawLine(getLine(i,j,'c'), getLine(i,j,'b'));
        break;
        case 3:
            drawLine(getLine(i,j,'d'), getLine(i,j,'b'));
        break;
        case 4:
            drawLine(getLine(i,j,'a'), getLine(i,j,'b'));
        break;
        case 5:
            drawLine(getLine(i,j,'d'), getLine(i,j,'a'));
            drawLine(getLine(i,j,'b'), getLine(i,j,'c'));
        break;
        case 6:
            drawLine(getLine(i,j,'a'), getLine(i,j,'c'));
        break;
        case 7:
            drawLine(getLine(i,j,'d'), getLine(i,j,'a'));
        break;
        case 8:
            drawLine(getLine(i,j,'d'), getLine(i,j,'a'));
        break;
        case 9:
            drawLine(getLine(i,j,'a'), getLine(i,j,'c'));
        break;
        case 10:
            drawLine(getLine(i,j,'a'), getLine(i,j,'b'));
            drawLine(getLine(i,j,'d'), getLine(i,j,'c'));
        break;
        case 11:
            drawLine(getLine(i,j,'a'), getLine(i,j,'b'));
        break;
        case 12:
            drawLine(getLine(i,j,'d'), getLine(i,j,'b'));
        break;
        case 13:
            drawLine(getLine(i,j,'c'), getLine(i,j,'b'));
        break;
        case 14:
            drawLine(getLine(i,j,'d'), getLine(i,j,'c'));
        break;
    }
}

function drawLine(p1, p2) {
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#00ff00';
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.closePath();
    ctx.stroke();
}

function drawCircle(x, y, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}