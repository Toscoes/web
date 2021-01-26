import * as Utils from "./utils.js"
import { Coroutine } from "./coroutine.js"

export const View = {
	x: 0,
	y: 0,
	width: 0,
	height: 0,
	halfWidth: 0,
	halfHeight: 0,
	setWidth: function (width) {
		this.width = width
		this.halfWidth = width/2
	},
	setHeight: function (height) {
		this.height = height
		this.halfHeight = height/2
	},
	follow: function (target) {
		let dx = (target.x - this.x)/2;
		let dy = (target.y - this.y)/2;
		this.x += dx;
		this.y += dy;
	}, 
	translate: function(dx, dy) {
        this.x += dx;
        this.y += dy;
    },
	shake: function (duration, intensity) {
		let shakeGenerator = function* (duration, intensity) {
			const delta = 20
			let slope = -(1 / duration)
			let root = (-intensity) * (-duration)

			let dx = []
			let dy = []
			
			let amp = intensity
			for(let i = 0; i < root; i += (root/delta)) {
				dx.push(Utils.random(-amp, amp))
				amp = (slope * i) + intensity
			}
			amp = intensity;
			for(let i = 0; i < root; i += (root/delta)) {
				dy.push(Utils.random(-amp, amp))
				amp = (slope * i) + intensity
			}
			
			for(let i = 0; i < dx.length; i++) {
				yield View.translate(dx[i], dy[i])
			}
		}
		Coroutine.start(shakeGenerator(duration, intensity))
    }
}
