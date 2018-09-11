var api = require('../../api');

exports.command = 'edit <hostnames...>';

exports.desc = 'Edit hosts';

exports.builder = function(yargs) {
    yargs.option('subdomains', { type: 'boolean', description: 'Apply to all the subdomains of the specified hosts' });
    yargs.option('preview',    { type: 'boolean', description: 'Do not apply changes. Just return a list of hosts that would have been affected' });
    yargs.option('status',     { type: 'string',  description: 'Desired host status', choices: ['idle', 'monitored', 'archived'] });
    yargs.option('group-op',   { description: 'Add, remove or set groups specified by --groups, on each host', choices: ['add', 'remove', 'set'] });
    yargs.option('groups',     { type: 'array',  description: 'List of groups for --group-op' });
}

exports.handler = function edit_hosts_handler(argv) {

    var options = {};
    var changes = {};

    ['subdomains', 'preview']
        .forEach(function(name){
            if (argv.hasOwnProperty(name)) options[name] = argv[name];
        });

    ['status', 'groupOp', 'groups']
        .forEach(function(name){
            if (argv.hasOwnProperty(name)) changes[name] = argv[name];
        });

    api.init(argv).updateHosts(argv.hostnames, changes, options)
        .then(function(response){
            api.displayResults(argv, response.data);
        })
        .catch(api.catchError);
}