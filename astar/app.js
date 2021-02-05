import makeDraggable from "./draggable.js"

const canvas = document.querySelector("svg")

canvas.setAttribute("width",  window.innerWidth)
canvas.setAttribute("height", window.innerHeight)

const MainContextMenu = document.querySelector("#main.context-menu")
const NodeContextMenu = document.querySelector("#node.context-menu")

let SelectedNode = 0
let PendingEdge = 0

const Mouse = {
    x: 0,
    y: 0
}

let id = 0
let NodeId = () => id++

const Nodes = []

class Graph {
    constructor() {

    }
}

class NodeHtmlElement {
    constructor() {

        this.id = NodeId()

        // create a new div to represent a node
        const node = document.createElement("div")

        // add the node style class
        node.classList.add("node")
        node.classList.add("no-highlight")

        // display node id
        node.innerText = this.id

        // add it to the document
        document.body.appendChild(node)

        // save a reference to the html element
        this.htmlElement = node

        // record center of node element
        // initial value is set in "contextmenu" of "document"
        this.x = Mouse.x
        this.y = Mouse.y

        // set the position to center the node element at the mouse position
        this.htmlElement.style.left = (this.x - this.htmlElement.offsetWidth/2) + "px"
        this.htmlElement.style.top = (this.y - this.htmlElement.offsetHeight/2) + "px"

        this.edges = []

        // make this node element draggable
        makeDraggable(this)

        // add "contextmenu" listener
        this.htmlElement.addEventListener("contextmenu", event => {
            event.preventDefault()
            
            // clear SelectedNode, PendingEdge, and hide context menus
            clearAction()
            clearContextMenu()
    
            // re-display NodeContextMenu 
            NodeContextMenu.style.display = "block"
            NodeContextMenu.style.left = event.x + "px"
            NodeContextMenu.style.top = event.y + "px"

            // re-assign SelectedNode to this
            SelectedNode = this
    
            // focus event to this element
            event.stopPropagation()
        
            // disable browser context menu
            return false
        })

        this.htmlElement.addEventListener("click", event => {
            event.preventDefault()
            
            if (PendingEdge) {
                // confirm connection

                if (this.id == SelectedNode.id) {
                    console.log("cannot connect edge to itself")
                    return
                }

                for (const edge of this.edges) {
                    if ( (edge.a.id == this.id && edge.b.id == SelectedNode.id) || (edge.a.id == SelectedNode.id && edge.b.id == this.id)) {
                        console.log("edge already exists")
                        return
                    }
                }

                new EdgeHtmlElement(SelectedNode, this)
    
                clearAction()
            }

    
            event.stopPropagation()
        })

        // save reference to real node data
        this.node = new Node()
    }

    delete() {
        this.htmlElement.remove()
        
        this.edges.forEach(edge => {
            edge.delete()
        })

        // instances of EdgeHtmlElement will still live in the other node's edges list

        delete this
    }
}

class EdgeHtmlElement {
    constructor(a, b) {
        
        this.a = a
        this.b = b

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line")

        canvas.appendChild(line)
        line.setAttribute("stroke-width", 5)
        line.setAttribute("stroke", "white")
        line.setAttribute("x1", this.a.x)
        line.setAttribute("y1", this.a.y)
        line.setAttribute("x2", this.b.x)
        line.setAttribute("y2", this.b.y)

        this.line = line

        this.a.edges.push(this)
        this.b.edges.push(this)
    }

    move() {
        this.line.setAttribute("x1", this.a.x)
        this.line.setAttribute("y1", this.a.y)
        this.line.setAttribute("x2", this.b.x)
        this.line.setAttribute("y2", this.b.y)
    }

    delete() {
        this.line.remove()
    }
}

class Node {
    constructor() {

        this.edges = {}
        
    }
}

class Edge {
    constructor() {

    }
}

document.addEventListener("mousemove", event => {
    if (PendingEdge) {
        PendingEdge.setAttribute("x2", event.x)
        PendingEdge.setAttribute("y2", event.y)
    }
})

document.addEventListener("click", event => {
    clearAction()
    clearContextMenu()
})

document.addEventListener("contextmenu", event => {

    event.preventDefault()

    clearAction()
    clearContextMenu()

    MainContextMenu.style.display = "block"
    MainContextMenu.style.left = event.x + "px"
    MainContextMenu.style.top = event.y + "px"

    Mouse.x = event.x
    Mouse.y = event.y

    return false
})

MainContextMenu.querySelector("#add-node").addEventListener("click", event => {
    new NodeHtmlElement()
})

NodeContextMenu.querySelector("#delete").addEventListener("click", event => {
    SelectedNode.delete()
})

NodeContextMenu.querySelector("#connect").addEventListener("click", event => {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line")

    canvas.appendChild(line)
    line.setAttribute("stroke-width", 5)
    line.setAttribute("stroke", "white")
    line.setAttribute("x1", SelectedNode.x)
    line.setAttribute("y1", SelectedNode.y)
    line.setAttribute("x2", SelectedNode.x)
    line.setAttribute("y2", SelectedNode.y)

    PendingEdge = line

    clearContextMenu()
    event.stopPropagation()
})

function clearAction() {

    if (PendingEdge) 
        PendingEdge.remove()

    SelectedNode = null
    PendingEdge = null

}

function clearContextMenu() {
    MainContextMenu.style.display = "none"
    NodeContextMenu.style.display = "none"
}