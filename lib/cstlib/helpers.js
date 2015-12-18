"use strict";
!()=>{
    let request = require('superagent'),
        cheerio = require('cheerio'),
        ROOT_URL = 'http://aisjacksonville.clubspeedtiming.com/sp_center/',
        RACE_HISTORY_REGEX = /(.+) - Kart (\d+)/,
        CUSTID_REGEX = /\\?CustID=(\d+)/,
        HEATNO_REGEX = /\\?HeatNo=(\d+)/,
        POS_REGEX = /(\d+)/,
        SKILL_REGEX = /(\d+) \((-?\d+)\)/,
        LAP_REGEX = /(.+) \[(\d+)\]/,
        TIME_REGEX = /[^L]+$/;

    //callback = function(err, callback)
    function getPage(root, path, callback) {
        request
            .get(root + path)
            .end((err, res) => {
                if(err) {
                    callback(err);
                }
                else {
                    callback(null, cheerio.load(res.text));
                }
            });
    }

    function extractRaceHistory(str) {
        let matches = RACE_HISTORY_REGEX.exec(str);
        return {
            desc: matches[1],
            kart: matches[2]
        };
    }

    function extractCustId(url) {
        return CUSTID_REGEX.exec(url)[1];
    }

    function extractHeatNo(url) {
        return HEATNO_REGEX.exec(url)[1];
    }

    function extractPosition(str) {
        return POS_REGEX.exec(str)[1];
    }

    function extractSkill(str) {
        let matches = SKILL_REGEX.exec(str);
        return {
            skill: matches[1],
            skillDelta: matches[2]
        };
    }

    function extractLap(str) {
        let matches = LAP_REGEX.exec(str);
        if (matches) {
            return {
                time: matches[1],
                position: matches[2]
            };
        }
        return null;
    }

    function extractTimeOrLapGap(str) {
        if(str == '-') {
            return {
                time: null,
                laps: null
            };
        }
        if(TIME_REGEX.exec(str)) {
            return {
                time: str,
                laps: null
            };
        }
        else {
            return {
                time: null,
                laps: str.slice(0, -1)
            };
        }
    }

    module.exports.getPage = getPage;
    module.exports.ROOT_URL = ROOT_URL;
    module.exports.extractRaceHistory = extractRaceHistory;
    module.exports.extractCustId = extractCustId;
    module.exports.extractHeatNo = extractHeatNo;
    module.exports.extractPosition = extractPosition;
    module.exports.extractSkill = extractSkill;
    module.exports.extractLap = extractLap;
    module.exports.extractTimeOrLapGap = extractTimeOrLapGap;
}();
