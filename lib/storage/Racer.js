"use strict";
!()=>{
    class Racer {
        constructor(data) {
            this.id = data.id;
            this.name = data.name.replace("'", "`");
            this.skill = data.skill;
        }

        isComplete() {
            return !!(this.skill);
        }

        merge(racer) {
            if(!!racer.skill) {
                this.skill = racer.skill;
            }
        }
    }

    module.exports = Racer;
}();
