var assert = require('assert'),
    kartlib = require('../lib/kartlib.js');

describe('kartlib', function() {
    describe('findRacerIdByName', function(){
        it('should return the correct ID', function(done) {
            kartlib.findRacerIdByName('F4$T3R_486', function(id) {
                assert(id == '2103578');
                done();
            });
        });
    });

    describe('findRacerIdByEmail', function(){
        it('should return the correct ID', function(done) {
            kartlib.findRacerIdByEmail('everettcaleb95@gmail.com', function(id) {
                assert(id == '2103578');
                done();
            });
        });
    });
});
