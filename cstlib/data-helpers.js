"use strict";
!()=>{
    let COMMA_REGEX = /^,+$/,
        BLANK = {};

    function isFunction(f) {
        return f && BLANK.toString.call(f) === '[object Function]';
    }

    function objectToArray(obj) {
        let a = [],
            f = null;

        for(f in obj) {
            if(!isFunction(obj[f])) {
                a.push(obj[f]);
            }
        }

        return a;
    }

    function hashesAsArrays(hashCollection) {
        let o = {},
            f = null;

        for(f in hashCollection) {
            o[f] = objectToArray(hashCollection[f]);
        }

        return o;
    }

    function arrayToCsv(array) {
        let fields = {},
            f = null,
            csv = '';

        // build the fields
        array.forEach((row) => {
            for(f in row) {
                fields[f] = true;
            }
        });

        // build the header row
        for(f in fields) {
            csv += `"${f.replace('"', "'")}",`
        }
        csv = `${csv.slice(0, -1)}`;

        // build and return data
        return [csv].concat(array
            .map((row) => {
                let csvr = '';
                if(row) {
                    for(f in fields) {
                        if(row[f]) {
                            csvr += `"${row[f].toString().replace('"', "'")}",`;
                        }
                        else {
                            csvr += ',';
                        }
                    }
                    if(COMMA_REGEX.exec(csvr)){
                        return null;
                    }
                    return `${csvr.slice(0, -1)}`;
                }
                return null;
            }).filter((row) => { return row != null; })
        ).join('\r\n');
    }

    function applyToHash(hash) {
        hash.toArray = objectToArray.bind(null, hash);
        hash.toCsv = () => {
            return arrayToCsv(hash.toArray());
        }
        return hash;
    }

    module.exports.objectToArray = objectToArray;
    module.exports.hashesAsArrays = hashesAsArrays;
    module.exports.arrayToCsv = arrayToCsv;
    module.exports.applyToHash = applyToHash;
}();
