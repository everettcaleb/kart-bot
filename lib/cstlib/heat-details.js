"use strict";
!()=>{
    let helpers = require('./helpers.js'),
        dataHelpers = require('./data-helpers.js'),
        HEAT_DETAILS_PAGE_NAME = 'heatdetails.aspx';

    function getPage(id, callback) {
        helpers.getPage(helpers.ROOT_URL, `${HEAT_DETAILS_PAGE_NAME}?HeatNo=${id}`, callback);
    }

    function parsePos(pos) {
        if(pos.indexOf('Winner') >= 0) {
            return 1;
        }
        else {
            return helpers.extractPosition(pos);
        }
    }

    function getHeatDetailsById(id, callback) {
        getPage(id, (err, $) => {
            if(err) {
                callback(err);
            }
            else {
                // Grab racer info (not laps, those come later)
                let racerIdsByName = {},
                    lapsByRacerId = {},
                    lapGroups = null,
                    racers = $('a').map((i, el) => {
                        var custId = helpers.extractCustId(el.attribs.href),
                            row1 = $(el).closest('tr'),
                            row2 = row1.next(),
                            position = '';

                        // top 3 are formatted differently so handle those separately
                        if(!row1.is('.Top3WinnersRow') && !row1.is('.Top3WinnersRowAlt')) {
                            row2 = row1;
                            position = row1.find('.Position').find('span').text();
                        }
                        else {
                            position = parsePos(row1.find('.Position').text());
                        }

                        return {
                            id: custId,
                            name: el.children[0].data,
                            position: position,
                            bestLapTime: row2.find('.BestLap').find('span').text(),
                            lapCount: row2.find('.Laps').find('span').text(),
                            gap: row2.find('.Gap').find('span').text(),
                            averageLapTime: row2.find('.AvgLap').find('span').text()
                        };
                    }).get();

                racers.forEach((r) => {
                    racerIdsByName[r.name] = r.id;
                });

                lapGroups = $('.LapTimes').map((i, el) => {
                    return {
                        racerId: racerIdsByName[$(el).find('th').text()],
                        laps: $(el).find('.LapTimesRow,.LapTimesRowAlt').map((i, iel) => {
                            let lap = helpers.extractLap(iel.children[1].children[0].data);
                            if(lap != null) {
                                return {
                                    id: iel.children[0].children[0].data,
                                    time: lap.time,
                                    position: lap.position
                                };
                            }
                            else {
                                return {
                                    id: iel.children[0].children[0].data
                                };
                            }
                        }).get()
                    };
                }).get();

                lapGroups.forEach((g) => {
                    lapsByRacerId[g.racerId] = g.laps;
                });

                callback(null, {
                    id: id,
                    desc: $('#lblRaceType').text(),
                    winByDesc: $('#lblWinnerBy').text(),
                    date: $('#lblDate').text(),
                    racers: racers.map((r) => {
                        r.laps = lapsByRacerId[r.id];
                        return r;
                    })
                });
            }
        });
    }

    function getHeatDetailsByIdAsHashes(id, callback) {
        getHeatDetailsById(id, (err, data) => {
            let _racers = {},
                _heats = {},
                _heatRacers = {},
                _heatRacerLaps = {};

            if(err) {
                callback(err);
                return;
            }

            _heats[data.id] = {
                id: data.id,
                desc: data.desc.replace('"', "'"),
                winBy: data.winByDesc.replace('"', "'"),
                date: data.date.replace('"', "'")
            };

            data.racers.forEach((racer) => {
                let timeOrLapsGap = helpers.extractTimeOrLapGap(racer.gap.replace('"', "'"))

                _racers[racer.id] = {
                    id: racer.id,
                    name: racer.name,
                    skill: null
                };

                _heatRacers[`${data.id}_${racer.id}`] = {
                    heatId: data.id,
                    racerId: racer.id,
                    position: racer.position,
                    bestLapTime: racer.bestLapTime.replace('"', "'"),
                    gapTime: timeOrLapsGap.time,
                    gapLaps: timeOrLapsGap.laps,
                    lapCount: racer.lapCount.replace('"', "'"),
                    averageLapTime: racer.averageLapTime.replace('"', "'"),
                    skill: null,
                    skillDelta: null,
                    kartNumber: null
                };

                racer.laps && racer.laps.forEach((lap) => {
                    if(!lap['time'] || !lap['position']){
                        return;
                    }

                    _heatRacerLaps[`${data.id}_${racer.id}_${lap.id}`] = {
                        heatId: data.id,
                        racerId: racer.id,
                        id: lap.id,
                        time: lap.time.replace('"', "'"),
                        position: lap.position.replace('"', "'")
                    };
                });
            });

            callback(null, {
                racers: dataHelpers.applyToHash(_racers),
                heats: dataHelpers.applyToHash(_heats),
                heatRacers: dataHelpers.applyToHash(_heatRacers),
                heatRacerLaps: dataHelpers.applyToHash(_heatRacerLaps)
            });
        });
    }

    module.exports.getHeatDetailsById = getHeatDetailsById;
    module.exports.getHeatDetailsByIdAsHashes = getHeatDetailsByIdAsHashes;
}();
