"use strict";
!()=>{
    class Heat {
        constructor(data) {
            this.id = data.id;
            this.desc = data.desc;
            this.winBy = data.winBy;
            this.date = data.date;
        }

        isComplete() {
            return !!(this.winBy);
        }

        merge(heat) {
            if(!this.winBy) {
                this.winBy = heat.winBy;
            }
        }
    }

    module.exports = Heat;
}();
