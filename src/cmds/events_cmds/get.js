var cmd = require('../../cmd');

exports.command = 'get <id>';

exports.desc = 'Get an event';

exports.handler = function get_event_handler(argv) {
    return cmd.api(argv).getEvent(argv.id)
        .then(function(response){
            cmd.displayResults(argv, response.data.event);
        })
        .catch(function(err){
            if (err.res && err.res.status === 404) cmd.fail('Event not found');
            return Promise.reject(err);
        })
        .catch(cmd.catchError);
};