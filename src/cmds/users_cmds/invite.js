var cmd = require('../../cmd');

exports.command = 'invite <name> <email> <role>';

exports.desc = 'Invite user';

exports.builder = function(yargs) {
    yargs.option('name',  { type: 'string',  description: 'New users name'  });
    yargs.option('email', { type: 'string',  description: 'New users email' });
    yargs.option('role',  { type: 'string',  choices: ['owner', 'admin', 'member', 'observer'], description: 'New users role' });
}

exports.handler = function invite_user_handler(argv) {

    var options = {
        name:  argv.name,
        email: argv.email,
        role:  argv.role,
    };
    
    cmd.api(argv).inviteUser(options)
        .then(function(response){
            cmd.displayResults(argv, response.data.user);
        })
       .catch(cmd.catchError);
}
