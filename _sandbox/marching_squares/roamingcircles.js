const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// screen resolution;
console.log(window.innerWidth+"x"+window.innerHeight);

canvas.style.width = window.innerWidth;
canvas.style.height = window.innerHeight;

ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

// important stats
const resolution = 20;
const circleCount = 10;
const maxRadius = 50;

const rows = (ctx.canvas.width / resolution) + 1;
const cols = (ctx.canvas.height / resolution) + 1;

let points = [];
let circles = [];

function init() {
    for(let i = 0; i < rows; i++ ) {
        points[i] = [];
        for(let j = 0; j < cols; j++) {
            points[i][j] = 0;
        }
    }

    for(let i = 0; i < circleCount; i++) {
        let circleRadius = random(100, maxRadius);
        circles[i] = {
            r: circleRadius,
            x: random(circleRadius, ctx.canvas.width - circleRadius),
            y: random(circleRadius, ctx.canvas.height- circleRadius),
            dx: (Math.random() * 2) + 1 * (Math.random() > 0.5? -1 : 1),
            dy: (Math.random() * 2) + 1 * (Math.random() > 0.5? -1 : 1)
        }
    }
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function update() {
    resize();
    reset();

    // turn points on and off
    for(let i = 0; i < rows - 1; i++ ) {
        for(let j = 0; j < cols - 1; j++) {
            points[i][j] = calculatePoint(i, j);
            march(i, j);

            /*
            drawCircle(i * resolution, j * resolution, 4, 
                "rgb(" + 
                (points[i][j] >= 1? 0 : 255) * points[i][j] + "," + 
                (points[i][j] >= 1? 255 : 255) * points[i][j] + "," + 
                (points[i][j] >= 1? 0 : 255) * points[i][j] + ")"
            );
            */
        }
    }

    for(let i = 0; i < circleCount; i++ ) {
        let c = circles[i];
        if(c.x + c.r >= ctx.canvas.width || c.x - c.r <= 0) {
            c.dx *= -1;
        }
        if(c.y + c.r >= ctx.canvas.height || c.y - c.r <= 0) {
            c.dy *= -1;
        }
        c.x += c.dx;
        c.y += c.dy;

        //drawCircle(c.x, c.y, c.r, "yellow");
    }

    requestAnimationFrame(update);
}

function calculatePoint(i, j) {
    let weight = 0;
    for(let k = 0; k < circleCount; k++) {
        let c = circles[k];
        weight += (c.r * c.r) / (((i * resolution - c.x) * (i * resolution - c.x)) + ((j * resolution - c.y) * (j * resolution - c.y)));
    }
    return weight;
}

function convert(i, j) {
    let bl = points[i][j + 1] >= 1 ? 1 : 0;
    let br = points[i + 1][j + 1] >= 1 ? 1 : 0;
    let tr = points[i + 1][j] >= 1 ? 1 : 0;
    let tl = points[i][j] >= 1 ? 1 : 0;

    return bl + br * 2 + tr * 4 + tl * 8;
}

function interpolatePoint (i, j, k, l) {
    let x1 = i * resolution;
    let y1 = j * resolution;
    let x2 = k * resolution;
    let y2 = l * resolution;
    
    if(x1 == x2) {
        let weight = y2 + (y1 - y2) * ((1 - points[k][l]) / (points[i][j] - points[k][l]));
        return {x: x1, y: weight};
    } else if (y1 == y2) {
        let weight = x2 + (x1 - x2) * ((1 - points[k][l]) / (points[i][j] - points[k][l]));
        return {x: weight, y: y1};
    }
}

function march(i, j) {  
    let square = convert(i, j);
    
    let a = 0;
    let b = 0;
    let c = 0;
    let d = 0;

    switch(square) {
        case 1:
            d = interpolatePoint(i,j,i,j+1);
            c = interpolatePoint(i,j+1,i+1,j+1);
            drawLine(d, c);
            fill(
                {x: d.x, y: d.y},
                {x: c.x, y: c.y},
                {x: i* resolution, y: (j + 1) * resolution},
            );
        break;
        case 2:
            b = interpolatePoint(i+1,j+1,i,j+1);
            c = interpolatePoint(i+1,j+1,i+1,j);
            drawLine(b, c);
            fill(
                {x: b.x, y: b.y},
                {x: c.x, y: c.y},
                {x: (i + 1) * resolution, y: (j + 1) * resolution},
            );
        break;
        case 3:
            d = interpolatePoint(i,j,i,j+1);
            b = interpolatePoint(i+1,j,i+1,j+1);
            drawLine(d, b);
            fill(
                {x: d.x, y: d.y},
                {x: b.x, y: b.y},
                {x: (i + 1) * resolution, y: (j + 1) * resolution},
                {x: i * resolution, y: (j + 1) * resolution}
            );
        break;
        case 4:
            a = interpolatePoint(i,j,i+1,j);
            b = interpolatePoint(i+1,j,i+1,j+1);
            drawLine(a, b);
            fill(
                {x: (i + 1) * resolution, y: j * resolution},
                {x: a.x, y: a.y},
                {x: b.x, y: b.y}
            );
        break;
        case 5:
            a = interpolatePoint(i,j,i+1,j);
            d = interpolatePoint(i,j,i,j+1);
            b = interpolatePoint(i,j+1,i+1,j+1);
            c = interpolatePoint(i+1,j,i+1,j+1);
            drawLine(a, d);
            drawLine(b, c);
            fill(
                {x: (i + 1) * resolution, y: j * resolution},
                {x: a.x, y: a.y},
                {x: d.x, y: d.y},
                {x: i * resolution, y: (j + 1) * resolution},
                {x: c.x, y: c.y},
                {x: b.x, y: b.y}
            );
        break;
        case 6:
            a = interpolatePoint(i,j,i+1,j);
            c = interpolatePoint(i,j+1,i+1,j+1);
            drawLine(a, c);
            fill(
                {x: (i + 1) * resolution, y: j * resolution},
                {x: a.x, y: a.y},
                {x: c.x, y: c.y},
                {x: (i + 1) * resolution, y: (j + 1) * resolution}
            );
        break;
        case 7:
            a = interpolatePoint(i,j,i+1,j);
            d = interpolatePoint(i,j,i,j+1);
            drawLine(a, d);
            fill(
                {x: (i + 1) * resolution, y: j * resolution},
                {x: a.x, y: a.y},
                {x: d.x, y: d.y},
                {x: i * resolution, y: (j + 1) * resolution},
                {x: (i + 1) * resolution, y: (j + 1) * resolution}
            );
        break;
        case 8:
            a = interpolatePoint(i,j,i+1,j);
            d = interpolatePoint(i,j,i,j+1);
            drawLine(a, d);
            fill(
                {x: a.x, y: a.y},
                {x: d.x, y: d.y},
                {x: i * resolution, y: j * resolution},
            );
        break;
        case 9:
            a = interpolatePoint(i,j,i+1,j);
            c = interpolatePoint(i,j+1,i+1,j+1);
            drawLine(a, c);
            fill(
                {x: i * resolution, y: j * resolution},
                {x: a.x, y: a.y},
                {x: c.x, y: c.y},
                {x: i * resolution, y: (j + 1) * resolution}
            );
        break;
        case 10:
            a = interpolatePoint(i,j,i+1,j);
            b = interpolatePoint(i+1,j,i+1,j+1);
            c = interpolatePoint(i,j,i,j+1);
            d = interpolatePoint(i,j+1,i+1,j+1);
            drawLine(a, b);
            drawLine(c, d);
            fill(
                {x: i * resolution, y: j * resolution},
                {x: a.x, y: a.y},
                {x: b.x, y: b.y},
                {x: (i + 1) * resolution, y: (j + 1) * resolution},
                {x: c.x, y: c.y},
                {x: d.x, y: d.y}
            );
        break;
        case 11:
            a = interpolatePoint(i,j,i+1,j);
            b = interpolatePoint(i+1,j,i+1,j+1);
            drawLine(a, b);
            fill(
                {x: i * resolution, y: j * resolution},
                {x: a.x, y: a.y},
                {x: b.x, y: b.y},
                {x: (i + 1) * resolution, y: (j + 1) * resolution},
                {x: i * resolution, y: (j + 1) * resolution}
            );
        break;
        case 12:
            d = interpolatePoint(i,j,i,j+1);
            b = interpolatePoint(i+1,j,i+1,j+1);
            drawLine(d, b);
            fill(
                {x: d.x, y: d.y},
                {x: b.x, y: b.y},
                {x: (i + 1) * resolution, y: j * resolution},
                {x: i * resolution, y: j * resolution}
            );
        break;
        case 13:
            b = interpolatePoint(i+1,j+1,i+1,j);
            c = interpolatePoint(i+1,j+1,i,j+1);
            drawLine(c, b);
            fill(
                {x: b.x, y: b.y},
                {x: c.x, y: c.y},
                {x: i * resolution, y: (j + 1) * resolution},
                {x: i * resolution, y: j * resolution},
                {x: (i + 1) * resolution, y: j * resolution}
            );
        break;
        case 14:
            d = interpolatePoint(i,j,i,j+1);
            c = interpolatePoint(i,j+1,i+1,j+1);
            drawLine(d, c);
            fill(
                {x: d.x, y: d.y},
                {x: c.x, y: c.y},
                {x: (i + 1) * resolution, y: (j + 1) * resolution},
                {x: (i + 1) * resolution, y: j * resolution},
                {x: i * resolution, y: j * resolution}
            );
        break;
        case 15:
            fill(
                {x: i * resolution, y: j * resolution},
                {x: (i + 1) * resolution, y: j * resolution},
                {x: (i + 1) * resolution, y: (j + 1) * resolution},
                {x: i * resolution, y: (j + 1) * resolution},
            );
        break;
    }
}

function fill() {
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#00ff00';
    ctx.beginPath();
    ctx.moveTo(arguments[0].x, arguments[0].y);
    for(let i = 1; i < arguments.length; i++) {
        let point = arguments[i];
        ctx.lineTo(point.x, point.y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle="#00ff00";
    ctx.fill();
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

init();
update();