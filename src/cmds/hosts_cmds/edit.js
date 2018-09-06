var api = require('../../api');

exports.command = 'edit <hostnames...>';

exports.desc = 'Edit hosts';

exports.builder = function(yargs) {
    yargs.option('subdomains', { type: 'boolean', description: 'Apply to all the subdomains of the specified hosts' });
    yargs.option('preview',    { type: 'boolean', description: 'Do not apply changes. Just return a list of hosts that would have been affected' });
    yargs.option('status',     { type: 'string',  description: 'Desired host status', choices: ['idle', 'monitored', 'archived'] });
    yargs.option('tag-op',     { description: 'Add, remove or set tags specified by --tags, on each host', choices: ['add', 'remove', 'set'] });
    yargs.option('tags',       { type: 'array',  description: 'List of tags for --tag-op' });
}

exports.handler = function edit_hosts_handler(argv) {

    var options = {};
    ['subdomains', 'preview', 'status', 'tagOp', 'tags']
        .forEach(function(name){
            if (argv.hasOwnProperty(name)) options[name] = argv[name];
        });

    api.init(argv).updateHosts(argv.hostnames, options)
        .then(function(response){
            console.log(JSON.stringify(response.data, null, 2));
        })
        .catch(api.catchError);
}