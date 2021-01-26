// particles are defined by object literals, faster than declaing a new instance of an object class

function random(min, max) {
    return (Math.random() * (max - min)) + min;
}

class Emitter {
    constructor(x, y, rate, life, gravity, data) {
        this.x = x;
        this.y = y;
        this.rate = rate;
        this.life = life;
        this.gravity = gravity;

        this.tick = 0;
        this.dx = 0;
        this.dy = 0;
        this.particles = [];
        this.pool = [];
    }

    // returns a newly generated particle or a revived dead particle
    generateParticle() {
        let particle = this.pool.shift();
        if(particle) {
            particle.x = random(this.x - 4, this.x + 4);
            particle.y = this.y;
            particle.r = random(-360, 360);
            particle.dx = 0;
            particle.dy = random(-0.5, -0.1);
            particle.dr = random(-4, 4)
            particle.life = 100;
            this.particles.push(particle);
        } else {
            let newParticle = {
                x: random(this.x - 4, this.x + 4),
                y: this.y,
                r: random(-360, 360),
                dx: 0,
                dy: random(-0.5, -0.1),
                dr: random(-4, 4),
                life: 100
            }
            this.particles.push(newParticle);
        }
    }
    update() {

        // for each particle
        for(let i = 0; i < this.particles.length; i++) {
            let particle = this.particles[i];

            particle.x += particle.dx;
            particle.y += particle.dy;
            particle.r += particle.dr;

            particle.dy += this.gravity? 0.1 : 0;
            particle.life -= 1;
        }

        this.cleanupDeadParticles();

        if (Math.floor(this.tick % 20) == 0) {
            this.generateParticle();
        }

        this.tick += this.rate;
        this.life -= this.life == -1? 0 : 1;
    }

    cleanupDeadParticles() {
        for(let i = 0; i < this.particles.length; i++) {
            let particle = this.particles[i];
            if(particle.life == 0) {
                if(i == 0 ){
                    this.particles.shift();
                } else if (i == this.particles.length - 1) {
                    this.particles.pop();
                } else {
                    let left = this.particles.slice(0, i);
                    let right = this.particles.slice(i + 1, this.particles.length);
                    this.particles = left.concat(right);
                }
                i--;
            }
        }
    }

    destroy() {

    }
}

class Burst {
    constructor(x, y, count, data) {
        this.x = x;
        this.y = y;
        this.particles = [];
    }
    generateParticles(count) {
        for(let i = 0; i < count; i++) {
            this.particles.push({
                x: this.x,
                y: this.y,
                dx: random(-1, 1),
                dy: random(-3, -1),
            });
        }
    }
    draw(ctx, preCtx) {
        for(let i = 0; i < this.particles.length; i++) {
            let particle = this.particles[i];
            ctx.drawImage(
                particles_spritesheet, // Spritesheet to derive from
                0, // X Origin in spritesheet
                0, // Y Origin in spritesheet
                4, // Width
                4, // Height
                Math.floor(particle.x), // X in canvas
                Math.floor(particle.y), // Y in canvas
                4, // Width
                4 // Height
            );
            particle.x += particle.dx;
            particle.y += particle.dy;
            particle.dy += 0.1;
        }
    }
    destroy() {

    }
}