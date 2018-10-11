var cmd = require('../../../cmd');

exports.command = 'test <id>';

exports.desc = 'Test an event hook';

exports.builder = function(yargs) {
    yargs.option('invalid', { required: true, type: 'string', description: 'Intentionally break part of the webhook test', choices: ['none', 'hookId', 'org', 'payload', 'signature'], default: 'none' });
};

exports.handler = function test_event_hook_handler(argv) {

    var opt = {
        invalid: argv.invalid,
    };

    cmd.api(argv).testEventHook(argv.id, opt)
        .then(function(response){
            cmd.displayResults(argv, response.data, {
                'table':         { flatten: ['request', 'response'] },
                'table-per-row': { flatten: ['request', 'response'] },
            });
        })
        .catch(function(err){
            if (err.res && err.res.status === 404) cmd.fail('Event hook not found');
            return Promise.reject(err);
        })
        .catch(cmd.catchError);
};