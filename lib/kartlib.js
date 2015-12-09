!function() {
    var helpers = require('./kartlib-helpers.js');

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

    module.exports.findRacerIdByEmail = findRacerIdByEmail;
    module.exports.findRacerIdByName = findRacerIdByName;
}();
