var cmd    = require('../../cmd');
var config = require('../../config');

exports.command = 'ls';

exports.desc = 'List configuration';

exports.builder = {};

exports.handler = function ls_config_handler(argv) {
    var conf = config.read(argv);
    cmd.displayResults(argv, conf);
};