function random(min, max) {
    return (Math.random() * (max - min)) + min;
}

export const view = {
	x: -1,
	y: -1,
	setView: function(x, y) {
		this.x = x;
		this.y = y;
	},
	follow: function (target) {
		let dx = (target.x - this.x)/7;
		let dy = (target.y - this.y)/7;
		this.x += dx;
		this.y += dy;
    }, 
    shaker: 0,
    shake: function(duration, intensity) {
        this.shaker = this.initShake(duration, intensity);
    },
	initShake: function* (duration, intensity) {
		const delta = 20;
		let slope = -(1 / duration);
		let root = (-intensity) * (-duration);

		let dx = [];
		let dy = [];
		
		let amp = intensity;
		for(let i = 0; i < root; i += (root/delta)) {
			dx.push(random(-amp, amp));
			amp = (slope * i) + intensity;
		}
		amp = intensity;
		for(let i = 0; i < root; i += (root/delta)) {
			dy.push(random(-amp, amp));
			amp = (slope * i) + intensity;
		}
        
        for(let i = 0; i < dx.length; i++) {
			yield this.translate(dx[i], dy[i]);
		}
    },
    translate: function(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
}
