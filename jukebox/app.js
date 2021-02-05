const play = document.getElementById("play")
const pause = document.getElementById("pause")

const display = document.querySelector("canvas")
const displayContext = display.getContext("2d")
const audioContext = new AudioContext()
const analyser = audioContext.createAnalyser()
analyser.fftSize = 1024
const audio = document.getElementById("source")
const source = audioContext.createMediaElementSource(audio)
source.connect(analyser).connect(audioContext.destination)

let data = new Uint8Array(analyser.frequencyBinCount)

play.addEventListener("click", e => {
    audio.play()
})

pause.addEventListener("click", e => {
    audio.pause();
    audio.currentTime = 0;
    audio.play();   
})

async function setupContext() {
    if (audioContext.state == "suspended") {
        await audioContext.resume()
    }
}
setupContext()

let throwaway = 256
function draw() {
    requestAnimationFrame(draw)
    displayContext.clearRect(0,0,displayContext.canvas.width,displayContext.canvas.height)
    analyser.getByteFrequencyData(data)
    
    /*
    let space = displayContext.canvas.width / (data.length - throwaway);
    data.forEach((e, i) => {
        let y = e / 255 * displayContext.canvas.height / 2
        let x = space*i
        displayContext.fillStyle = "hsl("+y/displayContext.canvas.height * 400+",100%,50%)"
        displayContext.fillRect(x,displayContext.canvas.height-y,space,y);
    })
    */

    /*
    let radius = 0
    data.forEach((e, i) => {
        if (i < data.length - throwaway) {
            radius += e
        }
    })
    radius = radius/(data.length - throwaway)
    */
   
    radius = 200

    displayContext.beginPath()
    displayContext.strokeStyle = "#F1F1F1"
    displayContext.arc(display.width/2,display.height/2,radius,0,Math.PI*2,false)
    displayContext.stroke()

    let dr = (Math.PI * 2) / (data.length - throwaway)
    let lastX = 0
    let lastY = 0
    data.forEach((e, i) => {
        if (i < data.length - throwaway) {
            let cos = Math.cos(dr*i)
            let sin = Math.sin(dr*i)

            let x1 = display.width/2 + cos * radius
            let y1 = display.height/2 + sin * radius
            let x2 = x1 + (cos * e)
            let y2 = y1 + (sin * e)
            displayContext.beginPath()
            displayContext.strokeStyle = "hsl("+y2/displayContext.canvas.height * 400+",100%,50%)"
            displayContext.moveTo(x1,y1)
            displayContext.lineTo(x2,y2)
            displayContext.stroke()

            /*
            if (lastX == 0 && lastY == 0) {
                lastX = x1 + (cos * e)/2
                lastY = y1 + (sin * e)/2
            } else {

                let currX = x1 + (cos * e)/2
                let currY = y1 + (sin * e)/2

                displayContext.beginPath()
                displayContext.strokeStyle = "hsl("+y2/displayContext.canvas.height * 400+",100%,50%)"
                displayContext.moveTo(lastX,lastY)
                displayContext.lineTo(currX,currY)
                displayContext.stroke()

                lastX = currX
                lastY = currY
            }
            */
        }
    })

    /*
    let midline = 0
    data.forEach((e, i) => {
        if (i < data.length - throwaway) {
            midline += e
        }
    })
    midline = midline/(data.length - throwaway)

    const displayHeight = displayContext.canvas.height 
    let space = displayContext.canvas.width / (data.length - throwaway);
    data.forEach((e, i) => {
        if (lastX == 0 && lastY == 0) {
            lastX = space * i
            lastY = displayHeight / 2 - ((e / 255) * 400) + midline
        } else {

            let currX = space * i
            let currY = displayHeight / 2 - ((e / 255) * 400) + midline

            displayContext.beginPath()
            displayContext.strokeStyle = "hsl("+currY/displayContext.canvas.height * 400+",100%,50%)"
            displayContext.moveTo(lastX,lastY)
            displayContext.lineTo(currX,currY)
            displayContext.stroke()

            lastX = currX
            lastY = currY
        }
    })
    */
}
draw()

window.addEventListener("resize", resize)
function resize() {
    display.width = display.clientWidth * window.devicePixelRatio
    display.height = display.clientHeight * window.devicePixelRatio
}
resize()