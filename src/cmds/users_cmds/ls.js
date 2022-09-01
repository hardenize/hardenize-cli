var cmd = require('../../cmd');

exports.command = 'ls';

exports.desc = 'List users';

exports.handler = function ls_users_handler(argv) {

    cmd.api(argv).getUsers()
        .then(function(response){
            cmd.displayResults(argv, response.data.users);
        })
        .catch(cmd.catchError);
};