const QuadTreeCapacity = 2;
const TwoPi = Math.PI * 2

class Point {
    constructor(x,y,dx,dy) {
        this.x = x
        this.y = y
        this.dx = dx
        this.dy = dy
    }

    update() {
        this.x += this.dx
        this.y += this.dy
    }

    draw() {
        ctx.beginPath()
        ctx.fillStyle = "#39ff14"
        ctx.arc(this.x, this.y, 2, 0, TwoPi)
        ctx.fill()
    }
}

class Bounds {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}

class QuadTree {
    constructor(bounds, name) {
        this.name = name;
        this.bounds = bounds;
        this.points = [];
        this.hasChildren = false;
        this.topLeft = 0;
        this.topRight = 0;
        this.bottomLeft = 0;
        this.bottomRight = 0;
    }
    insert(point) {
        if(this.points.length < QuadTreeCapacity && !this.hasChildren) {
            this.points.push(point);
        } else {
            if(!this.hasChildren) {
                this.hasChildren = true;
                this.divide();
            }
            if (point.x < this.bounds.x + this.bounds.w/2 &&
                point.y < this.bounds.y + this.bounds.h/2) {
                this.topLeft.insert(point);
            
            } else if (point.x >= this.bounds.x + this.bounds.w/2 &&
                point.y < this.bounds.y + this.bounds.h/2) {
                this.topRight.insert(point);
            } else if (point.x < this.bounds.x + this.bounds.w/2 &&
                point.y >= this.bounds.y + this.bounds.h/2) {
                this.bottomLeft.insert(point);
            } else {
                this.bottomRight.insert(point);
            }
        }
    }

    divide() {

        // divide into subtrees
        let topLeftBounds = new Bounds(this.bounds.x, this.bounds.y, this.bounds.w/2, this.bounds.h/2);
        this.topLeft = new QuadTree(topLeftBounds, this.name + "-TL");

        let topRightBounds = new Bounds(this.bounds.x + this.bounds.w/2, this.bounds.y, this.bounds.w/2, this.bounds.h/2);
        this.topRight = new QuadTree(topRightBounds, this.name + "-TR");

        let bottomLeftBounds = new Bounds(this.bounds.x, this.bounds.y + this.bounds.h/2, this.bounds.w/2, this.bounds.h/2);
        this.bottomLeft = new QuadTree(bottomLeftBounds, this.name + "-BL");

        let bottomRightBounds = new Bounds(this.bounds.x + this.bounds.w/2, this.bounds.y + this.bounds.h/2, this.bounds.w/2, this.bounds.h/2);
        this.bottomRight = new QuadTree(bottomRightBounds, this.name + "-BR");

        // redistribute points
        for (let i = 0; i < this.points.length; i++) {
            this.insert(this.points[i]);
        }

        // relinquish reference to points
        this.points = [];
    }

    merge() {
        if(!this.hasChildren) {
            return this.points.length == QuadTreeCapacity;
        } else {

            let topLeftMerged = this.topLeft.merge();
            let topRightMerged = this.topRight.merge();
            let bottomLeftMerged = this.bottomLeft.merge();
            let bottomRightMerged = this.bottomRight.merge();

            if (topLeftMerged && topRightMerged && bottomLeftMerged && bottomRightMerged) {

                // reclaim points from subsections
                this.points = this.points.concat(this.topLeft.points);
                this.topLeft = 0;
                
                this.points = this.points.concat(this.topRight.points);
                this.topRight = 0;
    
                this.points = this.points.concat(this.bottomLeft.points);
                this.bottomLeft = 0;

                this.points = this.points.concat(this.bottomRight.points);
                this.bottomRight = 0;
                
                this.hasChildren = false;
                return true;
            }

            return false;
        }
    }

    sum() {
        if(!this.hasChildren) {
            return this.points.length;
        }
        return this.topLeft.sum() + this.topRight.sum() + this.bottomLeft.sum() + this.bottomRight.sum();
    }

    regrow(points) {

    }

    draw() {
        if(this.hasChildren) {
            this.topLeft.draw();
            this.topRight.draw();
            this.bottomLeft.draw();
            this.bottomRight.draw();
        } else {
            ctx.beginPath();
            ctx.strokeStyle = "white";
            ctx.lineWidth = "1";
            ctx.rect(this.bounds.x, this.bounds.y, this.bounds.w, this.bounds.h);
            ctx.stroke();
        }
    }
}