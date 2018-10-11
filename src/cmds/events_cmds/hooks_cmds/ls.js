var cmd = require('../../../cmd');

exports.command = 'ls';

exports.desc = 'List event hooks';

exports.handler = function ls_event_hooks_handler(argv) {
    cmd.api(argv).getEventHooks()
        .then(function(response){
            cmd.displayResults(argv, response.data.eventHooks);
        })
        .catch(cmd.catchError);

};