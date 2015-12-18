"use strict";
!()=>{
    let fs = require('fs'),
        cstlib = require('cstlib'),
        storage = require('storage'),
        taskData = null;

    console.log('==============================');
    console.log('   KART-BOT CLIENT STARTUP');
    console.log('==============================');

    try {
        let taskFile = fs.readFileSync('tasks.js', 'utf8');
        taskData = JSON.parse(taskFile);

        if(!taskData['options']) {
            console.log('No options found in tasks.js, defaults will be used');
        }
        if(!taskData['tasks'] || !taskData.tasks['length']) {
            console.log('No tasks found in tasks.js, exiting...');
            return;
        }
    }
    catch(err) {
        console.error(err);
        console.log('Failed to run KART-BOT CLI, an error occurred.');
    }

    let db = new storage.Database(),
        recursion = taskData.options['recursion'] || 0,
        delay = taskData.options['delay'] || 0,
        commandBuffer = [];

    let commands = {
        racerByName: (data, callback) => {
            cstlib.login.getIdByName(data, (err, id) => {
                if(err) { console.log(err); callback(); return; }

                commands.racerById(id, callback);
            });
        },
        racerByEmail: (data, callback) => {
            cstlib.login.getIdByEmail(data, (err, id) => {
                if(err) { console.log(err); callback(); return; }

                commands.racerById(id, callback);
            });
        },
        racerById: (data, callback) => {
            cstlib.racerHistory.getByIdAsHashes(data, (err, hashes) => {
                if(err) { console.log(err); callback(); return; }

                db.insertRacers(hashes.racers);
                db.insertHeats(hashes.heats);
                db.insertHeatRacers(hashes.heatRacers);
                db.insertHeatRacerLaps(hashes.heatRacerLaps);

                if(recursion > 0) {
                    for(var id in hashes.heats) {
                        commandBuffer.push({ heatById: id });
                    }
                }

                callback();
            });
        },
        heatById: (data, callback) => {
            cstlib.heatDetails.getByIdAsHashes(data, (err, hashes) => {
                if(err) { console.log(err); callback(); return; }

                db.insertRacers(hashes.racers);
                db.insertHeats(hashes.heats);
                db.insertHeatRacers(hashes.heatRacers);
                db.insertHeatRacerLaps(hashes.heatRacerLaps);

                if(recursion > 0) {
                    for(var id in hashes.racers) {
                        commandBuffer.push({ racerById: id });
                    }
                }

                callback();
            });
        }
    }

    function runTasks(tasks) {
        console.log('');
        console.log(`Found ${tasks.length} tasks, recursion of ${recursion}`);

        var i = 0, len = tasks.length;
        runTask(tasks, i, len, () => {
            recursion--;
            db.flush((err) => {
                if(err) {
                    console.error(err);
                    console.log('Failed to flush to DB');
                    return;
                }

                if(commandBuffer.length) {
                    var buf = commandBuffer;
                    commandBuffer = [];
                    runTasks(buf);
                }
            });
        });
    }

    function runTask(tasks, i, len, callback) {
        function next() {
            i++;
            if(i < len) {
                runTask(tasks, i, len, callback);
            }
            else {
                callback();
            }
        }

        var task = tasks[i];
        console.log(`Starting...${i+1} of ${len}`);
        for(var c in commands) {
            if(task[c]) {
                console.log(c);
                commands[c](task[c], () => {
                    console.log(`Finished.${i+1} of ${len}`);
                    next();
                });
                return;
            }
        }
        console.log(`No action could be taken.${i+1} of ${len}`);
        next();
    }

    runTasks(taskData.tasks);
}();
