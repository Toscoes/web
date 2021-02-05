const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const World = {
    width: 1200,
    height: 900
}

ctx.canvas.width = World.width;
ctx.canvas.height = World.height;

const numberOfPoints = 1000;

const Points = [];

const random = (min, max) => (Math.random() * (max - min + 1) + min)

function init() {
    for(let i = 0; i < numberOfPoints; i++) {
        let point = new Point(
            Math.random() * ctx.canvas.width,
            Math.random() * ctx.canvas.height,
            random(-2,2),
            random(-2,2)
        );
        Points[i] = point
    }
}

function update() {
    ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);

    let quadTree = new QuadTree(
        // keep the bounds square
        new Bounds(0,0,World.width, World.height),
        "root"
    );

    Points.forEach(point => {
        if (point.x + point.dx < 0 || point.x + point.dx > World.width) {
            point.dx *= -1
        }
        if (point.y + point.dy < 0 || point.y + point.dy > World.height) {
            point.dy *= -1
        }
        point.update()
        point.draw()

        quadTree.insert(point)
    })

    quadTree.draw();

    requestAnimationFrame(update)
}

init()
requestAnimationFrame(update)

window.addEventListener("resize", resize)
function resize() {
    canvas.width = canvas.clientWidth * window.devicePixelRatio
    canvas.height = canvas.clientHeight * window.devicePixelRatio
    ctx.imageSmoothingEnabled = false
}
resize()