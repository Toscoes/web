export default class Coroutine {

    static routines = []

    static start(routine) {
        this.routines.push(routine)
    }

    static step() {
        for (let i = 0; i < this.routines.length; i++) {
            if (this.routines[i].next().done) {
                this.routines.splice(i,1)
                i--
            }
        }
    }
}