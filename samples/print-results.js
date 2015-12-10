// Prints results of each kartlib call with test data
var kartlib = require('../lib/kartlib.js'),
    kls = require('../lib/kartlib-storage.js');

function f1() {
    console.log('kartlib.findRacerIdByName("F4$T3R_486")');
    kartlib.findRacerIdByName('F4$T3R_486', function(id) {
        console.log(id);
        console.log('');
        f2();
    });
}

function f2() {
    console.log('kartlib.findRacerIdByEmail("everettcaleb95@gmail.com")');
    kartlib.findRacerIdByEmail('everettcaleb95@gmail.com', function(id) {
        console.log(id);
        console.log('');
        f3();
    });
}

function f3() {
    console.log('kartlib.getRacerHistoryById(2103578)');
    kartlib.getRacerHistoryById(2103578, function(data) {
        console.log(JSON.stringify(data));
        console.log('');
        f4();
    });
}

function f4() {
    console.log('kartlib.getHeatDetailsById(72964)');
    kartlib.getHeatDetailsById(72964, function(data) {
        console.log(JSON.stringify(data));
        f5();
    });
}

function f5() {
    console.log('storage csv');
    kartlib.getRacerHistoryById(2103578, function(data) {
        kls.insertRacerHistory(data);
        var csv = kls.getDataAsCsv();
        console.log(csv.racers);
        console.log('');
        console.log(csv.heats);
        console.log('');
        console.log(csv.heatRacers);
    });
}

f5();
