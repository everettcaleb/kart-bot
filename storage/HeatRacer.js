"use strict";
!()=>{
    function HeatRacer(data) {
        this.heatId = data.heatId;
        this.racerId = data.racerId;
        this.position = data.position;
        this.bestLapTime = data.bestLapTime;
        this.gapTime = data.gapTime;
        this.gapLaps = data.gapLaps;
        this.lapCount = data.lapCount;
        this.averageLapTime = data.averageLapTime;
        this.skill = data.skill;
        this.skillDelta = data.skillDelta;
        this.kartNumber = data.kartNumber;
    }

    HeatRacer.prototype.isComplete = () => {
        return !!this.lapCount && !!this.averageLapTime && !!this.kartNumber;
    };

    HeatRacer.prototype.merge = (heatRacer) => {
        if(!this.lapCount) {
            this.gapTime = heatRacer.gapTime;
            this.gapLaps = heatRacer.gapLaps;
            this.lapCount = heatRacer.lapCount;
            this.averageLapTime = heatRacer.averageLapTime;
        }
        if(!this.kartNumber) {
            this.skill = heatRacer.skill;
            this.skillDelta = heatRacer.skillDelta;
            this.kartNumber = heatRacer.kartNumber;
        }
    };

    module.exports.HeatRacer = HeatRacer;
}();
