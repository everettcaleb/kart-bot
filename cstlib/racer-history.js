"use strict";
!()=>{
    let helpers = require('./helpers.js'),
        dataHelpers = require('./data-helpers.js'),
        RACER_HISTORY_PAGE_NAME = 'racerhistory.aspx';

    function getPage(id, callback) {
        helpers.getPage(helpers.ROOT_URL, `${RACER_HISTORY_PAGE_NAME}?CustID=${id}`, callback);
    }

    // callback = function(err, data)
    function getRacerHistoryById(id, callback) {
        getPage(id, (err, $) => {
            if(err) {
                callback(err);
            }
            else {
                let hobj = {},
                    heats = $('#Table1').find('a').map((i, el) => {
                        let raceHistory = helpers.extractRaceHistory(el.children[0].data),
                            skill = helpers.extractSkill(el.parent.next.next.children[0].data);

                        return {
                            id: helpers.extractHeatNo(el.attribs.href),
                            kart: raceHistory.kart,
                            desc: raceHistory.desc,
                            date: el.parent.next.children[0].data.trim(),
                            skill: skill.skill,
                            skillDelta: skill.skillDelta,
                            bestTime: el.parent.next.next.next.children[0].data,
                            position: helpers.extractPosition(el.parent.next.next.next.next.children[0].data)
                        };
                    }).get();

                heats.forEach((heat) => {
                    hobj[heat.id] = heat;
                });

                callback(null, {
                    id: id,
                    name: $('#lblRacerName').text(),
                    skill: $('#lblSpeedLimit').text(),
                    heats: hobj
                });
            }
        });
    }

    // callback = function(err, hashes)
    function getRacerHistoryByIdAsHashes(id, callback) {
        getRacerHistoryById(id, (err, data) => {
            let _racers = {},
                _heats = {},
                _heatRacers = {},
                _heatRacerLaps = {},
                heats = [],
                heatRacers = [],
                h = null,
                hid = null,
                racer = {
                    id: data.id,
                    name: data.name.replace('"', "'"),
                    skill: data.skill.replace('"', "'")
                };

            if(err) {
                callback(err);
                return;
            }

            for(hid in data.heats) {
                h = data.heats[hid];
                heats.push({
                    id: h.id.replace('"', "'"),
                    desc: h.desc.replace('"', "'"),
                    winBy: null,
                    date: h.date.replace('"', "'")
                });
                heatRacers.push({
                    heatId: h.id.replace('"', "'"),
                    racerId: data.id,
                    position: h.position.replace('"', "'"),
                    bestLapTime: h.bestTime.replace('"', "'"),
                    gapTime: null,
                    gapLaps: null,
                    lapCount: null,
                    averageLapTime: null,
                    skill: h.skill.replace('"', "'"),
                    skillDelta: h.skillDelta.replace('"', "'"),
                    kartNumber: h.kart.replace('"', "'")
                });
            }

            _racers[racer.id] = racer;
            heats.forEach(function(h) {
                _heats[h.id] = h;
            });
            heatRacers.forEach(function(h) {
                _heatRacers[h.heatId + "_" + h.racerId] = h;
            });

            callback(null, {
                racers: dataHelpers.applyToHash(_racers),
                heats: dataHelpers.applyToHash(_heats),
                heatRacers: dataHelpers.applyToHash(_heatRacers),
                heatRacerLaps: dataHelpers.applyToHash(_heatRacerLaps)
            });
        });
    }

    module.exports.getRacerHistoryById = getRacerHistoryById;
    module.exports.getRacerHistoryByIdAsHashes = getRacerHistoryByIdAsHashes;
}();
