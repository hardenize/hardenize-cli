var cmd = require('../../cmd');

exports.command = 'create <id>';

exports.desc = 'Create an organization';

exports.builder = function(yargs) {
    yargs.option('name',   { type: 'string',  description: 'Display name (if different from id)' });
    yargs.option('status', { type: 'string',  description: 'Organization status', choices: ['active', 'dormant', 'suspended', 'deleted'], default: 'active' });
    yargs.option('api',    { type: 'boolean', description: 'Generate API credentials' });
}

exports.handler = function create_suborg_handler(argv) {

    var options = ['name', 'status', 'api']
        .reduce(function(o, name){
            if (!argv.hasOwnProperty(name)) return o;
            var value = argv[name];
            if (name === 'api') name = 'generateApiCredentials';
            o[name] = value;
            return o;
        }, {})

    cmd.api(argv).createSubOrg(argv.id, options)
        .then(function(response){
            cmd.displayResults(argv, response.data.org);
        })
        .catch(cmd.catchError);
}