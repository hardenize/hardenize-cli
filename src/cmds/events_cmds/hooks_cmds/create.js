var cmd = require('../../../cmd');

exports.command = 'create';

exports.desc = 'Create an event hook';

exports.builder = function(yargs) {
    yargs.option('hook-type',   { required: true, type: 'string', description: 'Desired event hook type', choices: ['webhook'] });
    yargs.option('event-types', { required: true, type: 'array',  description: 'Event types to send to this event hook' });
    yargs.option('destination', { required: true, type: 'string', description: 'Event hook destination; for webhooks, this must be a HTTPS URL' });
};

exports.handler = function create_event_hook_handler(argv) {

    var opt = {
        hookType:    argv['hook-type'],
        eventTypes:  argv['event-types'],
        destination: argv['destination'],
    };

    cmd.api(argv).createEventHook(opt)
        .then(function(response){
            cmd.displayResults(argv, response.data.eventHook);
        })
        .catch(cmd.catchError);
};