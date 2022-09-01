var cmd = require('../../cmd');

exports.command = 'cancel-invite <userId>';

exports.desc = 'Cancel user invite';

exports.handler = function cancel_invite_user_handler(argv) {    
    cmd.api(argv).cancelUserInvite(argv.userId)
        .then(function(_response){
            console.log('User invitation cancelled');
        })
        .catch(function(err){
            if (err.res && err.res.status === 404) cmd.fail('User not found');
            return Promise.reject(err);
        })
       .catch(cmd.catchError);
}
