import * as Utils from "./utils.js"
import * as Assets from "./cache.js"
import { socket, Mouse } from "./app.js"
import { drawBackgroundUi } from "./ninepatch.js"   
    
export let open = false

const ItemInfo = document.createElement("div")
document.body.appendChild(ItemInfo)

const Spritesheet = new Image()
Spritesheet.src = "assets/sprites/spritesheet_inventory.png"

const Background = {
    sprite: Spritesheet,
    left: 8,
    top: 8,
    right: 16,
    bottom: 16
}

const GridSize = 16

// const variables
const rows = 4
const cols = 9
const padding = 4
const spacing = 0

// client variables
let inventoryWidth = 0
let inventoryHeight = 0

let SelectedItem = -1
let Items = []

export function bind(inventory) {
    Items = inventory
}
    
export function display(ctx) {

    const Origin = {x: Math.floor(ctx.canvas.width/2), y: Math.floor(ctx.canvas.height/2)}

    inventoryWidth = ((cols - 1) * spacing) + (cols * GridSize) + (padding * 2);
    inventoryHeight = ((rows - 1) * spacing) + (rows * GridSize) + (padding * 2);

    drawBackgroundUi(ctx, Origin.x, Origin.y, inventoryWidth, inventoryHeight, Background, true)

    // draw inventory item slot
    for(let i = 0; i < cols * rows; i++) {
        let col = i % cols
        let row = Math.floor(i / cols)
        ctx.drawImage(
            Spritesheet,
            32,
            0,
            GridSize,
            GridSize,
            (Origin.x - inventoryWidth/2) + (col * GridSize) + (col * spacing) + padding,
            (Origin.y - inventoryHeight/2) + (row * GridSize) + (row * spacing) + padding,
            GridSize,
            GridSize
        )
    }

    // draw iventory item (if it has an item)
    Items.forEach((item, i) => {
        let col = i % cols
        let row = Math.floor(i / cols)
        if (item && SelectedItem != i) {
            ctx.drawImage(
                Assets.spritesheet.items,
                item.animation.frameX,
                item.animation.frameY,
                item.animation.frameWidth,
                item.animation.frameHeight,
                (Origin.x - inventoryWidth/2) + (col * GridSize) + (col * spacing) + padding,
                (Origin.y - inventoryHeight/2) + (row * GridSize) + (row * spacing) + padding,
                GridSize,
                GridSize
            ) 
        }
    })

    // draw selected item where mouse is on screen
    if (SelectedItem != -1) {
        let item = Items[SelectedItem]
        console.log(item.name)
        ctx.drawImage(
            Assets.spritesheet.items,
            item.animation.frameX,
            item.animation.frameY,
            item.animation.frameWidth,
            item.animation.frameHeight,
            Mouse.x - item.animation.frameWidth/2 ,
            Mouse.y - item.animation.frameHeight/2 ,
            GridSize,
            GridSize 
        )
    }
}	

export function click(ctx, x,y) {

    const Origin = {x: Math.floor(ctx.canvas.width/2), y: Math.floor(ctx.canvas.height/2)}

	let itemSelected = false;
	for(let i = 0; i < cols * rows; i++) {
		let item = Items[i];
		let col = i % cols;
		let row = Math.floor(i / cols);
		let slot = {
			x: (Origin.x - inventoryWidth/2) + (col * 16) + (col * spacing) + padding, // temp hardcoded values
			y: (Origin.y - inventoryHeight/2) + (row * 16) + (row * spacing) + padding, // temp hardcoded values
			width: 16,
			height: 16
        }

		if(item && Utils.contains(slot, {x: x, y: y})) {
			if(SelectedItem == i) {
				// if clicking on the same slot
				// return the item to the slot
				SelectedItem = -1;
			} else if (SelectedItem == -1) {
				// if clicking on a occupied slot with no item currently selected
				// select the item
				SelectedItem = i;
			} else if (SelectedItem != -1) {
				// if clicking on an empty slot while having an item selected
                // change the index of the item in inventory
                console.log(SelectedItem + " " + i)
				socket.emit("swapItem", {from: SelectedItem, to: i});
				if(!item) {
					// if there is an item at that slot, 'moveItem' will have swapped the
					// indices of the two items, so set the selected index to 'from'
					SelectedItem = -1;
				}
			}
			itemSelected = true;
		}
	}

	if(SelectedItem != -1) {
		let inventoryBounds = {
			x: Origin.x - inventoryWidth/2,
			y: (Origin.y - inventoryHeight/2),
			width: inventoryWidth,
			height: inventoryHeight
		}
		if(!Utils.contains(inventoryBounds, {x: x, y: y})) {
            socket.emit("dropItem", SelectedItem);
		}
	}

	if (!itemSelected) SelectedItem = -1;
}
    
export function hover(ctx, x,y) {

    const Origin = {x: Math.floor(ctx.canvas.width/2), y: Math.floor(ctx.canvas.height/2)}

    let found = false
    Items.forEach((item, i) => {

        let col = i % cols
        let row = Math.floor(i / cols)
        let slot = {
            x: (Origin.x - inventoryWidth/2) + (col * 16) + (col * spacing) + padding, // temp hardcoded values
            y: (Origin.y - inventoryHeight/2) + (row * 16) + (row * spacing) + padding, // temp hardcoded values
            width: 16,
            height: 16
        }
        if(Utils.contains(slot, {x: x, y: y}) && item) {
            ItemInfo.style.display = "initial";
            ItemInfo.style.position = "absolute";
            ItemInfo.style.left = x * 4 + "px";
            ItemInfo.style.top = y * 4 + "px";
            ItemInfo.innerText = item.name + "<br>" + "An item.";
            found = true
        }
    })

    if (!found) {
        ItemInfo.style.display = "none";
    }
}

export function toggle() {
    open = !open
    if(!open) {
        ItemInfo.style.display = "none"
        SelectedItem = -1
    }
}

function drop() {

}

function swap() {

}