"use strict";
!()=>{
    function Heat(data) {
        this.id = data.id;
        this.desc = data.desc;
        this.winBy = data.winBy;
        this.date = data.date;
    }

    Heat.prototype.isComplete = () => {
        return !!(this.winBy);
    };

    Heat.prototype.merge = (heat) => {
        if(!this.winBy) {
            this.winBy = heat.winBy;
        }
    };

    module.exports.Heat = Heat;
}();
