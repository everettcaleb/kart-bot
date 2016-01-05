"use strict";
var readline = require('readline'),
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    }),
    cache = require('./cache.js'),
    cstlib = require('cstlib'),
    asy = require('async'),
    commandRegex = /^(clear|exit|help|racer|heat|run|flush)\s?(\d+)?/,
    running = true;

console.log('==============================');
console.log('   KART-BOT CLIENT STARTUP');
console.log('==============================');

var commands = {};

commands.help = function() {
    console.log('Available commands:');
    console.log('clear             - clears the screen');
    console.log('exit              - quits the CLI');
    console.log('flush <recursion> - runs all queued items for the specified number of recursions');
    console.log('heat  <id>        - queues a heat to process');
    console.log('help              - prints help information');
    console.log('racer <id>        - queues a racer to process');
    console.log('run               - runs all queued items');
};

commands.clear = function(unused, callback) {
    process.stdout.write("\u001b[2J\u001b[0;0H");
    callback();
};

commands.exit = function(unused, callback) {
    rl.close();
    process.exit(0);
};

commands.racer = function(id, callback) {
    console.log(`Queueing Racer with ID of ${id}...`);
    cache.queueRacerIds([id], (err) => {
        if(err) {
            console.log('Failed. Error:');
            console.log(err);
        }
        else {
            console.log('Completed.');
        }
        callback();
    });
};

commands.heat = function(id, callback) {
    console.log(`Queueing Heat with ID of ${id}...`);
    cache.queueHeatIds([id], (err) => {
        if(err) {
            console.log('Failed. Error:');
            console.log(err);
        }
        else {
            console.log('Completed.');
        }
        callback();
    });
};

commands.run = function(unused, outerCallback) {
    console.log('Running one iteration...');
    ['Racer', 'Heat'].forEach((type) => {
        cache.reduceIds(type, (err) => {
            if(err) { outerCallback(err); return; }

            function processId(id, callback) {
                var m = type == 'Racer' ? cstlib.racerHistory : cstlib.heatDetails;
                m.getByIdAsHashes(id, (err, results) => {
                    //TODO!!!!!
                });
            }

            function popAndProcess() {
                cache.popId(type, (err, id) => {
                    if(err) { outerCallback(err); }
                    else if(!id) { outerCallback(null); }
                    else {
                        processId(id, (err) => {
                            if(err) { outerCallback(err); }
                            else { popAndProcess(); }
                        });
                    }
                });
            }
            popAndProcess();
        });
    });
};

commands.flush = function(recursion, callback) {
    console.log('flush ' + recursion);
    callback();
};

rl.setPrompt('KARTER CLI > ');
rl.prompt();

rl.on('line', function(line) {
    var cmd = line.match(commandRegex);

    if (!cmd) {
        console.log('Error: Invalid command, use "help" to get a list of valid commands.');
    }

    commands[cmd[1]](cmd.length > 2 ? cmd[2] : null, () => rl.prompt());
}).on('close', function() {
    process.exit(0);
});
