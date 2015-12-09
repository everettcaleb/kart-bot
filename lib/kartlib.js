!function() {
    var helpers = require('./kartlib-helpers.js');

    function handleError(err) {
        throw err;
    }

    // callback = function(id)
    function findRacerByName(name, callback) {
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
    function findRacerByEmail(email, callback) {
        helpers.getLoginPage(function(err, $) {
            if(err) { handleError(err); return; }

            var data = helpers.buildLoginPageData($, null, email);

            helpers.postLoginPage(data, function(err, id) {
                if(err) { handleError(err); return; }
                callback(id);
            });
        });
    }

    module.exports.findRacerByEmail = findRacerByEmail;
    module.exports.findRacerByName = findRacerByName;
}();
