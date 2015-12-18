"use strict";
!()=>{
    var pg = require('pg').native,
        squel = require('squel'),
        Heat = require('./Heat.js'),
        HeatRacer = require('./HeatRacer.js'),
        HeatRacerLap = require('./HeatRacerLap.js'),
        Racer = require('./Racer.js'),
        BLANK = {},
        connString = "postgres://kartbot:password@localhost/kartbot";

    function validate(f, obj) {
        return parseInt(f) && (
               obj instanceof Racer ||
               obj instanceof Heat ||
               obj instanceof HeatRacer ||
               obj instanceof HeatRacerLap);
    }

    function objectToArray(obj) {
        let a = [],
            f = null;

        for(f in obj) {
            if(validate(f, obj[f])) {
                a.push(JSON.parse(JSON.stringify(obj[f])));
            }
        }

        return a;
    }

    class Database {
        constructor() {
            this.caches = {
                Racers: {},
                Heats: {},
                HeatRacers: {},
                HeatRacerLaps: {}
            };
        }

        insertRacers(hash) {
            let cache = this.caches.Racers,
                id = null;

            for(id in hash) {
                if(cache[id]) {
                    cache[id].merge(hash[id]);
                }
                else {
                    cache[id] = new Racer(hash[id]);
                }
            }
        }

        insertHeats(hash) {
            let cache = this.caches.Heats,
                id = null;

            for(id in hash) {
                if(cache[id]) {
                    cache[id].merge(hash[id]);
                }
                else {
                    cache[id] = new Heat(hash[id]);
                }
            }
        }

        insertHeatRacers(hash) {
            let cache = this.caches.HeatRacers,
                id = null;

            for(id in hash) {
                if(cache[id]) {
                    cache[id].merge(hash[id]);
                }
                else {
                    cache[id] = new HeatRacer(hash[id]);
                }
            }
        }

        insertHeatRacerLaps(hash) {
            let cache = this.caches.HeatRacerLaps,
                id = null;

            for(id in hash) {
                if(cache[id]) {
                    cache[id].merge(hash[id]);
                }
                else {
                    cache[id] = new HeatRacerLap(hash[id]);
                }
            }
        }

        flush(callback) {
            let self = this;
            pg.connect(connString, (err, client, done) => {
                let queryText = '',
                    cacheName = null,
                    cache = null,
                    array = null,
                    handleError = (err) => {
                        if(!err) { return false; }
                        if(client) { done(client); }
                        callback(err);
                    };

                for(cacheName in self.caches) {
                    array = objectToArray(self.caches[cacheName]);

                    if(array.length > 0) {
                        queryText += squel.insert({ autoQuoteTableNames: true, autoQuoteFieldNames: true, nameQuoteCharacter: '"' })
                            .into(cacheName)
                            .setFieldsRows(array)
                            .toString();

                        queryText += ';\n';
                    }
                }

                if(queryText.length > 0) {
                    client.query(queryText, (err, result) => {
                        if(!handleError(err)) {
                            self.caches = {
                                Racers: {},
                                Heats: {},
                                HeatRacers: {},
                                HeatRacerLaps: {}
                            };
                            done(client);
                            callback(null);
                        }
                    });
                }
                else {
                    if(client){ done(client); }
                    callback(null);
                }
            });
        };
    }

    module.exports = Database;
}();
