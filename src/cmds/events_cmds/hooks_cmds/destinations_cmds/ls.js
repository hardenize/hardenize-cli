var cmd = require('../../../../cmd');

exports.command = 'ls';

exports.desc = 'List event hook destinations';

exports.handler = function ls_event_hook_destinations_handler(argv) {
    cmd.api(argv).getEventHookDestinations()
        .then(function(response){
            cmd.displayResults(argv, response.data.eventDestinations);
        })
        .catch(cmd.catchError);
};