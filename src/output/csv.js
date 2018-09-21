var json2csv = require('json2csv').parse;
var cmd      = require('../cmd');

module.exports = printCsv;

function printCsv(data) {
    var csvData = [].concat(data).reduce(function(o, row){
        Object.keys(row).forEach(function(k){
            row[k] = flattenObject(row[k]);
        });
        o.push(row);
        return o;
    }, []);

    if (csvData.length > 0) console.log(json2csv(csvData));
}

function flattenObject(obj) {
    if (Array.isArray(obj)) {
        return obj.map(flattenObject).join(', ');
    } else if (obj === null || typeof obj === 'undefined') {
        return '';
    } else if (typeof obj === 'object') {
        return JSON.stringify(obj);
    } else {
        return String(obj);
    }
}