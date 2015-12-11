"use strict";
!()=>{
    function Racer(data) {
        this.id = data.id;
        this.name = data.name;
        this.skill = data.skill;
    }

    Racer.prototype.isComplete = () => {
        return !!(this.skill);
    };

    Racer.prototype.merge = (racer) => {
        if(!!racer.skill) {
            this.skill = racer.skill;
        }
    };

    module.exports.Racer = Racer;
};
