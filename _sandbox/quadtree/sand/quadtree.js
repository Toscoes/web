const QuadTreeCapacity = 0;

class Point {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = "green";
        ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
        ctx.fill();
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
        if(this.bounds.w == 1 && this.bounds.h == 1 && !this.hasChildren) { // for pixel perfect division
            //bool expression : this.points.length < QuadTreeCapacity
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

        this.points = [];
    }

    merge() {
        if(!this.hasChildren) {
            //return this.points.length == QuadTreeCapacity;
            return (this.bounds.w == 1 && this.bounds.h == 1) && this.points.length == 1; // unit child
        } else {

            let topLeftMerged = this.topLeft.merge();
            let topRightMerged = this.topRight.merge();
            let bottomLeftMerged = this.bottomLeft.merge();
            let bottomRightMerged = this.bottomRight.merge();

            if (topLeftMerged && topRightMerged && bottomLeftMerged && bottomRightMerged) {

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

    query(range) {
        let acc = [];
        if (intersects(this.bounds, range)) {
            if(this.hasChildren) {
                acc = acc.concat(this.topLeft.query(range));
                acc = acc.concat(this.topRight.query(range));
                acc = acc.concat(this.bottomLeft.query(range));
                acc = acc.concat(this.bottomRight.query(range));
                return acc;
            } else {
                return this.points;
            }
        }
    }

    sum() {
        if(!this.hasChildren) {
            return this.points.length;
        }
        return this.topLeft.sum() + this.topRight.sum() + this.bottomLeft.sum() + this.bottomRight.sum();
    }

    draw() {
        if(this.hasChildren) {
            this.topLeft.draw();
            this.topRight.draw();
            this.bottomLeft.draw();
            this.bottomRight.draw();
        } else {
            
            if(toggleRects) {
                ctx.beginPath();
                ctx.strokeStyle = "white";
                ctx.lineWidth = "1";
                ctx.rect(this.bounds.x, this.bounds.y, this.bounds.w, this.bounds.h);
                ctx.stroke();
            }

            if (((this.points.length == 1 && this.bounds.w == 1 && this.bounds.h == 1 ) || // unit child
                (!this.hasChildren && this.points.length > 1)) && // merged child
                toggleBounds) {
                ctx.drawImage((flip == 1? figure2 : figure3),this.bounds.x,this.bounds.y, this.bounds.w, this.bounds.h);
                flip *= -1;
            }  
        }
    }
}

// a and b are rectangles
function intersects(a, b) {
    return  a.x < b.x + b.w &&
            a.x + a.w > b.x &&
            a.y < b.y + b.h &&
            a.y + a.h > b.y
}