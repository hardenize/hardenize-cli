var cmd   = require('../cmd');
var color = require('cli-color');
var table = require('table').table;

module.exports = printTable;

function printTable(data) {

    var isList = Array.isArray(data);

    data = isList ? getTableArray(data) : getTableObject(data);

    var tableConfig = {
        columns: {},
        border: {
            topBody:    '─', topJoin:    '┬', topLeft:    '┌', topRight:    '┐',
            bottomBody: '─', bottomJoin: '┴', bottomLeft: '└', bottomRight: '┘',
            bodyLeft:   '│', bodyRight:  '│', bodyJoin:   '│',
            joinBody:   '─', joinLeft:   '├', joinRight:  '┤', joinJoin:    '┼',
        },
    };

    data.forEach(function(row){
        row.forEach(function(col, n){
            var width = Math.min(col.length, 64);
            if (!tableConfig.columns[n]) tableConfig.columns[n] = { width: width };
            tableConfig.columns[n].width = Math.max(tableConfig.columns[n].width, width);
        });
    });

    fixupTableHeaders(data, isList);

    if (Object.keys(tableConfig.columns).length === 0) return;

    console.log(table(data, tableConfig).replace(/[\r\n]+$/, ''));
}

function getTableArray(data) {

    var cols = Object.keys([].concat(data).reduce(function(o, row){
        Object.keys(row).forEach(function(k){
            var value = row[k];
            if (value === null || typeof value === 'undefined' || value === '') return;
            o[k] = true;
        });
        return o;
    }, {}));
    cols = tableSortColumns(cols);

    var rows = [].concat(data).reduce(function(o, oldRow){
        var newRow = [];
        cols.forEach(function(name){
            newRow.push(flattenObject(oldRow[name]));
        });
        o.push(newRow);
        return o;
    }, []);

    return [cols].concat(rows);
}

function getTableObject(data) {

    var cols = tableSortColumns(Object.keys(data));

    return cols.reduce(function(o, title){
        var value = data[title];
        if (value === null || typeof value === 'undefined' || value === '') return o;
        o.push([ title, flattenObject(data[title]) ]);
        return o;
    }, []);
}

function fixupTableHeaders(data, isList) {
    if (isList) {
        if (data.length) data[0] = data[0].map(function(col){
            return fixupTableHeader(col);
        });
    } else {
        data.forEach(function(row){
            row[0] = fixupTableHeader(row[0]);
        });
    }
}

function fixupTableHeader(header) {
    header = header[0].toUpperCase() + header.slice(1); // Uppercase first char
    header = color.bold(header); // Bold
    return header;
}

function tableSortColumns(cols) {
    var highPri = [ 'id', 'name', 'hostname' ];
    return cols.sort(function(a, b){
        for (var i = 0; i < highPri.length; ++i) {
            if (a === highPri[i]) return -1;
            if (b === highPri[i]) return 1;
        }
        return a < b ? -1 : a > b ? 1 : 0;
    });
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