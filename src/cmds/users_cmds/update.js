var cmd = require('../../cmd');

exports.command = 'update <id>';

exports.desc = 'Update user';

exports.builder = function(yargs) {
    yargs.option('delete-mfa',      { type: 'boolean', description: 'Delete Multi-Factor Authentication' });
    yargs.option('reset-password',  { type: 'boolean', description: 'Reset password. For service accounts only' });
    yargs.option('expiration-time', { type: 'string',  description: 'Update expiration time. For service accounts only' });
    yargs.option('status',          { type: 'string',  choices: ['active', 'retired'], description: 'Update user status' });
    yargs.option('role',            { type: 'string',  choices: ['owner', 'admin', 'member', 'observer'], description: 'Update user role' });
}

exports.handler = function update_suborg_handler(argv) {

    var options = {
        id: argv.id,
    };
    if (argv.deleteMfa)      options.deleteMfa      = true;
    if (argv.resetPassword)  options.resetPassword  = true;
    if (argv.expirationTime) options.expirationTime = argv.expirationTime;
    if (argv.status)         options.status         = argv.status;
    if (argv.role)           options.role           = argv.role;

    if (Object.keys(options).length === 1) cmd.fail('Must specify at least one attribute to change');
    
    cmd.api(argv).updateUser(argv.id, options)
        .then(function(response){
            cmd.displayResults(argv, response.data.user);
        })
        .catch(function(err){
            if (err.res && err.res.status === 404) cmd.fail('User not found within organization');
            return Promise.reject(err);
        })
        .catch(cmd.catchError);
}
