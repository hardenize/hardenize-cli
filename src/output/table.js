var color = require('cli-color');
var table = require('table').table;

module.exports = printTable;

function printTable(data) {

    var isList = Array.isArray(data);

    data = isList ? getTableArray(data) : getTableObject(data);

    var tableConfig = {
        border: {
            topBody:    '─', topJoin:    '┬', topLeft:    '┌', topRight:    '┐',
            bottomBody: '─', bottomJoin: '┴', bottomLeft: '└', bottomRight: '┘',
            bodyLeft:   '│', bodyRight:  '│', bodyJoin:   '│',
            joinBody:   '─', joinLeft:   '├', joinRight:  '┤', joinJoin:    '┼',
        },
    };
    var columns = getColumnsConfig(data);

    fixupTableHeaders(data, isList);

    if (Object.keys(columns).length === 0) return;

    tableConfig.columns = columns;
    console.log(table(data, tableConfig).replace(/[\r\n]+$/, ''));
}

function getColumnsConfig(data) {
    var columns = {};

    // Figure out the max width of data for each column
    data.forEach(function(row){
        row.forEach(function(col, n){
            var width = col.length;
            if (!columns[n]) columns[n] = { width: width };
            columns[n].width = Math.max(columns[n].width, width);
        });
    });

    // If the table is wider than the console, we want to apply some wrapping
    if (tableWidth(columns) > process.stdout.columns) {

        // Sort columns in ascending width order
        var colNums = Object.keys(columns).sort(function(a,b) {
            return a.width < b.width ? -1 : a.width > b.width ? 1 : 0;
        });

        // Restrict all columns (except the widest) to 64 chars max
        colNums.slice(0, colNums.length-1).forEach(function(n){
            columns[n].width = Math.min(64, columns[n].width);
        });

        // If the table is still wider than the console, shrink the widest
        // column to fit. Don'y shrink further than 64 chars
        var toDelete = tableWidth(columns) - process.stdout.columns;
        if (toDelete > 0) {
            var n     = colNums[colNums.length-1];
            var width = columns[n].width - toDelete;
            columns[n].width = Math.max(width, Math.min(columns[n].width,64));
        }
    }

    return columns;
}

function tableWidth(columns) {
    return Object.keys(columns).reduce(function(o, n){
        return o + columns[n].width + 3;
    }, 1);
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
    header = color.bold(header); // Bold
    return header;
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
        return obj.map(flattenObject).join(', ');
    } else if (obj === null || typeof obj === 'undefined') {
        return '';
    } else if (typeof obj === 'object') {
        return JSON.stringify(obj);
    } else {
        return String(obj).replace(/\s*[\r\n]+\s*/g, ', ');
    }
}