"use strict";
!()=>{
    let redis = require('redis'),
        client = redis.createClient(),
        asy = require('async');

    //========================================
    // CORE FUNCTIONS
    //========================================

    // Pushes the provided ids into a "working queue" in Redis named ${type}WorkingQueue.
    // callback = function(err)
    function queueIds(type, ids, callback) {
        asy.map(ids, client.sadd.bind(client, `${type}WorkingQueue`), callback);
    }

    // Copies all ids not in the main collection into the final queue in Redis named ${type}Queue.
    // callback = function(err)
    function reduceIds(type, callback) {
        client.sdiffstore(`${type}Queue`, `${type}WorkingQueue`, `${type}s`, err => {
            if(err) { callback(err); }
            else {
                client.del(`${type}WorkingQueue`, callback);
            }
        });
    }

    // Pops an id from the final queue in Redis named ${type}Queue.
    // callback = function(err, id)
    function popId(type, callback) {
        client.spop(`${type}Queue`, callback);
    }

    // Stores an id and object in the main collection named ${type}s and ${type}${id}
    // callback = function(err)
    function store(type, id, data, callback) {
        client.sadd(`${type}s`, id, (err) => {
            if(err) {
                callback(err);
                return;
            }

            client.set(`${type}${id}`, data, (err2) => {
                if(err) {
                    callback(err);
                }
                else {
                    callback(null);
                }
            });
        });
    }

    // Retrieves an object from main collection by ID
    // callback = function(err, obj)
    function retrieve(type, id, callback) {
        client.get(`${type}${id}`, (err, result) => {
            if(err) {
                callback(err);
                return;
            }

            callback(null, result);
        });
    }

    //========================================
    // MODULE BINDINGS
    //========================================

    let types = [
        'Racer',
        'Heat',
        'HeatRacer',
        'HeatRacerLap'
    ];

    module.exports['queueIds'] = queueIds;
    module.exports['reduceIds'] = reduceIds;
    module.exports['popId'] = popId;
    module.exports['store'] = store;

    types.map(type => {
        module.exports[`queue${type}Ids`] = queueIds.bind(null, type);
        module.exports[`reduce${type}Ids`] = reduceIds.bind(null, type);
        module.exports[`pop${type}Id`] = popId.bind(null, type);
        module.exports[`store${type}`] = store.bind(null, type);
    });
}();
