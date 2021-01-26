import * as Assets from "./cache.js"
import * as Utils from "./utils.js"
import * as Inventory from "./inventory.js"
import { drawBackgroundUi } from "./ninepatch.js"
import { Coroutine } from "./coroutine.js"
import { View } from "./view.js"

export const socket = io()

// fetch("data/animation.json")
// .then(response => response.json())
// .then(data => data)

export const Mouse = {
	x: 0,
	y: 0
}

const Scale = 4
const GridSize = 16

const preRender = document.getElementById("prerender")
const preRenderCtx = preRender.getContext("2d")
const canvas = document.getElementById("display")
const ctx = canvas.getContext("2d")
const ui = document.getElementById("ui")
const uiCtx = ui.getContext("2d")

let debug = false

let ClientData = {}
let ObjectData = []

let debug1 = document.getElementById("debug1")
let debug2 = document.getElementById("debug2")
let debug3 = document.getElementById("debug3")
let debug4 = document.getElementById("debug4")
let debug5 = document.getElementById("debug5")

socket.on("ClientUpdate", data => {
	ClientData = data
	Inventory.bind(data.inventory)
})

socket.on("update", data => {
	ObjectData = data

	//temp
	data.forEach(object => {
		if(object.id == socket.id) {
			View.follow(object)
		}
	})
});

function main(time) {

	ctx.setTransform(1,0,0,1,0,0)
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

	uiCtx.setTransform(1,0,0,1,0,0)
	uiCtx.clearRect(0, 0, uiCtx.canvas.width, uiCtx.canvas.height)

	Coroutine.step()
	update()
	draw()

	ctx.setTransform(1,0,0,1,0,0)

	drawUi()
	drawDebug()

	requestAnimationFrame(main)

}
requestAnimationFrame(main)

function update() {

}

function draw() {
	// draw background
	//ctx.drawImage(Cache.background.dungeon, -View.x + View.halfWidth - Cache.background.dungeon.width/2, -View.y + View.halfHeight - Cache.background.dungeon.height/2);
	
	// draw objects
	ObjectData.forEach(object => {
		
		let animation = object.animation

		ctx.setTransform(
			animation.flippedX? -1 : 1,
			0,0,
			animation.flippedY? -1 : 1,
			object.x - View.x + View.halfWidth, 
			object.y - View.y + View.halfHeight
		)
		ctx.rotate((animation.rotation / 180) * Math.PI)
		
		if (animation.compOp == "none") {
			// render the sprite normally
			//let sprite = Animation[object.sprite]
			ctx.drawImage(
				Assets.spritesheet[animation.atlas], // Spritesheet to derive from
				animation.frameIndex * animation.frameWidth + animation.frameX, // X Origin in spritesheet
				animation.frameY, // Y Origin in spritesheet
				animation.frameWidth, // Width in spritesheet
				animation.frameHeight, // Height in spritesheet
				-animation.frameWidth/2, // X in canvas
				-animation.frameHeight/2, // Y in canvas
				animation.frameWidth, // Width in canvas
				animation.frameHeight// Height in canvas
			);
		} else {
			// apply global composite operation

			// clear previous sprite
			preRenderCtx.clearRect(0,0,preRenderCtx.canvas.width,preRenderCtx.canvas.height);

			// draw image onto pre-render canvas
			preRenderCtx.drawImage(
				Assets.spritesheet[animation.atlas], // Spritesheet to derive from
				animation.frameIndex * animation.frameWidth + animation.frameX, // X Origin in spritesheet
				animation.frameY, // Y Origin in spritesheet
				animation.frameWidth, // Width
				animation.frameHeight, // Height
				0, // X in canvas
				0, // Y in canvas
				animation.frameWidth, // Width
				animation.frameHeight // Height
			);

			// start operation
			preRenderCtx.globalCompositeOperation = "source-atop";

			preRenderCtx.fillStyle = "rgb(255,0,0,0.75)";
			preRenderCtx.fillRect(0, 0, 16, 16);

			preRenderCtx.globalCompositeOperation = "source-out";
			//end operation
			
			// draw pre-rendered sprite onto main display
			ctx.drawImage(
				preRender, // draw sprite from pre-render
				0, // sprite is at x: 0 
				0, // sprite is at y: 0
				animation.frameWidth, // Width
				animation.frameHeight, // Height
				-animation.frameWidth/2, // X in canvas
				-animation.frameHeight/2, // Y in canvas
				animation.frameWidth, // Width
				animation.frameHeight // Height
			);
		}
	})
}

function drawUi() {
	if (Inventory.open) {
		let data = {

		}
		Inventory.display(uiCtx)
	}
}

// debugging call
function drawDebug() {
	if(debug) {

		debug1.innerText = "View X: " + View.x
		debug2.innerText = "View Y: " + View.y
		debug3.innerText = "Mouse Screen: (" + Mouse.x + ", " + Mouse.y + ")"
		debug4.innerText = "Mouse World: (" + (Mouse.x  + View.x - View.halfWidth) + ", " + (Mouse.y + View.y - View.halfHeight) + ")"

		/*
		for(let h = 0; h < View.halfWidth/GridSize; h++) {
			if(h * GridSize == View.halfHeight) 
				ctx.strokeStyle = "green"
			else 
				ctx.strokeStyle = "black"
			ctx.moveTo(0, h * GridSize)
			ctx.lineTo(View.halfWidth, h * GridSize)
			ctx.stroke();
		}

		for(let v = 0; v < View.halfWidth/GridSize; v++) {
			if(v * GridSize == View.halfWidth) 
				ctx.strokeStyle = "green"
			else 
				ctx.strokeStyle = "black"
			ctx.moveTo(v * GridSize, 0)
			ctx.lineTo(v * GridSize, View.height)
			ctx.stroke();
		}

		ObjectData.forEach( object => {
			ctx.fillStyle = object.hitbox.color;
			ctx.fillRect(
				(object.hitbox.x - View.x) + View.halfWidth,
				(object.hitbox.y - View.y) + View.halfHeight,
				object.hitbox.width, 
				object.hitbox.height
			)
			ctx.fillStyle = "blue";	
			ctx.fillRect(
				(object.colliderHorizontal.x - View.x) + View.halfWidth,
				(object.colliderHorizontal.y - View.y) + View.halfHeight,
				object.colliderHorizontal.width, 
				object.colliderHorizontal.height
			)
			ctx.fillRect(
				(object.colliderVertical.x - View.x) + View.halfWidth,
				(object.colliderVertical.y - View.y) + View.halfHeight,
				object.colliderVertical.width, 
				object.colliderVertical.height
			)
		})
		*/
	}
}

function onMouseClick(x,y) {	
	// attacking - send world space coordinates of mouse click position
	socket.emit("mouseClicked", {x: (x / Scale) + (View.x) - ctx.canvas.width/2 , y: (y / Scale) + (View.y) - ctx.canvas.height/2});

	if (Inventory.open) {
		Inventory.click(uiCtx, x,y)
	}	

	// uses screen coordinates and drawn hitboxes to detect clicks for client side action
	// ObjectData.forEach( object => {
	// 	let bounds = {
	// 		x: object.hitbox.x - View.x + View.halfWidth, 
	// 		y: object.hitbox.y - View.y + View.halfHeight,
	// 		width: object.hitbox.width, 
	// 		height: object.hitbox.height
	// 	};
	// 	if(Utils.contains(bounds, {x: x , y: y})) {
	// 		console.log("Clicked on " + object.name)
	// 		// use flag to stop search
	// 	}
	// })

	//View.shake(40,10)
}

function onMouseMove(x,y) {
	if (Inventory.open) {
		Inventory.hover(uiCtx, x,y)
	}
}

function onKeyPress(key) {
	socket.emit("keyPress", key)

	if(key == "Escape" || key == "KeyI") { 
		Inventory.toggle()
	}

	if (key === "KeyP") debug = !debug;
}

function onKeyHold(keys) {
	socket.emit("keyHeld", keys)
}

const keysLast = {}
const keysHeld = {}

document.addEventListener("mousemove", event => {
	Mouse.x = Math.floor(event.clientX / Scale)
	Mouse.y = Math.floor(event.clientY / Scale)
    onMouseMove(Mouse.x, Mouse.y)
})

document.addEventListener("click", event => {
    onMouseClick(Mouse.x , Mouse.y)
})

document.addEventListener("keydown", event => {
    const key = event.code

    setKeysLast()

    keysHeld[key] = true

    if (isKeyPressed(key)) {
        onKeyPress(key)
    }

    onKeyHold(keysHeld)

})

document.addEventListener("keyup", event => {
    const key = event.code

    setKeysLast()

    keysHeld[key] = false

    onKeyHold(keysHeld)
})

function isKeyPressed(key) {
    return keysHeld[key] && !keysLast[key]
}

function setKeysLast() {
    for (let key in keysHeld) {
        keysLast[key] = keysHeld[key]; 
    }
}

window.addEventListener("resize", resize) 
function resize() {
    canvas.width = canvas.clientWidth * window.devicePixelRatio
    canvas.height = canvas.clientHeight * window.devicePixelRatio

    ctx.canvas.width = canvas.width/Scale
	ctx.canvas.height = canvas.height/Scale
	
	ui.width = ui.clientWidth * window.devicePixelRatio
    ui.height = ui.clientHeight * window.devicePixelRatio

    uiCtx.canvas.width = ui.width/Scale
    uiCtx.canvas.height = ui.height/Scale

    View.setWidth(ctx.canvas.width % 2 == 1? ctx.canvas.width + 1 : ctx.canvas.width)
	View.setHeight(ctx.canvas.height % 2 == 1? ctx.canvas.height + 1 : ctx.canvas.height)
	
	ctx.imageSmoothingEnabled = false;
}
resize()