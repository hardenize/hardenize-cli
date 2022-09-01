var cmd = require('../../cmd');

exports.command = 'create-service-account <name> <role>';

exports.desc = 'Create service account';

exports.builder = function(yargs) {
    yargs.option('expiration-time', { type: 'string',  description: 'Expiry date' });
}

exports.handler = function invite_user_handler(argv) {

    var options = {
        name:  argv.name,
        role:  argv.role,
    };

    if (argv.expirationTime) options.expirationTime = argv.expirationTime;

    cmd.api(argv).createServiceAccount(options)
        .then(function(response){
            cmd.displayResults(argv, response.data.user);
        })
       .catch(cmd.catchError);
}
