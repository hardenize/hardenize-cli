var cmd = require('../../../cmd');

exports.command = 'update <name>';

exports.desc = 'Update event type';

exports.builder = function(yargs) {
    yargs.option('enabled', { required: true, type: 'boolean', description: 'Change enabled state for event type' });
}

exports.handler = function update_event_types_handler(argv) {

    var changes = {};
    if (argv.hasOwnProperty('enabled')) changes.enabled = argv.enabled;

    cmd.api(argv).updateEventType(argv.name, changes)
        .then(function(response){
            cmd.displayResults(argv, response.data.eventType);
        })
        .catch(function(err){
            switch ((err.res||{}).status) {
                case 403: cmd.fail('Event is not available');
                case 404: cmd.fail('Event type not found');
            }
            return Promise.reject(err);
        })
        .catch(cmd.catchError);
}