var api = require('../../api');

exports.command = 'add <hostnames...>';

exports.desc = 'Add hosts';

exports.builder = function(yargs) {
    yargs.option('status', { type: 'string', description: 'Host status', choices: ['idle', 'monitored', 'archived'], required: true });
    yargs.option('groups', { type: 'array',  description: 'List of groups to add' });
}

exports.handler = function add_hosts_handler(argv) {

    var options = {};
    if (argv.status) options.status = argv.status;
    if (argv.groups) options.groups = argv.groups;

    api.init(argv).addHosts(argv.hostnames, options)
        .then(function(){
            console.log('Hosts added');
        })
        .catch(api.catchError);
}