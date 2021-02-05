import Projectile from "./projectile.js"
import Spaceship from "./spaceship.js"
import Asteroid from "./asteroid.js"
import Global from "./global.js"
import Coroutine from "./coroutine.js"
import GameObject from "./gameobject.js"

const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")

const scoreDisplay = document.getElementById("score-display")
const score = document.getElementById("score")
const gameOver = document.getElementById("game-over")

const TwoPi = Math.PI * 2

const Game = {
    tick: 0,
    asteroids: [],
    createAsteroid: function () {
        
        let octant = Global.randomInt(0,3)
        let x = 0
        let y = 0
        let dx = 0
        let dy = 0
        let size = Global.randomInt(1,5)

        switch(octant) {

            case 0: // top
                x = Global.random(-Global.PlayRadius, Global.PlayRadius)
                y = -Global.PlayRadius - 100
                dx = Global.random(-5,5)
                dy = Global.random(2,4)
            break;

            case 1: //right
                x = Global.PlayRadius + 100
                y = Global.random(-Global.PlayRadius, Global.PlayRadius)
                dx = Global.random(-4,2)
                dy = Global.random(-5,5)
            break;

            case 2: // bottom
                x = Global.random(-Global.PlayRadius, Global.PlayRadius)
                y = Global.PlayRadius + 100
                dx = Global.random(-5,5)
                dy = Global.random(-4,-2)
            break;

            case 3: //left
                x = -Global.PlayRadius - 100
                y = Global.random(-Global.PlayRadius, Global.PlayRadius)
                dx = Global.random(2,4)
                dy = Global.random(-5,5)
            break;
        }

        this.asteroids.push(Asteroid.new(x,y,AsteroidSprite,dx,dy,size))
    },

    objectOutOfBounds: function(object) {
        return object.x < (-Global.PlayRadius - 100) || object.x > (Global.PlayRadius + 100) || object.y > (Global.PlayRadius + 100) || object.y < (-Global.PlayRadius - 100)
    },

    start(initialStart) {
        GameObject.List = []
        Projectile.Instances = []
        Asteroid.Instances = []
        Player = new Spaceship(0,0,SpaceshipSprite)

        initialStart? requestAnimationFrame(main) : null
    }
}
    
export const Events = {
    CameraShake: 0,
    Sound: 1,
    GameOver: 2,
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

        if(event.type == this.GameOver) {
            scoreDisplay.style.display = "none"
            gameOver.style.display = "block"
            gameOver.querySelector("#final-score").innerText = Player.score
            gameOver.querySelector("button").onclick = () => {
                scoreDisplay.style.display = "block"
                gameOver.style.display = "none"
                Game.start(false)
            }
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
    await loadImage("./sprites/spaceship1.png").then(response => SpaceshipSprite = response)
    await loadImage("./sprites/projectile.png").then(response => ProjectileSprite = response)
    await loadImage("./sprites/asteroid1.png").then(response => AsteroidSprite = response)
    Game.start(true)
}

loadAsset()

function update() {

    if (Player.x - Global.GameWidth/2 > -Global.PlayRadius && Player.x + Global.GameWidth/2 < Global.PlayRadius) {
        View.x += (Player.x - View.x)/7
    }
    
    if (Player.y - Global.GameHeight/2 > -Global.PlayRadius && Player.y + Global.GameHeight/2 < Global.PlayRadius) {
        View.y += (Player.y - View.y)/7
    }

    GameObject.List.forEach(object => {
        if (object.active) {

            object.collider.color = "white"

            object.active = !Game.objectOutOfBounds(object)

            object.update()

            for (let i in GameObject.List) {
                
                let other = GameObject.List[i]

                if (other.active && object.id != other.id) {
                    if (object.collider.collides(other.collider)) {
                        object.onCollision(other)
                        object.collider.color = "green"
                    }
                }
            }

            if (object instanceof Spaceship) {

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

    if (Game.tick % 25 == 0) {
        if (Math.random() < .60) {
            Game.createAsteroid()
        }
    }
    Game.tick++

    score.innerText = Player.score
}

function draw() {

    GameObject.List.forEach(object => {

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

}

function onMouseMove(x, y) {

}

function onKeyPress(key) {
    if (key == "Space") {
        Player.shoot(ProjectileSprite)
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