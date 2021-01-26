const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const arrow = new Image()
arrow.src="arrow.png"

class Rectangle {
    constructor(x,y,w,h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }
}

// returns a position that a rectangle will have 
// given a rotation about a defined point of rotation
function rotate(rotX, rotY, rectangle, rot) {

    // get center coordinates
    let centerX = rectangle.x + rectangle.w/2
    let centerY = rectangle.y + rectangle.h/2

    let dx = centerX - rotX
    let dy = centerY - rotY
    let rads = (rot / 180) * Math.PI
    let x = (dx * Math.cos(rads)) - (dy * Math.sin(rads))
    let y = (dx * Math.sin(rads)) + (dy * Math.cos(rads))
    x += rotX - rectangle.w/2
    y += rotY - rectangle.h/2
    return {x: x, y: y}
}

let deg2rad = degrees => Math.PI * (degrees / 180)
let rad2deg = radians => (180 * radians) / Math.PI
let rotation = 0
let rect = new Rectangle(13,1,3,3)
function update() {
    ctx.resetTransform()
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height)

    rotate()
    ctx.rect(rect.x-8,rect.y-2,rect.w,rect.h)
    ctx.stroke()

    ctx.moveTo(ctx.canvas.width/2,0)
    ctx.lineTo(ctx.canvas.width/2,ctx.canvas.height)
    ctx.stroke()
    ctx.moveTo(0,ctx.canvas.height/2)
    ctx.lineTo(ctx.canvas.width,ctx.canvas.height/2)
    ctx.stroke()

    ctx.setTransform(
        1,0,0,1, ctx.canvas.width/2, ctx.canvas.height/2
    )
    ctx.rotate(rotation)
    ctx.drawImage(arrow,-8,-2)

    requestAnimationFrame(update)
    rotation += deg2rad(1)
}


update()

window.addEventListener("resize", resize)
function resize() {
    canvas.width = canvas.clientWidth * window.devicePixelRatio
    canvas.height = canvas.clientHeight * window.devicePixelRatio
    ctx.canvas.width = Math.floor(canvas.width/16) % 2 == 1? canvas.width/16 + 1 : canvas.width/16
    ctx.canvas.height = Math.floor(canvas.height/16) % 2 == 1? canvas.height/16 + 1 : canvas.height/16
    ctx.imageSmoothingEnabled = false
}
resize()