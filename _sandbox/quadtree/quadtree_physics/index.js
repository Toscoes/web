let toggleBounds = false;
let toggleRects = true;
let flip = 1;

// use raycasting for collisions 
// i think the reason i didn't use raycasting previously
// is because i was worried about a hitbox that could
// slip through the cracks (too thin)

// for physics:
// get a 4 subtrees around the player
// when calculating collisions, create clones of the trees
// and merge those trees to lower checks with raycasting

const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const unitWidth = 256;
const unitHeight = 256;

const numberOfPoints = 1000;

let points = [];
let quadTree = new QuadTree(
    // keep the bounds square
    new Bounds(0,0,unitWidth, unitHeight),
    "root"
);

quadTree.insert(new Point(1,1))

document.addEventListener("keydown", event => {
    if (event.key == "KeyP") {
        toggleRects = !toggleRects;
    }
    if (event.key == "KeyO") {
        toggleBounds = !toggleBounds;
    }
});

document.addEventListener("keyup", function(event) {

});

const Scale = 4
window.addEventListener("resize", resize)
function resize() {
    canvas.width = canvas.clientWidth * window.devicePixelRatio
    canvas.height = canvas.clientHeight * window.devicePixelRatio
    ctx.canvas.width = canvas.width/Scale
    ctx.canvas.height = canvas.height/Scale
    ctx.imageSmoothingEnabled = false

    quadTree.draw()
}
resize()