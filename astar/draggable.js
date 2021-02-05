export default function makeDraggable(node) {

    const element = node.htmlElement

    let x = 0
    let y = 0

    element.onmousedown = onDragStart

    function onDragStart(event) {
        x = event.x
        y = event.y
        document.onmouseup = onDragStop
        document.onmousemove = onDrag
    }

    function onDrag(event) {
        let pos1 = x - event.x
        let pos2 = y - event.y
        x = event.x
        y = event.y
        element.style.left = (element.offsetLeft - pos1) + "px"
        element.style.top = (element.offsetTop - pos2) + "px"

        node.x = element.offsetLeft + element.offsetWidth / 2
        node.y = element.offsetTop + element.offsetHeight / 2

        node.edges.forEach( edge => {
            edge.move()
        })
    }

    function onDragStop() {
        document.onmouseup = null
        document.onmousemove = null
    }
}