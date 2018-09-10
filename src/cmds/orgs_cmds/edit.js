var api = require('../../api');

exports.command = 'edit <id>';

exports.desc = 'Edit organization';

exports.builder = function(yargs) {
    yargs.option('status', { type: 'string',  description: 'Organization status', choices: ['active', 'dormant', 'suspended', 'deleted'], required: true });
}

exports.handler = function edit_org_handler(argv) {

    var options = {
        status: argv.status,
    };

    api.init(argv).updateOrg(argv.id, options)
        .then(function(response){
            api.displayResults(argv, response.data.org);
        })
        .catch(api.catchError);
}