var api = require('../../api');

exports.command = 'ls [hostname]';

exports.desc = 'List hosts';

exports.builder = function(yargs) {
    yargs.option('subdomains', { type: 'boolean', description: 'Include all subdomains of the specified name', default: true });
    yargs.option('limit',      { type: 'integer', description: 'Return only up to the specified number of hosts' });
    yargs.option('origin',     { type: 'string',  description: 'Return only hosts with this origin', choices: ['cert', 'ct', 'manual'] });
    yargs.option('status',     { type: 'string',  description: 'Return only hosts with this status', choices: ['archived', 'idle', 'monitored'] });
    yargs.option('group',      { type: 'string',  description: 'Return only hosts with this group' });
}

exports.handler = function ls_hosts_handler(argv) {

    var opt = ['subdomains', 'limit', 'hostname', 'origin', 'status', 'group']
        .reduce(function(o, name) {
            if (argv.hasOwnProperty(name)) o[name] = argv[name];
            return o;
        }, {});

    api.init(argv).getHosts(opt)
        .then(function(response){
            api.displayResults(argv, response.data.hosts);
        })
        .catch(api.catchError);

};