var cmd = require('../../cmd');

exports.command = 'create <networkRange>';

exports.desc = 'Create network range';

exports.builder = function(yargs) {
    yargs.option('label',       { type: 'string',  description: 'Label', required: true });
    yargs.option('description', { type: 'string',  description: 'Description', required: true });
    yargs.option('scan',        { type: 'boolean', description: 'Enable scanning', default: false });
}

exports.handler = function create_network_range_handler(argv) {

    var options = {
        label:       argv.label,
        description: argv.description,
    };
    if (argv.scan) options.scan = argv.scan;

    cmd.api(argv).createNetworkRange(argv.networkRange, options)
        .then(function(){
            console.log('Network range created');
        })
        .catch(function(err){
            if (err.data && err.data.errors && err.data.errors.length === 1 && err.data.errors[0].param === 'body/range') {
                cmd.fail(err.data.errors[0].message);
            }
            cmd.catchError(err);
        });
}