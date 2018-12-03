var cmd = require('../../cmd');

exports.command = 'update <id>';

exports.desc = 'Update user';

exports.builder = function(yargs) {
    yargs.option('delete-mfa', { type: 'boolean', description: 'Delete Multi-Factor Authentication' });
}

exports.handler = function update_suborg_handler(argv) {

    var options = {
        id: argv.id,
    };
    if (argv.deleteMfa) {
        options.deleteMfa = true;
    } else {
        cmd.fail('Must specify --delete-mfa');
    }

    cmd.api(argv).updateUser(argv.id, options)
        .then(function(response){
            console.log('User updated');
        })
        .catch(function(err){
            if (err.res && err.res.status === 404) cmd.fail('User not found within organization');
            return Promise.reject(err);
        })
        .catch(cmd.catchError);
}
