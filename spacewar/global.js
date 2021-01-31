

export default {
    HalfPi: Math.PI / 180,
    Half360: 180 / Math.PI,
    deg2Rad: function(degrees) {
        return this.HalfPi * degrees
    },
    rad2Deg: function(radians) {
        return radians * this.Half360
    },
    degrees2Points: function(x1,y1,x2,y2) { 
        return this.rad2Deg(Math.atan2(y2- y1, x2 - x1)) 
    },
    radians2Points: function(x1,y1,x2,y2) { 
        return Math.atan2(y2- y1, x2 - x1) 
    },
    random: function (min, max) { 
        return (Math.random() * (max - min + 1)) + min 
    },
    randomInt: function (min, max) { 
        return Math.floor((Math.random() * (max - min + 1)) + min) 
    },
    GameWidth: 900,
    GameHeight: 450,
    Epsilon: 0.01,
    Deg90: -Math.PI/4,
    PlayRadius: 600,
    Decel: 0.95,
}