var cmd = require('../../cmd');

exports.command = 'create <hostnames...>';

exports.desc = 'Create hosts';

exports.builder = function(yargs) {
    yargs.option('status', { type: 'string', description: 'Host status', choices: ['idle', 'monitored', 'archived'], required: true });
    yargs.option('groups', { type: 'array',  description: 'List of groups to create' });
}

exports.handler = function create_hosts_handler(argv) {

    var options = {};
    if (argv.status) options.status = argv.status;
    if (argv.groups) options.groups = argv.groups;

    cmd.api(argv).createHosts(argv.hostnames, options)
        .then(function(){
            console.log('Hosts created');
        })
        .catch(cmd.catchError);
}