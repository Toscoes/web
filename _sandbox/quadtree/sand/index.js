// left until webassembly

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const unit = 256;
const s = 768;

canvas.style.width = s;
canvas.style.height = s;

let scale = s/unit;

ctx.canvas.width = unit;
ctx.canvas.height = unit;

let grid = [];
let particles = [];
let quadTree = new QuadTree(
    // keep the bounds square
    new Bounds(0,0,unit, unit),
    "root"
);

const debug0 = document.getElementById("debug0");
const debug1 = document.getElementById("debug1");

let cursor = {
    x: -1,
    y: -1
}

let tick = 0;
let mouseHold = false;
let radius = 3;

const figure1X = 0;
const figure1Y = 0;
const figure1 = new Image();
figure1.onload = function () {
    ctx.drawImage(figure1, figure1X,figure1Y);
    let data = ctx.getImageData(0,0,ctx.canvas.width,ctx.canvas.height).data;
    for(let i = 0; i < data.length; i+=4 ) {
        let alpha = data[i+3];
        if(alpha == 255 && data[i] != 255) {
            let index = i/4;
            let row = Math.floor(index/unit);
            let col = index % unit;
            quadTree.insert(new Point(col, row));
        }
    }
    //quadTree.merge();
}

function init() {
    for(let i = 0; i < s / scale; i++) {
        grid[i] = [];
        for(let j = 0; j < s / scale; j++) {
            grid[i][j] = EMPTY;
        }
    }
}

function update() {
    clear();

    mouseListen();


    for(let p = 0; p < particles.length; p++) {
        let particle = particles[p];
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.i, particle.j, 1, 1);
    }
    
    physicsUpdate();

    requestAnimationFrame(update);
}

function mouseListen() {
    if(mouseHold) {
        for(let i = cursor.x - radius; i < cursor.x + radius; i++) {
            for(let j = cursor.y - radius; j < cursor.y + radius; j++) {
                if((Math.pow(cursor.x - i, 2) + Math.pow(cursor.y - j, 2) < Math.pow(radius, 2)) && grid[i][j] == EMPTY) {
                    let sand = new Sand(i, j, "yellow");
                    grid[i][j] = sand;
                    particles.push(sand);
                }
            }
        }
        debug0.innerText = particles.length;
    }
}

function physicsUpdate() {
    for(let p = 0; p < particles.length; p++) {
        let particle = particles[p];
        let i = particle.i;
        let j = particle.j;
        if(grid[i][j + 1] == EMPTY && j + 1 < unit) {
            // cell below is empty and not the floor
            grid[i][j] = EMPTY;
            grid[i][j+1] = particle;
            particle.j++;
        } else if (grid[i - 1][j + 1] == EMPTY && grid[i + 1][j + 1] == EMPTY && j + 1 < unit) {
            // left is open and not on the ground
            let r = Math.random();
            let leftRight = r > 0.5? -1 : 1;
            grid[i][j] = EMPTY;
            grid[i + leftRight][j + 1] = particle;
            particle.i += leftRight;
            particle.j++;
        } else if (grid[i - 1][j + 1] == EMPTY && j + 1 < unit) {
            grid[i][j] = EMPTY;
            grid[i + -1][j + 1] = particle;
            particle.i--;
            particle.j++;
        } else if (grid[i + 1][j + 1] == EMPTY && j + 1 < unit) {
            grid[i][j] = EMPTY;
            grid[i + 1][j + 1] = particle;
            particle.i++;
            particle.j++;
        }
    }
}

document.addEventListener("keydown", function(event) {

});

document.addEventListener("keyup", function(event) {

});

canvas.addEventListener("mousemove", function(event) {
    cursor.x = Math.floor(event.offsetX / scale);
    cursor.y = Math.floor(event.offsetY / scale);
});

canvas.addEventListener("mousedown", function(event) {
    mouseHold = true;
});

canvas.addEventListener("mouseup", function(event) {
    mouseHold = false;
});

function clear() {
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
}

init();
update();