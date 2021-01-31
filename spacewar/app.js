import Projectile from "./projectile.js"
import Spaceship from "./spaceship.js"
import Asteroid from "./asteroid.js"
import Global from "./global.js"
import Coroutine from "./coroutine.js"

const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")

const TwoPi = Math.PI * 2

export const Events = {
    CameraShake: 0,
    Sound: 1,
    queue: [],
    push: function(event) {
        this.queue.push(event)
    },
    execute: function() {

        if (this.queue.length == 0) {
            return
        }

        let event = this.queue.shift()

        if (event.type == this.CameraShake) {
            let duration = event.duration
            let intensity = event.intensity
            View.shake(duration, intensity)
        }

        if(event.type == this.Sound) {
            let soundName = event.sound
            let sound = new Audio()
            sound.src = "./sound/"+soundName
            sound.play()
        }
    }
}

const View = {
    x: 0,
    y: 0,
    shake: function (duration, intensity) {
		let shakeGenerator = function* (duration, intensity) {
			const delta = 20
			let slope = -(1 / duration)
			let root = (-intensity) * (-duration)

			let dx = []
			let dy = []
			
			let amp = intensity
			for(let i = 0; i < root; i += (root/delta)) {
				dx.push(Global.random(-amp, amp))
				amp = (slope * i) + intensity
			}
			amp = intensity;
			for(let i = 0; i < root; i += (root/delta)) {
				dy.push(Global.random(-amp, amp))
				amp = (slope * i) + intensity
			}
			
			for(let i = 0; i < dx.length; i++) {
                View.x += dx[i]
                View.y += dy[i]
				yield
			}
		}
		Coroutine.start(shakeGenerator(duration, intensity))
    }
}

function loadImage(name) {
    return new Promise(resolve => {
        const sprite = new Image()
        sprite.onload = () => {
            resolve(sprite)
        }
        sprite.src = name
    }) 
}

let SpaceshipSprite = null
let ProjectileSprite = null
let AsteroidSprite = null
let Player = null

async function loadAsset() {
    await loadImage("spaceship1.png").then(response => SpaceshipSprite = response)
    await loadImage("projectile.png").then(response => ProjectileSprite = response)
    await loadImage("asteroid1.png").then(response => AsteroidSprite = response)
    init()
}

loadAsset()

const GameObjects = []

function init() {

    for(let i = 0; i < 25; i++) {
        let x = Global.random(-Global.PlayRadius, Global.PlayRadius)
        let y = Global.random(-Global.PlayRadius, Global.PlayRadius)
        let size = Global.randomInt(1,6)
        let aster = new Asteroid(x,y,AsteroidSprite,size, 1)
        GameObjects.push(aster)
    }

    Player = new Spaceship(0,0,SpaceshipSprite)
    GameObjects.push(Player)

    requestAnimationFrame(main)
}

function update() {

    if (Player.x - Global.GameWidth/2 > -Global.PlayRadius && Player.x + Global.GameWidth/2 < Global.PlayRadius) {
        View.x += (Player.x - View.x)/7
    }
    
    if (Player.y - Global.GameHeight/2 > -Global.PlayRadius && Player.y + Global.GameHeight/2 < Global.PlayRadius) {
        View.y += (Player.y - View.y)/7
    }
    


    GameObjects.forEach(object => {
        if (object.active) {

            object.collider.color = "white"

            object.update()

            for (let i in GameObjects) {
                
                let other = GameObjects[i]

                if (other.active && object.id != other.id) {
                    if (object.collider.collides(other.collider)) {
                        object.onCollision(other)
                        object.collider.color = "green"
                    }
                }
            }

            if (!(object instanceof Projectile)) {
                if (object.x - object.radius < -Global.PlayRadius || object.x + object.radius > Global.PlayRadius) {
                    object.dx *= -1
                }

                if (object.y - object.radius < -Global.PlayRadius || object.y + object.radius > Global.PlayRadius) {
                    object.dy *= -1
                }
            }
        }
    })

    Player.onKeyHeld(keysHeld)
}

function draw() {

    GameObjects.forEach(object => {

        if(object.active) {
            context.setTransform(1,0,0,1,object.x - View.x + Global.GameWidth/2,object.y - View.y + Global.GameHeight/2)
            context.rotate(object.rot)
            context.drawImage(object.sprite,-(object.sprite.width * object.size)/2,-(object.sprite.height * object.size)/2,object.sprite.width * object.size,object.sprite.height * object.size)
        
            /*
            context.beginPath()
            context.strokeStyle = object.collider.color
            context.arc(0,0,object.collider.radius,0,TwoPi)
            context.stroke()
            */
        }

    })
    
}

function main(time) {
    context.resetTransform()
    context.clearRect(0,0,context.canvas.width,context.canvas.height)

    Events.execute()
    Coroutine.step()
    update()
    draw()
    
    requestAnimationFrame(main)
}

// input handlers
function onMouseClick(x, y) {
    let pro = new Audio()
    pro.src = "./sound/propulsion.wav"
    pro.loop = true
    pro.play()
}

function onMouseMove(x, y) {

}

function onKeyPress(key) {
    if (key == "Space") {
        Events.push({type: Events.Sound, sound: "laser.wav"})
        GameObjects.push(new Projectile(Player, ProjectileSprite))
    }
}

const keysLast = {}
const keysHeld = {}
const Mouse = {
    x: -1,
    y: -1
}
document.addEventListener("mousemove", event => {
    Mouse.x = event.clientX
    Mouse.y = event.clientY
    onMouseMove(Mouse.x, Mouse.y)
})

document.addEventListener("click", event => {
    onMouseClick(Mouse.x, Mouse.y)
})

document.addEventListener("keydown", event => {
    const key = event.code

    setKeysLast()

    keysHeld[key] = true

    if (isKeyPressed(key)) {
        onKeyPress(key)
    }
})

document.addEventListener("keyup", event => {
    const key = event.code

    setKeysLast()

    keysHeld[key] = false
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

    context.canvas.width = Global.GameWidth
    context.canvas.height = Global.GameHeight

    context.imageSmoothingEnabled = false
}
resize()