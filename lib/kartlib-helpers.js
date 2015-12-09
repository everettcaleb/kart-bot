!function() {
    var request = require('superagent'),
        cheerio = require('cheerio'),
        ROOT_URL = 'http://aisjacksonville.clubspeedtiming.com/sp_center/'
        LOGIN_PAGE_NAME = 'login.aspx',
        RACER_HISTORY_PAGE_NAME = 'racerhistory.aspx',
        HEAT_DETAILS_PAGE_NAME = 'heatdetails.aspx',
        CUSTID_REGEX = /\\?CustID=(\d+)/,
        HEATNO_REGEX = /\\?HeatNo=(\d+)/;

    //callback = function(err, $(document))
    function getLoginPage(callback) {
        request
            .get(ROOT_URL + LOGIN_PAGE_NAME)
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
            .post(ROOT_URL + LOGIN_PAGE_NAME)
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

    //callback = function(err, $(document))
    function getRacerHistoryPage(id, callback) {
        request
            .get(ROOT_URL + RACER_HISTORY_PAGE_NAME + '?CustID=' + id)
            .end(function(err, res) {
                if(err) { callback(err); return; }
                callback(null, cheerio.load(res.text));
            });
    }

    //callback = function(err, $(document))
    function getHeatDetailsPage(id, callback) {
        request
            .get(ROOT_URL + HEAT_DETAILS_PAGE_NAME + '?HeatNo=' + id)
            .end(function(err, res) {
                if(err) { callback(err); return; }
                callback(null, cheerio.load(res.text));
            });
    }

    module.exports.getLoginPage = getLoginPage;
    module.exports.buildLoginPageData = buildLoginPageData;
    module.exports.postLoginPage = postLoginPage;
    module.exports.getRacerHistoryPage = getRacerHistoryPage;
    module.exports.getHeatDetailsPage = getHeatDetailsPage;
}();
