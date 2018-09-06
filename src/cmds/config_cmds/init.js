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

    question(rl, 'API Username' + (conf.username ? ' [' + conf.username + ']' : ''))()
        .then(function(username) {
            if (username.length) conf.username = username;
        })
        .then(question(rl, 'API Password' + (conf.password ? ' [' + conf.password + ']' : '')))
        .then(function(password) {
            if (password.length) conf.password = password;
        })
        .then(question(rl, 'Default organization' + (conf.default_org ? ' [' + conf.default_org + ']' : '')))
        .then(function(default_org) {
            if (default_org.length) conf.default_org = default_org;
        })
        .then(question(rl, 'Default output format [' + (conf.default_format ? conf.default_format : 'yaml') + ']'))
        .then(function(default_format) {
            if (!default_format.length) default_format = conf.default_format || 'yaml';
            default_format = default_format.toLowerCase();
            if (default_format !== 'yaml' && default_format !== 'json') fail('Invalid choice');
            conf.default_format = default_format;
        })
        .then(function(){
            rl.close();
            config.write(argv, conf);
            console.log('Configuration saved');
        });
};

function question(rl, question) {
    return function() {
        return new Promise(function(resolve){
            rl.question(question + ': ', function(answer){
                resolve(answer.trim());
            });
        });
    };
}

function fail(err) {
    if (err instanceof Error) err = err.message;
    console.error(err);
    process.exit(1);
}