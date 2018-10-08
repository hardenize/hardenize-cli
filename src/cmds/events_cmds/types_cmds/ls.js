var cmd = require('../../../cmd');

exports.command = 'ls';

exports.desc = 'List event types';

exports.handler = function ls_event_types_handler(argv) {
    cmd.api(argv).getEventTypes()
        .then(function(response){
            cmd.displayResults(argv, response.data.eventTypes);
        })
        .catch(cmd.catchError);

};