import { displayWidth, displayHeight, Hscale, Vscale } from "./client.js";
import { debugOutput, Ui } from "./cache.js";
import { socket, boundingRect, onClick, onKeyPressed, onMouseMove } from "./client.js";
import { view } from "./view.js";

export const cursor = {
	x: -1,
    y: -1,
    worldX: -1,
    worldY: -1
}

// click listener
document.addEventListener("click", function(event) {
    onClick();
    //view.shake(1, 10);
});

const keys = {
    87: false, // W
    65: false, // A
    83: false, // S
    68: false  // D
}

const keysLast = {
    87: false,
    65: false,
    83: false,
    68: false
}

// onkeydown listener
document.onkeydown = function(event) {
    setKeysLast();

    keys[event.keyCode] = true;

    isKeyPressed(event.keyCode);

    setKeysHeld();
};

// onkeyup listener
document.onkeyup = function(event) {

    setKeysLast();

    keys[event.keyCode] = false;

    setKeysHeld();
};

// mousemove listener
document.addEventListener("mousemove", function(event) {
    cursor.x = event.clientX - boundingRect.left;
    cursor.y = event.clientY - boundingRect.top;
    cursor.worldX = cursor.x + (view.x * Hscale) - displayWidth/2;
    cursor.worldY = cursor.y + (view.y * Vscale) - displayHeight/2;

    debugOutput.output0.innerText = "Window X: " + cursor.x;
    debugOutput.output1.innerText = "Window Y: " + cursor.y;
    debugOutput.output2.innerText = "World X: " + cursor.worldX;
    debugOutput.output3.innerText = "World Y: " + cursor.worldY;

    onMouseMove();
});

function isKeyPressed(key) {
    if (keys[key] && !keysLast[key]) {
        // if key was just pressed and the previously was not pressed
        onKeyPressed(key);
    }
}

function setKeysHeld() {
    let keysHeld = {};
    for(let key in keys) {
        if(keys[key]) {
            keysHeld[key] = 1;
        }
    }
    socket.emit("keyHeld", {inputs: keysHeld});
}

function setKeysLast() {
    for (let key in keys) {
        keysLast[key] = keys[key]; 
    }
}

Ui.main_menu_connect.html.addEventListener("click", function(event) {
    console.log("Connect");
});

Ui.main_menu_create.html.addEventListener("click", function(event) {
    console.log("Create");
});