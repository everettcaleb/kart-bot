!function() {
    var request = require('superagent'),
        cheerio = require('cheerio'),
        LOGIN_URL = 'http://aisjacksonville.clubspeedtiming.com/sp_center/login.aspx',
        CUSTID_REGEX = /\\?CustID=(\d+)/;

    //callback = function(err, $(document))
    function getLoginPage(callback) {
        request
            .get(LOGIN_URL)
            .end(function(err, res) {
                if(err) { callback(err); return; }
                callback(null, cheerio.load(res.text));
            });
    }

    function buildLoginPageData($page, racerName, email) {
        return {
            "__VIEWSTATE": $page('#__VIEWSTATE').val(),
            "__VIEWSTATEGENERATOR": $page('#__VIEWSTATEGENERATOR').val(),
            "__EVENTVALIDATION": $page('#__EVENTVALIDATION').val(),
            "tbxEmail": email || '',
            "tbxRacerName": racerName || '',
            "btnSubmit": 'Submit'
        };
    }

    /*data = {
        "__VIEWSTATE": '',
        "__VIEWSTATEGENERATOR": '',
        "__EVENTVALIDATION": '',
        "tbxEmail": '',
        "tbxRacerName": '',
        "btnSubmit": 'Submit'
    }*/
    //callback = function(err, custId)
    function postLoginPage(data, callback) {
        request
            .post(LOGIN_URL)
            .type('form')
            .redirects(0)
            .send(data)
            .end(function(err, res) {
                if(err && err.status == 302) {
                    callback(null, CUSTID_REGEX.exec(err.response.header.location)[1]);
                }
                else {
                    callback(err);
                }
            });
    }

    module.exports.getLoginPage = getLoginPage;
    module.exports.buildLoginPageData = buildLoginPageData;
    module.exports.postLoginPage = postLoginPage;
}();
