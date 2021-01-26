exports.routines = []

exports.start = function (routine) {
        this.routines.push(routine)
    }

exports.step = function() {
        for (let i = 0; i < this.routines.length; i++) {
            if (this.routines[i].next().done) {
                this.routines.splice(i,1)
                i--
            }
        }
    }