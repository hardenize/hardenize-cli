var readline = require('readline');

module.exports = function config(cmd) {
    var self = this;

    var rl = readline.createInterface({
        input:  process.stdin,
        output: process.stdout
    });

    var config = self.read_config();

    rl.question('* API Username' + (config.username ? ' [' + config.username + ']' : '') + ': ', function(username) {
        if (username.length) {
            config.username = username;
        } else if (!config.username) {
            throw new Error('Invalid username');
        }
        rl.question('* API Password' + (config.password ? ' [' + config.password + ']' : '') + ': ', function(password) {
            if (password.length) {
                config.password = password;
            } else if (!config.password) {
                throw new Error('Invalid password');
            }
            rl.question('  Default organization: ', function(default_org) {
                if (default_org.length) {
                    config.default_org = default_org;
                } else {
                    delete config.default_org;
                }
                rl.close();
                self.write_config(config);
                console.log('Configuration saved');
            });
        });
    });
};