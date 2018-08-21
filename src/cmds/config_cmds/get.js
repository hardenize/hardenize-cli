var config = require('../../config');

exports.command = 'get [name]';

exports.desc = 'Display configuration';

exports.builder = {};

exports.handler = function get_config_handler(argv) {
    var name = argv.name;
    
    var conf = config.read(argv);
    if (typeof name === 'undefined') {
        console.log(JSON.stringify(conf, null, 2));
    } else if (conf.hasOwnProperty(name)) {
        console.log(conf[name]);
    } else {
        console.error('No such configuration item');
        process.exit(1);
    }
}