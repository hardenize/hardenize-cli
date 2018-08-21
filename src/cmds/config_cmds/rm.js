var config = require('../../config');

module.exports.command = 'rm <name>';

module.exports.desc = 'Delete a configuration item';

module.exports.builder = {};

module.exports.handler = function rm_config_handler(argv) {
    var name = argv.name;
    
    var conf = config.read(argv, { no_env: true });
    if (conf.hasOwnProperty(name)) {
        var prev = conf[name];
        delete conf[name];
        config.write(argv, conf);
        console.log('Configuration saved (was previously ' + prev + ')');
    } else {
        console.log('No change');
    }
};