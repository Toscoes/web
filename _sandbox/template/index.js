const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const displayWidth = window.innerWidth;
const displayHeight = window.innerHeight;

const unitWidth = window.innerWidth;
const unitHeight = window.innerHeight;

function init() {

    resize();

    // code here

}

function update() {
    resize();
    reset();

    // code here

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