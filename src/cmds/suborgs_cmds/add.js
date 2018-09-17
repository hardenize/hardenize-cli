var api = require('../../api');

exports.command = 'add <id>';

exports.desc = 'Add an organization';

exports.builder = function(yargs) {
    yargs.option('name',   { type: 'string',  description: 'Display name (if different from id)' });
    yargs.option('status', { type: 'string',  description: 'Organization status', choices: ['active', 'dormant', 'suspended', 'deleted'], default: 'active' });
    yargs.option('api',    { type: 'boolean', description: 'Generate API credentials' });
}

exports.handler = function add_suborg_handler(argv) {

    var options = ['name', 'status', 'api']
        .reduce(function(o, name){
            if (!argv.hasOwnProperty(name)) return o;
            var value = argv[name];
            if (name === 'api') name = 'generateApiCredentials';
            o[name] = value;
            return o;
        }, {})

    api.init(argv).addSubOrg(argv.id, options)
        .then(function(response){
            api.displayResults(argv, response.data.org);
        })
        .catch(api.catchError);
}