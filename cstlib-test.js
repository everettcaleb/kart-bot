var cstlib = require('cstlib');

function f1() {
    console.log('cstlib.login.getIdByName("F4$T3R_486")');
    cstlib.login.getIdByName('F4$T3R_486', function(err, id) {
        console.log(id);
        console.log('');
        f2();
    });
}

function f2() {
    console.log('cstlib.login.getIdByEmail("everettcaleb95@gmail.com")');
    cstlib.login.getIdByEmail('everettcaleb95@gmail.com', function(err, id) {
        console.log(id);
        console.log('');
        f3();
    });
}

function f3() {
    console.log('cstlib.racerHistory.getById(2103578)');
    cstlib.racerHistory.getById(2103578, function(err, data) {
        console.log(JSON.stringify(data));
        console.log('');
        f4();
    });
}

function f4() {
    console.log('cstlib.heatDetails.getById(72964)');
    cstlib.heatDetails.getById(72964, function(err, data) {
        console.log(JSON.stringify(data));
        console.log('');
        f5();
    });
}

function f5() {
    console.log('cstlib.racerHistory.getByIdAsHashes(2103578)');
    cstlib.racerHistory.getByIdAsHashes(2103578, function(err, hashes) {
        console.log(JSON.stringify(hashes));
        console.log('');
        f6();
    });
}

function f6() {
    console.log('cstlib.racerHistory.getByIdAsHashes(2103578).* -> CSV');
    cstlib.racerHistory.getByIdAsHashes(2103578, function(err, hashes) {
        console.log(hashes.racers.toCsv());
        console.log('');
        console.log(hashes.heats.toCsv());
        console.log('');
        console.log(hashes.heatRacers.toCsv());
        console.log('');
        console.log(hashes.heatRacerLaps.toCsv());
        console.log('');
    });
}

f1();
