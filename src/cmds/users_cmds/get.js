var cmd = require('../../cmd');

exports.command = 'get <userId>';

exports.desc = 'Get a user';

exports.handler = function getuser_handler(argv) {
    return cmd.api(argv).getUser(argv.userId)
        .then(function(response){
            cmd.displayResults(argv, response.data.user);
        })
        .catch(function(err){
            if (err.res && err.res.status === 404) cmd.fail('User not found');
            return Promise.reject(err);
        })
        .catch(cmd.catchError);
};