var cmd = require('../../../cmd');

exports.command = 'update <id>';

exports.desc = 'Update event type';

exports.builder = function(yargs) {
    yargs.option('event-types', { type: 'array',  description: 'Event types to send to this event hook' });
    yargs.option('destination', { type: 'string', description: 'Event hook destination; for webhooks, this must be a HTTPS URL' });
    yargs.option('status',      { type: 'string', description: 'Change state for event hook', choices: ['enabled', 'disabled', 'failed'] });
};

exports.handler = function update_event_hooks_handler(argv) {

    var opt = {};
    if (argv['event-types']) opt.eventTypes  = argv['event-types'];
    if (argv.destination)    opt.destination = argv.destination;
    if (argv.status)         opt.status      = argv.status;

    if (Object.keys(opt).length === 0) {
        cmd.fail('Must supply one of --event-types, --destination or --status');
    }

    cmd.api(argv).updateEventHook(argv.id, opt)
        .then(function(response){
            cmd.displayResults(argv, response.data.eventHook);
        })
        .catch(function(err){
            if (err.res && err.res.status === 404) cmd.fail('Event hook not found');
            return Promise.reject(err);
        })
        .catch(cmd.catchError);
}