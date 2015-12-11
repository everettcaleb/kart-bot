"use strict";
!()=>{
    function HeatRacerLap(data) {
        this.heatId = data.heatId;
        this.racerId = data.racerId;
        this.id = data.id;
        this.time = data.time;
        this.position = data.position;
    }

    HeatRacerLap.prototype.isComplete = () => {
        return true;
    };

    module.exports.HeatRacerLap = HeatRacerLap;
}();
