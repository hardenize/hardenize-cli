var printTable = require('./table');

module.exports = printTablePerRow;

function printTablePerRow(data) {
    [].concat(data).forEach(function(row, n){
        if (n > 0) console.log('');
        printTable(row);
    });
}