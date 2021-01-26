let canvas = document.getElementById("canvas");
let contxt = canvas.getContext("2d");

canvas.style.width = window.innerWidth;
canvas.style.height = window.innerHeight;

contxt.canvas.width = window.innerWidth;
contxt.canvas.height = window.innerHeight;

class Snowflake {
    constructor() {
        let points = [
            0,0,
            0,1,
        ];
        let div = Math.PI / 3
        let randStems = getRandomIntRange(3,6)
        for (let i = 0; i < randStems; i++) {
            let stemY = (i + Math.random()) / randStems;
            points.push(0);
            points.push(stemY);
    
            let endPointX = getRandomRange(0.1,0.5);
            let endpointY = stemY + getRandomRange(0.1,0.5);
            points.push(endPointX);
            points.push(endpointY);
    
            points.push(0);
            points.push(stemY);
            points.push(-endPointX);
            points.push(endpointY);
        }
    
        let rotatedPoints = [];
        for(let i = 0; i < points.length; i+=4) {
            let x1 = points[ i ];
            let y1 = points[i+1];
            let x2 = points[i+2];
            let y2 = points[i+3];
            for(let r = 0; r < 6; r++) {
                let xr1 = x1 * Math.cos(div * r) - y1 * Math.sin (div * r); 
                let yr1 = x1 * Math.sin(div * r) + y1 * Math.cos (div * r); 
                let xr2 = x2 * Math.cos(div * r) - y2 * Math.sin (div * r); 
                let yr2 = x2 * Math.sin(div * r) + y2 * Math.cos (div * r); 
                rotatedPoints.push(xr1);
                rotatedPoints.push(yr1);
                rotatedPoints.push(xr2);
                rotatedPoints.push(yr2);
            }
        }
        this.x = getRandomRange(100, contxt.canvas.width - 50);
        this.y = -100;
        this.dx = getRandomRange(-1.5, 0.5);
        this.dy = getRandomRange(1, 2);
        this.points = points.concat(rotatedPoints);
        this.scale = getRandomIntRange(10,30);
        this.active = true;
    }

    regenerate() {
        let points = [
            0,0,
            0,1,
        ];
        let div = Math.PI / 3
        let randStems = getRandomIntRange(3,6)
        for (let i = 0; i < randStems; i++) {
            let stemY = (i + Math.random()) / randStems;
            points.push(0);
            points.push(stemY);
    
            let endPointX = getRandomRange(0.1,0.5);
            let endpointY = stemY + getRandomRange(0.1,0.5);
            points.push(endPointX);
            points.push(endpointY);
    
            points.push(0);
            points.push(stemY);
            points.push(-endPointX);
            points.push(endpointY);
        }
    
        let rotatedPoints = [];
        for(let i = 0; i < points.length; i+=4) {
            let x1 = points[ i ];
            let y1 = points[i+1];
            let x2 = points[i+2];
            let y2 = points[i+3];
            for(let r = 0; r < 6; r++) {
                let xr1 = x1 * Math.cos(div * r) - y1 * Math.sin (div * r); 
                let yr1 = x1 * Math.sin(div * r) + y1 * Math.cos (div * r); 
                let xr2 = x2 * Math.cos(div * r) - y2 * Math.sin (div * r); 
                let yr2 = x2 * Math.sin(div * r) + y2 * Math.cos (div * r); 
                rotatedPoints.push(xr1);
                rotatedPoints.push(yr1);
                rotatedPoints.push(xr2);
                rotatedPoints.push(yr2);
            }
        }
        this.points = points.concat(rotatedPoints);
        this.x = getRandomRange(100, contxt.canvas.width - 50);
        this.y = -100;
        this.dx = getRandomRange(-1.5, 0.5);
        this.dy = getRandomRange(1, 2);
        this.scale = getRandomIntRange(10,30);
        this.active = true;
    }

    rotate(degrees) {
        let rads = (Math.PI * degrees) / 180;
        let cos = Math.cos(rads);
        let sin = Math.sin(rads);
        for(let i = 0 ; i < this.points.length ; i+=4 ) {
            let x1 = this.points[ i ];
            let y1 = this.points[i+1];
            let x2 = this.points[i+2];
            let y2 = this.points[i+3];
            this.points[ i ] = x1 * cos - y1 * sin; 
            this.points[i+1] = x1 * sin + y1 * cos; 
            this.points[i+2] = x2 * cos - y2 * sin; 
            this.points[i+3] = x2 * sin + y2 * cos; 
        }
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function getRandomRange(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomIntRange(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

let flakes = [];
let inactive = [];
let next = 0;
let tick = 0;

/*
let rows = 6;
let cols = 13;
for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols; j++) {
        flakes.push(new Snowflake( (j * 150) + 55, (i * 150) + 55));
    }
}
*/

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}
loop();

function draw() {
    contxt.clearRect(0,0,contxt.canvas.width, contxt.canvas.height);
    contxt.beginPath();
    contxt.strokeStyle="white";
    for(let i = 0; i < flakes.length; i++) {
        let flake = flakes[i];
        contxt.setTransform(1,0,0,1,flake.x, flake.y);
        for(let j = 0; j < flake.points.length; j+=4) {
            contxt.moveTo(flake.points[ j ] * flake.scale, flake.points[j+1] * flake.scale);
            contxt.lineTo(flake.points[j+2] * flake.scale, flake.points[j+3] * flake.scale);
        }
    }
    contxt.stroke();
    contxt.resetTransform();
}

function update() {
    for(let i = 0; i < flakes.length; i++) {
        let flake = flakes[i];
        if (flake.active) {
            flake.rotate(0.2);
            flake.x += flake.dx;
            flake.y += flake.dy;
        }
    }

    for(let i = 0; i < flakes.length; i++) {
        let flake = flakes[i];
        if (flake.y > contxt.canvas.height + 100) {
            flake.active = false;
            inactive.push(flake);
        }
    }

    if (tick > next) {
        tick = 0;
        // generate new snowflake or regenerate one
        let deadFlake = inactive.pop();
        if (deadFlake) {
            deadFlake.regenerate();
        } else {
            flakes.push(new Snowflake());
        }
        next = getRandomRange(1, 25);
    }
    tick++;
}