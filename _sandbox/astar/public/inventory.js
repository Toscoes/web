import { drawBackgroundUi } from "./ninepatch.js"   
    
export let open = true

const Inventory = document.getElementById("inventory")

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

const ArmorSlot = 36
const WeaponSlot = 37
const Ring1Slot = 38
const Ring2Slot = 39

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
const NumberSlots = 36

let SelectedSlotIndex = -1

async function loadAssets() {
    await fetch("./data/spritedata_item.json")
    .then(response => response.json())
    .then(data => SpriteData = data)

    await fetch("./data/item_data.json")
    .then(response => response.json())
    .then(data => ItemData = data)

    await loadSpritesheet("assets/spritesheet_inventory.png")
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

    BackgroundContext.canvas.width = BackgroundCanvas.clientWidth/4
    BackgroundContext.canvas.height = BackgroundCanvas.clientHeight/4
    drawBackgroundUi(BackgroundContext,0,0,BackgroundContext.canvas.width, BackgroundContext.canvas.height, Background)

    const SlotsHtml = Inventory.querySelector("#item-slots")

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

    // initialize armor 
    let EquipmentSlot = document.getElementById("armor")
    let context = EquipmentSlot.getContext("2d")
    context.canvas.width = 16
    context.canvas.height = 16
    addClickEventListener(EquipmentSlot, ArmorSlot)
    addHoverEventListener(EquipmentSlot, ArmorSlot)
    let slot = new Slot(EquipmentSlot, context)
    Slots[ArmorSlot] = slot

    EquipmentSlot = document.getElementById("weapon")
    context = EquipmentSlot.getContext("2d")
    context.canvas.width = 16
    context.canvas.height = 16
    addClickEventListener(EquipmentSlot, WeaponSlot)
    addHoverEventListener(EquipmentSlot, WeaponSlot)
    slot = new Slot(EquipmentSlot, context)
    Slots[WeaponSlot] = slot

    EquipmentSlot = document.getElementById("ring1")
    context = EquipmentSlot.getContext("2d")
    context.canvas.width = 16
    context.canvas.height = 16
    addClickEventListener(EquipmentSlot, Ring1Slot)
    addHoverEventListener(EquipmentSlot, Ring1Slot)
    slot = new Slot(EquipmentSlot, context)
    Slots[Ring1Slot] = slot

    EquipmentSlot = document.getElementById("ring2")
    context = EquipmentSlot.getContext("2d")
    context.canvas.width = 16
    context.canvas.height = 16
    addClickEventListener(EquipmentSlot, Ring2Slot)
    addHoverEventListener(EquipmentSlot, Ring2Slot)
    slot = new Slot(EquipmentSlot, context)
    Slots[Ring2Slot] = slot

    addItem(new Item("shortsword"))
    addItem(new Item("chainmail"))
    addItem(new Item("potion"))
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

export function toggle() {
    open = !open
    Inventory.style.display = open? "initial" : "none"
    if(!open) {
        ItemInfo.style.display = "none"
        clearSelectedItem()
    }
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