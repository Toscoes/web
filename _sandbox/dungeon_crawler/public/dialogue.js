import { Coroutine } from "./coroutine.js"
import { drawBackgroundUi } from "./ninepatch.js"

const Dialogue = document.getElementById("dialogue")

const BackgroundCanvas = Dialogue.getElementsByClassName("background")[0]
const BackgroundContext = BackgroundCanvas.getContext("2d")

const Text = Dialogue.querySelector(".body #text")
const Next = Dialogue.querySelector(".body #next")
const Responses = Dialogue.querySelector(".body #responses")

const Background = {
    left: 8,
    top: 8,
    right: 16,
    bottom: 16
}

function loadSpritesheet(src) {
    return new Promise((resolve, reject) => {
        let img = new Image()
        img.onload = () => resolve(img)
        img.src = src
    })
}

async function loadAssets() {

    await fetch("data/sample_dialogue.json")
    .then(response => response.json())
    .then(data => CurrentDialogue = data)

    await loadSpritesheet("assets/dialogue_bg.png")
    .then(spritesheet => {
        Background.sprite = spritesheet
    })
}
loadAssets()

let CurrentDialogue = []
let nextNode = ""
let skip = false
let end = false


function addClickEventListener(element, next) {
    element.addEventListener("click", event => {
        parseNode(CurrentDialogue[next])
    })
}

function addHoverEventListener(element) {
    element.addEventListener("mouseover", event => {
        element.style.color = "yellow"
    })
    element.addEventListener("mouseout", event => {
        element.style.color = "white"
    })
}

function parseNode(node) {

    if (node.end) {
        end = true
    }

    Dialogue.style.display = "initial"
    Responses.innerHTML = ""
    Next.style.display = "initial"

    skip = false
    nextNode = node.next? node.next : false

    let text = node.text
    let responses = node.responses

    let stringer = function* (text, responses, end) {
        let full = text
        let part = ""
        let i = 0
        while (part != full && !skip) {
            part += full[i]
            Text.innerText = part

            BackgroundContext.canvas.width = BackgroundCanvas.clientWidth/4
            BackgroundContext.canvas.height = BackgroundCanvas.clientHeight/4
            drawBackgroundUi(BackgroundContext,0,0,BackgroundContext.canvas.width, BackgroundContext.canvas.height, Background)

            yield i++
        }

        Text.innerText = full

        BackgroundContext.canvas.width = BackgroundCanvas.clientWidth/4
        BackgroundContext.canvas.height = BackgroundCanvas.clientHeight/4
        drawBackgroundUi(BackgroundContext,0,0,BackgroundContext.canvas.width, BackgroundContext.canvas.height, Background)

        if (!responses) {
            skip = true
            Next.style.display = "initial"
        } else {
            Next.style.display = "none"
            responses.forEach( response => {
                const ResponseElement = document.createElement("div")
                ResponseElement.innerText = " > " + response.text
                addClickEventListener(ResponseElement, response.next)
                addHoverEventListener(ResponseElement)
                Responses.append(ResponseElement)

                BackgroundContext.canvas.width = BackgroundCanvas.clientWidth/4
                BackgroundContext.canvas.height = BackgroundCanvas.clientHeight/4
                drawBackgroundUi(BackgroundContext,0,0,BackgroundContext.canvas.width, BackgroundContext.canvas.height, Background)
            })
        }

    }
    let generator = stringer(text, responses)
    Coroutine.start(generator)
}

export function next() {
    if (!skip) {
        skip = true
    } else if (nextNode) {
        parseNode(CurrentDialogue[nextNode])
    } else if (end) {
        end = false
        Dialogue.style.display = "none"
    }
}

export function initiate(dialogueId) {
    //CurrentDialogue = DialogueFile[id]
    parseNode(CurrentDialogue["node1"])
}