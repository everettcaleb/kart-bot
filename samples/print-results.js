// Prints results of each kartlib call with test data
var kartlib = require('../lib/kartlib.js');

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
        console.log(data);
    });
}

f1();
