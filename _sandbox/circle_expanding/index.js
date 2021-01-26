const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const displayWidth = window.innerWidth;
const displayHeight = window.innerHeight;

const unitWidth = window.innerWidth;
const unitHeight = window.innerHeight;

const circular = Math.PI * 2;
class Circle {
    constructor(x,y,r,color) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color;
        this.expanding = true;

        this.de = 0;
    }
    draw(color) {
        ctx.beginPath();
        ctx.fillStyle = color? color : this.color;
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
    }
    expand(e) {
        this.r += e?e : this.de;
    }
    collides(other) {
        let dx = other.x - this.x;
        let dy = other.y - this.y;
        let distance = Math.sqrt((dx * dx) + (dy * dy));
        let r2 = this.r + other.r;
        return distance <= r2;
    }
}


// row (y) = Math.floor(i/width)
// col (x) = i % width
const image = new Image();
image.onload = function() {
    ctx.draWimage(image, 310, 301);
    let data = ctx.getImageData(0, 0, 310, 301).data;
    let cleaned = [];
    for(let i = 0; i < data.length; i+=4) {
        cleaned[i] = {
            r : data[i    ],
            g : data[i + 1],
            b : data[i + 2],
            a : data[i + 3]
        }
    }
}
image.src = "";

let circles = [];
let finished = 0;
let attempts = 0;
let maxAttempts = 1000;
let circleCount = 10;
let tick = 0;
let maxTick = 10;

function init() {

    resize();

    // code here

}

let done = false;
function update() {
    resize();
    reset();
    if (!done) {
        for(let i = 0; i < circles.length; i++) {
            let circle = circles[i];
            if(circle.expanding) {
                for(let j = 0; j < circles.length; j++) {
                    let other = circles[j];
                    if (circle != other && circle.collides(other)) {
                        circle.expanding = false;
                        other.expanding = false;
                    }
                }
                circle.expand(0.2);
            }
            circle.draw();
        }
    
        if(tick >= maxTick) {
            tick = 0;
            while(!addCircle()) {
                if(attempts <= maxAttempts) {
                    done = true;
                    break;
                }
                attempts++;
            }
        }
        tick++;
        console.log(tick);
    }

    requestAnimationFrame(update);
}

function addCircle() {
    let x = Math.random() * ctx.canvas.width;
    let y = Math.random() * ctx.canvas.height;
    for(let i = 0; i < circles.length; i++) {
        if (Math.sqrt((x * x) + (y * y)) < circles[i].r) {
            return false;
        }
    }
    circles.push(new Circle(x,y,0,"green"));
    return true;
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