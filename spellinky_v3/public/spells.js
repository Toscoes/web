import { drawBackgroundUi } from "./ninepatch.js"   
    
export let open = true

const Inventory = document.getElementById("spells")

const BackgroundCanvas = Inventory.getElementsByClassName("background")[0]
const BackgroundContext = BackgroundCanvas.getContext("2d")

const ItemInfo = document.getElementById("item-info")

const SelectedItemCanvas = document.getElementById("selected-item")
const SelectedItemContext = SelectedItemCanvas.getContext("2d")

function loadSpritesheet(src) {
    return new Promise((resolve, reject) => {
        let img = new Image()
        img.onload = () => resolve(img)
        img.src = src
    })
}

let Spritesheet = []
let SpriteData = []
let ItemData = []

const Background = {
    left: 8,
    top: 8,
    right: 16,
    bottom: 16
}

class Item {
    constructor(id) {
        let data = ItemData[id]
        this.id = id
        this.name = data.name
        this.type = data.type
        this.description = data.description
        this.sprite = SpriteData[id]
    }
}

class Slot {
    constructor(canvas, ctx) {
        this.item = 0
        this.canvas = canvas
        this.context = ctx
        this.count = 0
    }

    setItem(item) {
        this.item = item
        this.drawItem()
    }

    // draws the stored item in this slot 
    drawItem() {
        this.context.clearRect(0,0,this.context.canvas.width,this.context.canvas.height)
        if (this.item) {
            this.context.drawImage(
                Spritesheet,
                this.item.sprite.x, this.item.sprite.y, this.item.sprite.width, this.item.sprite.height, 
                // could either set this to same dimensions as sprite, or preset
                0,0,this.item.sprite.width, this.item.sprite.height, 
            )
        }
    }

    removeItem() {
        this.item = null
        this.drawItem()
    }
}

const Items = []
const Slots = []
const NumberSlots = 7

let SelectedSlotIndex = -1

async function loadAssets() {
    await loadSpritesheet("ninepatch1.png")
    .then(spritesheet => {
        Spritesheet = spritesheet
        Background.sprite = spritesheet
    })
    init()
}
loadAssets()

function init() {

    SelectedItemContext.canvas.width = 16
    SelectedItemContext.canvas.height = 16

    const SlotsHtml = Inventory.querySelector("#spell-slots")

    for(let i = 0; i < NumberSlots; i++) {

        let canvas = document.createElement("canvas")
        addClickEventListener(canvas, i)
        addHoverEventListener(canvas, i)
    
        let context = canvas.getContext("2d")
        context.canvas.width = 16
        context.canvas.height = 16

        let slot = new Slot(canvas,context)

        Slots.push(slot)
        SlotsHtml.append(canvas)
    }

    BackgroundContext.canvas.width = BackgroundCanvas.clientWidth/4
    BackgroundContext.canvas.height = BackgroundCanvas.clientHeight/4
    drawBackgroundUi(BackgroundContext,0,0,BackgroundContext.canvas.width, BackgroundContext.canvas.height, Background)

}

function addClickEventListener(element, index) {
    element.addEventListener("click", event => {
        let slot = Slots[index]
        let hasItem = false

        if (SelectedSlotIndex == -1 && slot.item) {
            getSelectedItem(index)
            hasItem = true
        }

        if (SelectedSlotIndex != -1) {

            let item = Slots[SelectedSlotIndex].item

            console.log(item.type)

            swap(index, SelectedSlotIndex)
            if(!hasItem) {
                clearSelectedItem() 
            }
        }
    })
}

function addHoverEventListener(element, index) {
    element.addEventListener("mousemove", event => {
        let slot = Slots[index]
        slot.context.fillStyle = "rgba(255,255,255,0.4)"
        slot.context.clearRect(0,0,64,64)
        slot.drawItem()
        slot.context.fillRect(0,0,64,64)
        displayItemInfo(slot)

    })
    element.addEventListener("mouseout", event => {
        let slot = Slots[index]
        slot.context.clearRect(0,0,64,64)
        slot.drawItem()
        ItemInfo.style.display = "none"
    })
}

export function mouseClick(x,y) {
    if (!open) {
        return
    }

    // if outside of the ui and item is selected - drop item
    SelectedItemCanvas.style.left = (x - 64) + "px"
    SelectedItemCanvas.style.top = (y - 64) + "px"

    let InventoryBoundingRect = Inventory.getBoundingClientRect()
    if (x < InventoryBoundingRect.left || x > InventoryBoundingRect.right || y < InventoryBoundingRect.top || y > InventoryBoundingRect.bottom && SelectedSlotIndex != -1) {
        drop(SelectedSlotIndex)
    }
}

export function mouseMove(x,y) {
    if (!open) {
        return
    }

    SelectedItemCanvas.style.left = (x - 64) + "px"
    SelectedItemCanvas.style.top = (y - 64) + "px"
}

function displayItemInfo(slot) {
    if (slot.item) {
        ItemInfo.style.display = "initial"
        ItemInfo.style.left = (event.x + 8)  + "px"
        ItemInfo.style.top = (event.y - ItemInfo.clientHeight - 8) + "px"
        ItemInfo.innerHTML = slot.item.name + "<br>" + slot.item.description
    }
}

function drop(index) {
    let slot  = Slots[index]
    slot.removeItem()
    clearSelectedItem()
}

function equip(slot, item) {

}

// adds an item into the first available inventory slot
function addItem(item) {
    let inserted = false
    Slots.forEach((slot, i) => {
        if (!slot.item && !inserted) {
            inserted = true
            slot.setItem(item)
        }
    })
}


// index a, index b
function swap(a, b) {
    let slotA = Slots[a]
    let slotB = Slots[b]
    let itemA = slotA.item
    let itemB = slotB.item
    slotA.setItem(itemB)
    slotB.setItem(itemA)
}

function getSelectedItem(index) {
    SelectedItemCanvas.style.display = "inital"
    SelectedItemContext.clearRect(0,0,16,16)
    SelectedSlotIndex = index
    const item = Slots[index].item
    SelectedItemContext.drawImage(
        Spritesheet,
        item.sprite.x, item.sprite.y, item.sprite.width, item.sprite.height, 
        // could either set this to same dimensions as sprite, or preset
        0,0,item.sprite.width, item.sprite.height, 
    )
}

function clearSelectedItem() {
    SelectedItemCanvas.style.display = "none"
    SelectedSlotIndex = -1
    SelectedItemContext.clearRect(0,0,16,16)
}

function redraw() {
    Slots.forEach((slot, i) => {
        slot.drawItem()
    })
}

function addSlot() {

}