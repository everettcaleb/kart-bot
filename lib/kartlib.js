!function() {
    var helpers = require('./kartlib-helpers.js'),
        RACE_HISTORY_REGEX = /(.+) - Kart (\d+)/,
        CUSTID_REGEX = /\\?CustID=(\d+)/,
        HEATNO_REGEX = /\\?HeatNo=(\d+)/
        POS_REGEX = /(\d+)/
        SKILL_REGEX = /(\d+) \((-?\d+)\)/;

    function handleError(err) {
        throw err;
    }

    // callback = function(id)
    function findRacerIdByName(name, callback) {
        helpers.getLoginPage(function(err, $) {
            if(err) { handleError(err); return; }

            var data = helpers.buildLoginPageData($, name, null);

            helpers.postLoginPage(data, function(err, id) {
                if(err) { handleError(err); return; }
                callback(id);
            });
        });
    }

    // callback = function(id)
    function findRacerIdByEmail(email, callback) {
        helpers.getLoginPage(function(err, $) {
            if(err) { handleError(err); return; }

            var data = helpers.buildLoginPageData($, null, email);

            helpers.postLoginPage(data, function(err, id) {
                if(err) { handleError(err); return; }
                callback(id);
            });
        });
    }

    // callback = function(data)
    function getRacerHistoryById(id, callback) {
        helpers.getRacerHistoryPage(id, function(err, $) {
            if(err) { handleError(err); return; }

            var heats = $('#Table1').find('a').map(function(i, el) {
                var parsedText = RACE_HISTORY_REGEX.exec(el.children[0].data),
                    parsedSkill = SKILL_REGEX.exec(el.parent.next.next.children[0].data);

                return {
                    id: HEATNO_REGEX.exec(el.attribs.href)[1],
                    kart: parsedText[2],
                    desc: parsedText[1],
                    date: el.parent.next.children[0].data.trim(),
                    skill: parsedSkill[1],
                    skillDelta: parsedSkill[2],
                    bestTime: el.parent.next.next.next.children[0].data,
                    position: POS_REGEX.exec(el.parent.next.next.next.next.children[0].data)[1]
                };
            }).get(), hobj = {};

            heats.forEach(function(heat) {
                hobj[heat.id] = heat;
            });

            callback({
                id: id,
                name: $('#lblRacerName').text(),
                skill: $('#lblSpeedLimit').text(),
                heats: hobj
            });
        });
    }

    // callback = function(data)
    function getHeatById(id, callback) {
        throw 'TODO!!!';
    }

    module.exports.findRacerIdByEmail = findRacerIdByEmail;
    module.exports.findRacerIdByName = findRacerIdByName;
    module.exports.getRacerHistoryById = getRacerHistoryById;
}();
