var readline = require('readline');
var config   = require('../../config');

module.exports.command = 'init';

module.exports.desc = 'Interactively initialise  configuration';

module.exports.builder = {};

module.exports.handler = function init_config_handler(argv) {
    
    var rl = readline.createInterface({
        input:  process.stdin,
        output: process.stdout
    });

    var conf = config.read(argv);

    rl.question('* API Username' + (conf.username ? ' [' + conf.username + ']' : '') + ': ', function(username) {
        if (username.length) {
            conf.username = username;
        } else if (!conf.username) {
            console.error('Invalid username');
            return process.exit(1);
        }
        rl.question('* API Password' + (conf.password ? ' [' + conf.password + ']' : '') + ': ', function(password) {
            if (password.length) {
                conf.password = password;
            } else if (!conf.password) {
                console.error('Invalid password');
                return process.exit(1);
            }
            rl.question('  Default organization: ', function(default_org) {
                if (default_org.length) {
                    conf.default_org = default_org;
                } else {
                    delete conf.default_org;
                }
                rl.close();
                config.write(argv, conf);
                console.log('Configuration saved');
            });
        });
    });
};