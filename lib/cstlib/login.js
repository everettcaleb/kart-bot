"use strict";
!()=>{
    let request = require('superagent'),
        cheerio = require('cheerio'),
        helpers = require('./helpers.js'),
        LOGIN_PAGE_NAME = 'login.aspx';

    function build($, racerName, email) {
        return {
            "__VIEWSTATE": $('#__VIEWSTATE').val(),
            "__VIEWSTATEGENERATOR": $('#__VIEWSTATEGENERATOR').val(),
            "__EVENTVALIDATION": $('#__EVENTVALIDATION').val(),
            "tbxEmail": email || '',
            "tbxRacerName": racerName || '',
            "btnSubmit": 'Submit'
        };
    }

    //callback = function(err, custId)
    function post(data, callback) {
        request
            .post(helpers.ROOT_URL + LOGIN_PAGE_NAME)
            .type('form')
            .redirects(0)
            .send(data)
            .end((err, res) => {
                if (err && err.status == 302) {
                    callback(null, helpers.extractCustId(err.response.headers.location));
                }
                else if (err) {
                    callback(err);
                }
                else {
                    callback(`Invalid response: ${res.status} for ${JSON.stringify(data)}\n${res.text}`);
                }
            });
    }

    //callback = function(err, custId)
    function getRacerIdByName(name, callback) {
        helpers.getPage(helpers.ROOT_URL, LOGIN_PAGE_NAME, (err, $) => {
            post(build($, name, null), callback);
        });
    }

    //callback = function(err, custId)
    function getRacerIdByEmail(email, callback) {
        helpers.getPage(helpers.ROOT_URL, LOGIN_PAGE_NAME, (err, $) => {
            post(build($, null, email), callback);
        });
    }

    module.exports.getRacerIdByName = getRacerIdByName;
    module.exports.getRacerIdByEmail = getRacerIdByEmail;
}();
