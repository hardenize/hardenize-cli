var YAML = require('yaml').default;
var cmd  = require('../cmd');

module.exports = printYaml;

function printYaml(data) {
    data = [].concat(data);
    if (data.length === 0) return;

    data.forEach(function(item){
        console.log('---\n' + YAML.stringify(item).replace(/[\r\n]+$/, ''));
    });
}