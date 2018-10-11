var cmd = require('../../../cmd');

exports.command = 'rm <id>';

exports.desc = 'Delete an event hook';

exports.handler = function rm_event_hook_handler(argv) {
    cmd.api(argv).deleteEventHook(argv.id)
        .then(function(){
            console.log('Event hook successfully deleted');
        })
        .catch(function(err){
            if (err.res && err.res.status === 404) cmd.fail('Event hook not found');
            return Promise.reject(err);
        })
        .catch(cmd.catchError);

};