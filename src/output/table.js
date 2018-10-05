var color    = require('cli-color');
var Table    = require('cli-table');
var wrapAnsi = require('wrap-ansi');
var YAML     = require('yaml').default;

module.exports = printTable;

function printTable(data) {

    var isList = Array.isArray(data);

    data = isList ? getTableArray(data) : getTableObject(data);
    if (data.length === 0 || data[0].length === 0) return;

    var table = new Table();

    colWidths(data,   isList);
    boldHeaders(data, isList);

    data.forEach(row => table.push(row));
    console.log(table.toString());
}

function colWidths(data, isList) {

    var columns = {};

    // Figure out the max width of data for each column
    data.forEach(function(row){
        row.forEach(function(col, n){
            if (!columns[n]) columns[n] = {
                min: Math.max(10, isList ? (data[0][n].length) : 0),
            };
            col.split(/\n/).forEach(function(line){
                columns[n].max = Math.max(columns[n].max||0, line.length);
            });
        });
    });

    var toDelete = tableWidth(columns) - process.stdout.columns;

    // If the table is wider than the console, we want to apply some wrapping
    while (toDelete > 0) {

        // Extract a list of columns (the indexes) which can be shrunk. Sort them
        // in descending order of size (so the first element is the index of the
        // widest column which can be shrunk)
        var colNums = Object.keys(columns)
            .map(n => parseInt(n, 10))
            .filter(function(colNum){
                if (!isList) return true;
                var minWidth    = columns[colNum].min;
                var maxWidth    = columns[colNum].max;
                return maxWidth > minWidth;
            }).sort(function(a, b) {
                a = columns[a].max;
                b = columns[b].max;
                return a < b ? 1 : a > b ? -1 : 0;
            });

        if (colNums.length === 0) break;

        // Figure out the widest and second widest column
        var widestCol       = colNums[0];
        var nextWidestCol   = colNums[1];
        var widestWidth     = columns[widestCol].max || 0;
        var nextWidestWidth = typeof nextWidestCol === 'undefined' ? null : columns[nextWidestCol].max;

        var minWidth = isList ? data[0][widestCol].length : 10;

        // Shrink the widest until it's either 1 char smaller than the second widest,
        // or allows the table to fit the screen. Which either is larger
        if (widestWidth >= nextWidestWidth) {
            var minWidth = columns[widestCol].min;
            var newWidth = Math.max(widestWidth - toDelete, nextWidestWidth - 1, minWidth);
            columns[widestCol].max = newWidth;
        }

        toDelete = tableWidth(columns) - process.stdout.columns;
    }

    data.forEach(function(row){
        Object.keys(columns).forEach(function(n){
            row[n] = wrapText(row[n], columns[n].max, isList);
        });
    });

    return Object.keys(columns).map(n => parseInt(n, 10)).sort().map(n => columns[n].max);
}

function tableWidth(columns) {
    return Object.keys(columns).reduce(function(o, n){
        return o + columns[n].max + 3;
    }, 3);
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

function tableSortColumns(cols) {
    var highPri = [ 'id', 'title', 'name', 'hostname' ];
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
        return flattenObject(YAML.stringify(obj));
    } else if (obj === null || typeof obj === 'undefined') {
        return '';
    } else if (typeof obj === 'object') {
        return flattenObject(YAML.stringify(obj));
    } else {
        return String(obj).replace(/\r\n/g, '\n').replace(/\n+$/,'');
    }
}

function wrapText(str, len, isList) {
    var str = wrapAnsi(str, len, { trim: false, hard: true });

    if (isList) {
        var lines = str.replace(/[^\n]/g, '').length + 1;
        if (lines > process.stdout.rows) return '<TOO LARGE FOR DISPLAY>';
    }

    return str;
}

function boldHeaders(data, isList) {
    if (!data.length) return;
    if (isList) {
        data[0] = data[0].map(h => color.bold(h));
    } else {
        data.forEach(function(row){
            row[0] = color.bold(row[0]);
        });
    }
}