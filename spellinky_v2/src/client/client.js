import * as Cache from "./cache.js";
import { view } from "./view.js";
import { cursor } from "./event.js";

// display size / unit size = pixel size (4:1)
const unitWidth = 256;
const unitHeight = 160;

const canvas = document.getElementById("display");
const ctx = canvas.getContext("2d");
canvas.style.width = window.innerWidth;
canvas.style.height = window.innerHeight;
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
ctx.imageSmoothingEnabled = false;

const ui = document.getElementById("ui");
const uiCtx = ui.getContext("2d");
ui.style.width = window.innerWidth;
ui.style.height = window.innerHeight;
uiCtx.canvas.width = window.innerWidth;
uiCtx.canvas.height = window.innerHeight;
uiCtx.imageSmoothingEnabled = false;

const preRender = document.getElementById("prerender");
const preRenderCtx = preRender.getContext("2d");
preRenderCtx.imageSmoothingEnabled = false;

export const socket = io();
export let displayWidth = ctx.canvas.width;
export let displayHeight = ctx.canvas.height;
export let Hscale = Math.floor(displayWidth/unitWidth);
export let Vscale = Math.floor(displayHeight/unitHeight);
export let boundingRect = canvas.getBoundingClientRect();

let debug = false;
let compOp = "source-over";
let debugHoveringIndex = -1;

let clientData = {};
let objectData = {};

function loop() {
	resize();
	drawUi();
	update();
	draw();
	debugUpdate();
	requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

function resize() {
	canvas.style.width = window.innerWidth;
	canvas.style.height = window.innerHeight;
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	ui.style.width = window.innerWidth;
	ui.style.height = window.innerHeight;
	uiCtx.canvas.width = window.innerWidth;
	uiCtx.canvas.height = window.innerHeight;

	uiCtx.imageSmoothingEnabled = false;

	displayWidth = ctx.canvas.width;
	displayHeight = ctx.canvas.height;
	Hscale = Math.floor(displayWidth/unitWidth);
	Vscale = Math.floor(displayHeight/unitHeight);
	boundingRect = canvas.getBoundingClientRect();
}

function update() {
	// reset display
	ctx.globalCompositeOperation = "source-over";
	ctx.setTransform(1,0,0,1,0,0);
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);	

	// listen for camera shakes
	if(view.shaker) {
		view.shaker.next();
	}
}

// might want to create a caching function to dynamic cache all the ui elements since document.calls are expensive
function drawUi() {
	uiCtx.clearRect(0, 0, uiCtx.canvas.width, uiCtx.canvas.height);	

	for(let i in Cache.Ui.visibleElements) {
		let element = Cache.Ui[Cache.Ui.visibleElements[i]];
		drawUiBackground(element);
	}
}

socket.on("update", function(data) {
	objectData = data.objectData;
	clientData = data.clientData;
});

function draw() {
	// draw objects
	for(var i = 0 ; i < objectData.length; i++) {
		// get object
		let object = objectData[i];
		
		// get object's animation
		let animation = object.animation;

		// testing
		ctx.setTransform(
			animation.flippedX? -1 : 1,
			0,0,
			animation.flippedY? -1 : 1,
			((object.x - view.x) * Hscale) + displayWidth/2, 
			((object.y - view.y) * Vscale) + displayHeight/2
		); // *

		ctx.rotate((animation.rotation / 180) * Math.PI);
		
		if (animation.compOp == "none" && debugHoveringIndex != i) {
			// render the sprite normally
			ctx.drawImage(
				Cache.spritesheet[animation.atlas], // Spritesheet to derive from
				animation.frameIndex * animation.frameWidth + animation.frameX, // X Origin in spritesheet
				animation.frameY, // Y Origin in spritesheet
				animation.frameWidth, // Width in spritesheet
				animation.frameHeight, // Height in spritesheet
				-(animation.frameWidth * Hscale)/2, // X in canvas
				-(animation.frameHeight * Vscale)/2, // Y in canvas
				animation.frameWidth * Hscale, // Width in canvas
				animation.frameHeight * Vscale// Height in canvas
			);
		} else {
			preRenderCtx.clearRect(0,0,preRenderCtx.canvas.width,preRenderCtx.canvas.height);
			preRenderCtx.drawImage(
				Cache.spritesheet[animation.atlas], // Spritesheet to derive from
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
			preRenderCtx.fillStyle = "rgb(255,255,255,0.25)";
			preRenderCtx.fillRect(0, 0, animation.frameWidth, animation.frameHeight);
			preRenderCtx.globalCompositeOperation = "source-out";
			//end operation
			
			ctx.drawImage(
				preRender, // draw sprite from pre-render
				0, // sprite is at x: 0 
				0, // sprite is at y: 0
				animation.frameWidth, // Width
				animation.frameHeight, // Height
				-(animation.frameWidth * Hscale)/2, // X in canvas
				-(animation.frameHeight * Vscale)/2, // Y in canvas
				animation.frameWidth * Hscale, // Width
				animation.frameHeight * Vscale // Height
			);
		}
	}
}

export function onClick() {	
	console.log("click");
}

export function onMouseMove() {

}

export function onKeyPressed(key) {

	console.log(key);

	if(key == 79) {
		Cache.Ui.show("test_game_state1");
	} else {
		Cache.Ui.hide("test_game_state1");
	}
	/*
	socket.emit("keyPress", {input: key});
	if(key == 73 || key == 27) { 
		// i or esc - open inventory
		openInventory = !openInventory;
		// hide textdisplay
		if(!openInventory) {
			Cache.textdisplay.style.display = "none";
		}
	}
	if(key == 81) {
		// q - pick up item
		for (let i = 0; i < objectData.length; i++) {
			let object = objectData[i];
			if(isColliding(clientData.character.hitbox, object.hitbox) && object.type == "ITEM") {
				socket.emit("pickupItem", {item: object});

				// pick up 1 item at a time
				break;
			}
		}
	}
	if(key == 49) {
		compOp = "source-over";
	}
	if(key == 50) {
		compOp = "source-in";
	}
	if(key == 51) {
		compOp = "source-out";
	}
	if(key == 52) {
		compOp = "source-atop";
	}
	if(key == 53) {
		compOp = "destination-over";
	}
	if(key == 54) {
		compOp = "destination-in";
	}
	if(key == 55) {
		compOp = "destination-out";
	}
	if(key == 56) {
		compOp = "destination-atop";
	}
	if(key == 57) {
		compOp = "lighter";
	}
	if(key == 48) {
		compOp = "copy";
	}
	if(key == 112) {
		compOp = "xor";
	}
	if(key == 113) {
		compOp = "multiply";
	}
	if(key == 114) {
		compOp = "screen";
	}
	if(key == 115) {
		compOp = "overlay";
	}
	if(key == 116) {
		compOp = "darken";
	}
	if(key == 117) {
		compOp = "lighten";
	}
	if(key == 118) {
		compOp = "color-dodge";
	}
	if(key == 119) {
		compOp = "color-burn";
	}
	if(key == 120) {
		compOp = "hard-light";
	}
	if(key == 121) {
		compOp = "soft-light";
	}
	if(key == 122) {
		compOp = "difference";
	}
	if(key == 37) {
		compOp = "hue";
	}
	if(key == 38) {
		compOp = "saturation";
	}
	if(key == 39) {
		compOp = "color";
	}
	if(key == 40) {
		compOp = "luminosity";
	}
	if (key === 80) {
		debug = !debug;
		if (debug) {
			Cache.debugOutput.show();
		} else {
			Cache.debugOutput.hide();
			debugHoveringIndex = -1;
			Cache.Ui.textOnHover.style.display = "none";
		}
	}
		*/
}

let gridUnit = 64;
// debugging call
function debugUpdate() {
	if(debug) {
		ctx.setTransform(1,0,0,1,0,0);
		drawQuadTree(map.quadtree);

		for(let h = 0; h < displayWidth/gridUnit; h++) {
			ctx.beginPath();
			if(h * gridUnit == displayHeight/2) 
				ctx.strokeStyle = "red";
			else 
				ctx.strokeStyle = "white";
			ctx.moveTo(0, h * gridUnit);
			ctx.lineTo(displayWidth, h * gridUnit);
			ctx.stroke(); 
		}

		for(let v = 0; v < displayWidth/gridUnit; v++) {
			ctx.beginPath();
			if(v * gridUnit == displayWidth/2) 
				ctx.strokeStyle = "red";
			else 
				ctx.strokeStyle = "white";
			ctx.moveTo(v * gridUnit, 0);
			ctx.lineTo(v * gridUnit, displayHeight);
			ctx.stroke(); 
		}
		for(let i = 0; i < objectData.length; i++) {
			let object = objectData[i];

			ctx.strokeStyle = object.hitbox.color;
			ctx.beginPath();
			ctx.rect(
				((object.hitbox.x - view.x) * Hscale) + displayWidth/2,
				((object.hitbox.y - view.y) * Vscale) + displayHeight/2,
				object.hitbox.width * Hscale, 
				object.hitbox.height * Vscale
			);
			ctx.stroke();
			
			ctx.fillStyle = "blue";	
			ctx.beginPath();
			ctx.fillRect(
				((object.colliderHorizontal.x - view.x) * Hscale) + displayWidth/2, 
				((object.colliderHorizontal.y - view.y) * Vscale) + displayHeight/2, 
				object.colliderHorizontal.width * Hscale, 
				object.colliderHorizontal.height * Vscale
			);
			ctx.stroke();

			ctx.beginPath();
			ctx.fillRect(
				((object.colliderVertical.x - view.x) * Hscale) + displayWidth/2,
				((object.colliderVertical.y - view.y) * Vscale) + displayHeight/2,
				object.colliderVertical.width * Hscale, 
				object.colliderVertical.height * Vscale
			);
			ctx.stroke();
		}
	}
}

// assuming no element to draw is smaller than the background image
function drawUiBackground(uiElement) {

	let bg = uiElement.tags.bg;
	let backgroundData = Cache.nineslice[bg];

	let rect = uiElement.html.getBoundingClientRect()
	let x = rect.x;
	let y = rect.y;
	let width = rect.width;
	let height = rect.height;

	let left = backgroundData.left * Hscale;
	let right = backgroundData.right * Hscale;
	let top = backgroundData.top * Vscale;
	let bottom = backgroundData.bottom * Vscale;

	// draw TOP LEFT CORNER
	uiCtx.drawImage(
		backgroundData.base,
		0, // x in sprite
		0, // y in sprite
		backgroundData.left, // width in sprite,
		backgroundData.top, // height in sprite
		x, // x in canvas
		y, // y in canvas
		left, // width in canvas
		top // height in canvas
	);
	
	// draw TOP BORDER
	uiCtx.drawImage(
		backgroundData.base,
		backgroundData.left,
		0,
		backgroundData.left,
		backgroundData.top,
		(x + left),
		y,
		width - (left * 2), // subtract width of 2 corners assuming top left and right corners are equal width
		top
	);

	// draw TOP RIGHT CORNER
	uiCtx.drawImage(
		backgroundData.base,
		backgroundData.right,
		0,
		backgroundData.left,
		backgroundData.top,
		x + width - left,
		y,
		left,
		top
	);

	// draw LEFT BORDER
	uiCtx.drawImage(
		backgroundData.base,
		0,
		backgroundData.top,
		backgroundData.left,
		backgroundData.top,
		x,
		y + top,
		left,
		height - (top * 2)
	);

	// draw BODY
	// already implemented to work with varying grid sizes
	uiCtx.drawImage(
		backgroundData.base,
		backgroundData.left,
		backgroundData.top,
		backgroundData.right - backgroundData.left,
		backgroundData.bottom - backgroundData.top,
		x + left,
		y + top,
		width - (left + (backgroundData.base.width * Hscale) - right),
		height - (top + (backgroundData.base.height * Vscale) - bottom)
	);

	// draw RIGHT BORDER 
	uiCtx.drawImage(
		backgroundData.base,
		backgroundData.right,
		backgroundData.top,
		backgroundData.left,
		backgroundData.top,
		x + width - left,
		y + top,
		left,
		height - (top * 2)
	);

	// draw BOTTOM LEFT corner
	uiCtx.drawImage(
		backgroundData.base,
		0,
		backgroundData.bottom,
		backgroundData.left,
		backgroundData.top,
		x,
		y + height - top,
		left,
		top
	);

	// draw BOTTOM BORDER
	uiCtx.drawImage(
		backgroundData.base,
		backgroundData.left,
		backgroundData.bottom,
		backgroundData.left,
		backgroundData.top,
		x + left,
		y + height - top,
		width - (left * 2),
		top
	);

	// draw BOTTOM RIGHT CORNER
	uiCtx.drawImage(
		backgroundData.base,
		backgroundData.right,
		backgroundData.bottom,
		backgroundData.left,
		backgroundData.top,
		x + width - left,
		y + height - top,
		left,
		top
	);
}

function isColliding(a, b) {
	return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function contains(collider, point) {
	return (collider.x * Hscale) <= point.x && point.x <= (collider.x + collider.width) * Hscale && (collider.y * Vscale) <= point.y && point.y <= (collider.y + collider.height) * Vscale;
}