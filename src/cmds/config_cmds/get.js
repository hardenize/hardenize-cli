var cmd    = require('../../cmd');
var config = require('../../config');

exports.command = 'get <name>';

exports.desc = 'Display configuration value';

exports.builder = {};

exports.handler = function get_config_handler(argv) {
    var name = argv.name;
    
    var conf = config.read(argv);
    if (conf.hasOwnProperty(name)) {
        console.log(conf[name]);
    } else {
        cmd.fail('No such configuration item');
    }
}