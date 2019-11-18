var cmd = require('../../cmd');

exports.command = 'update <networkRange>';

exports.desc = 'Update network range';

exports.builder = function(yargs) {
    yargs.option('label',       { type: 'string',  description: 'Label' });
    yargs.option('description', { type: 'string',  description: 'Description' });
    yargs.option('scan',        { type: 'boolean', description: 'Enable scanning' });
}

exports.handler = function update_network_range_handler(argv) {

    var options = {};
    if (argv.hasOwnProperty('label'))       options.label       = argv.label;
    if (argv.hasOwnProperty('description')) options.description = argv.description;
    if (argv.hasOwnProperty('scan'))        options.scan        = argv.scan;

    cmd.api(argv).updateNetworkRange(argv.networkRange, options)
        .then(function(){
            console.log('Network range updated');
        })
        .catch(function(err){
            if (err.res && err.res.status === 404) {
                cmd.fail('Network range not found');
            }
            cmd.catchError(err);
        });
}