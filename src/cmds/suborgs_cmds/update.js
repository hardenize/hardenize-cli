var api = require('../../api');

exports.command = 'update <id>';

exports.desc = 'Update organization';

exports.builder = function(yargs) {
    yargs.option('status', { type: 'string',  description: 'Organization status', choices: ['active', 'dormant', 'suspended', 'deleted'], required: true });
}

exports.handler = function update_suborg_handler(argv) {

    var options = {
        status: argv.status,
    };

    api.init(argv).updateSubOrg(argv.id, options)
        .then(function(response){
            api.displayResults(argv, response.data.org);
        })
        .catch(api.catchError);
}