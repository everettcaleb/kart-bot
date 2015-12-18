"use strict";
!()=>{
    class HeatRacerLap {
        constructor(data) {
            this.heatId = data.heatId;
            this.racerId = data.racerId;
            this.id = data.id;
            this.time = data.time;
            this.position = data.position;
        }

        isComplete() {
            return true;
        }

        merge() {
        }
    }

    module.exports = HeatRacerLap;
}();
