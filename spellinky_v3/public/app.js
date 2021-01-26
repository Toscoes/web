// imports
import { drawBackgroundUi } from "./ninepatch.js"

// input
const gameCode = document.getElementById("game-code")
const name = document.getElementById("name")

// buttons
const create = document.getElementById("create")
const play = document.getElementById("play")

// screens
const menu = document.getElementById("menu")
const select = document.getElementById("select")
const game = document.getElementById("game")

const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")

const CardContainer = document.getElementById("player-cards")
const Card = document.querySelector("#card-markup").text

// connection
const socket = io()

// ======= test vars ======= //
const bg = new Image()
bg.onload = () => {
    bgData.sprite = bg
    testAdd("Tosco")
    testAdd("Mike")
    testAdd("Evan")
    testAdd("Bsim")
}
bg.src = "./ninepatch1.png"
const bgData = {
    top: 8,
    left: 8,
    right: 16,
    bottom: 16
}

// update
function update(dt) {

}

function draw() {
    context.clearRect(0,0,context.canvas.width,context.canvas.height)
}

// main loop
let then = 0
function main(t) {
    let now = t * 0.001
    let dt = Math.min(0.1, now - then)
    then = now

    update(dt)
    draw()

    requestAnimationFrame(main)
}
requestAnimationFrame(main)

// ======= socket listerners ======= //
socket.on("join", data => {
    setScreen("select")
})

socket.on("update", game => {
    let players = game.players
    displayPlayers(players)
})

// ======= listeners ======= //
create.addEventListener("click", event => {
    const username = name.value
    socket.emit("create", {name: username})
})

play.addEventListener("click", event => {
    const username = name.value
    socket.emit("play", {name: username})
})

window.addEventListener("mousemove", event => {
    //x = event.clientX
    //y = event.clientY
})

window.addEventListener("resize", resize)

// ======= utilities ======= //
function displayPlayers(players) {
    
    CardContainer.innerHTML = ""

    players.forEach( player => {

        let card = document.createElement("div")
        card.id = player.id
        card.innerHTML = Card
        const Background = card.querySelector(".background")
        const BackgroundContext = Background.getContext("2d")

        const PlayerName = card.querySelector(".player-name")

        const Prev = card.querySelector(".prev")
        const Next = card.querySelector(".next")

        CardContainer.append(card)

        if (player.id == socket.id) {
            // bind event listeners
            addClickListener(Prev, "prev")
            addClickListener(Next, "next")
        }

        // draw background last
        BackgroundContext.canvas.width = Background.clientWidth/4
        BackgroundContext.canvas.height = Background.clientHeight/4
        drawBackgroundUi(BackgroundContext, 0,0,BackgroundContext.canvas.width, BackgroundContext.canvas.height, bgData)
    })
}

function testAdd(id) {
    let card = document.createElement("div")
    card.id = id
    card.classList.add("player-card")
    card.innerHTML = Card

    const Background = card.querySelector(".background")
    const BackgroundContext = Background.getContext("2d")

    const PlayerName = card.querySelector(".player-name")
    PlayerName.innerText = id

    const Prev = card.querySelector(".prev")
    const Next = card.querySelector(".next")

    CardContainer.append(card)

    if (id == "Tosco") {
        // bind event listeners
        addClickListener(Prev, "prev - " + id)
        addClickListener(Next, "next - " + id)
    }

    // draw background last
    BackgroundContext.canvas.width = Background.clientWidth/4
    BackgroundContext.canvas.height = Background.clientHeight/4
    drawBackgroundUi(BackgroundContext, 0,0,BackgroundContext.canvas.width, BackgroundContext.canvas.height, bgData)
}

function addPlate() {
    
}


function addClickListener(element, s) {
    element.addEventListener("click", event => {
        console.log(s)
    })
}

function setScreen(screen) {

    menu.style.display = "none"
    select.style.display = "none"
    game.style.display = "none"

    if (screen == "menu") {
        menu.style.display = "initial"
    } else if (screen == "select") {
        select.style.display = "initial"
    } else if (screen == "game") {
        game.style.display = "initial"
    }
}

function resize() {
    canvas.width = canvas.clientWidth * window.devicePixelRatio
    canvas.height = canvas.clientHeight * window.devicePixelRatio

    context.canvas.width = canvas.width
    context.canvas.height = canvas.height
}
resize()