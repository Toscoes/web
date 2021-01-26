const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")

window.addEventListener("resize", resize)
function resize() {
    canvas.width = canvas.clientWidth * window.devicePixelRatio
    canvas.height = canvas.clientHeight * window.devicePixelRatio
    context.canvas.width = canvas.width/4
    context.canvas.height = canvas.height/4
}
resize()

line(context, 0,0,100,100,"white")

context.strokeStyle = "white"
context.moveTo(100,0)
context.lineTo(200,100)
context.stroke()

line(context, 100,100,0,200,"white")
line(context,166,233,500,400,"white")

function line(ctx, x1,y1,x2,y2,color) {

    ctx.fillStyle = color

    let rise = y2 - y1
    let run = x2 - x1
    if (run == 0) {
        if (y2 < y1) {
            let temp = y2
            y2 = y1
            y1 = temp
        }
        for (let y = y1; y < y2 + 1; y++) {
            ctx.fillRect(x1,y,1,1)
        }
    } else {
        m = rise / run
        adjust = m >= 0 ? 1 : -1
        offset = 0
        threshold = 0.5
        if (m <= 1 && m >= -1) {
            let delta = Math.abs(m)
            let y = y1
            if (x2 < x1) {
                let temp = x2
                x2 = x1
                x1 = temp
                y = y2
            }
            for (let x = x1; x < x2 + 1; x++) {
                ctx.fillRect(x,y,1,1)
                offset += delta
                if ( offset >= threshold) {
                    y += adjust
                    threshold += 1
                }
            }
        } else {
            let delta = Math.abs(run / rise)
            let x = x1
            if (y2 < y1) {
                let temp = y2
                y2 = y1
                y1 = temp
                x = x2
            }
            for (let y = y1; y < y2 + 1; y++) {
                ctx.fillRect(x,y,1,1)
                offset += delta
                if (offset >= threshold) {
                    x += adjust
                    threshold += 1
                }
            }
        }
    }
}