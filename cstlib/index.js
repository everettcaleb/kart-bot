"use strict";
!()=>{
    let login = require('./login.js'),
        racerHistory = require('./racer-history.js'),
        heatDetails = require('./heat-details.js');

    module.exports.login = {
        getIdByName: login.getRacerIdByName,
        getIdByEmail: login.getRacerIdByEmail
    };
    module.exports.racerHistory = {
        getById: racerHistory.getRacerHistoryById,
        getByIdAsHashes: racerHistory.getRacerHistoryByIdAsHashes
    };
    module.exports.heatDetails = {
        getById: heatDetails.getHeatDetailsById,
        getByIdAsHashes: null
    };
}();
