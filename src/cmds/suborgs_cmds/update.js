var cmd = require('../../cmd');

exports.command = 'update <id>';

exports.desc = 'Update organization';

exports.builder = function(yargs) {
    yargs.option('status',                   { type: 'string',  description: 'Organization status', choices: ['active', 'dormant', 'suspended', 'deleted'] });
    yargs.option('generate-api-credentials', { type: 'boolean', description: 'Generates and returns new API credentials. They will need recording as you wont be able to view them again' });
}

exports.handler = function update_suborg_handler(argv) {

    var options = {};

    if (argv.status)                 options.status                 = argv.status;
    if (argv.generateApiCredentials) options.generateApiCredentials = true;

    if (Object.keys(options).length === 0) {
        cmd.fail('Must specify one or more of --status and --generate-api-credentials');
    }

    cmd.api(argv).updateSubOrg(argv.id, options)
        .then(function(response){
            cmd.displayResults(argv, response.data.org);
        })
        .catch(cmd.catchError);
}