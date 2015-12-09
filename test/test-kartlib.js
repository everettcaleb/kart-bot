var assert = require('assert'),
    kartlib = require('../lib/kartlib.js');

describe('kartlib', function() {
    describe('findRacerByName', function(){
        it('should return the correct ID', function(done) {
            kartlib.findRacerByName('F4$T3R_486', function(id) {
                assert(id == '2103578');
                done();
            });
        });
    });

    describe('findRacerByEmail', function(){
        it('should return the correct ID', function(done) {
            kartlib.findRacerByEmail('everettcaleb95@gmail.com', function(id) {
                assert(id == '2103578');
                done();
            });
        });
    });
});
