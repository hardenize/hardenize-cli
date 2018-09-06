var api = require('../../api');

exports.command = 'add <hostnames...>';

exports.desc = 'Add hosts';

exports.builder = function(yargs) {
    yargs.option('status', { type: 'string', description: 'Host status', choices: ['idle', 'monitored', 'archived'] });
    yargs.option('tags',   { type: 'array',  description: 'List of tags to add' });
}

exports.handler = function add_hosts_handler(argv) {

    var options = {};
    if (argv.status) options.status = argv.status;
    if (argv.tags)   options.tags   = argv.tags;

    api.init(argv).addHosts(argv.hostnames, options)
        .then(function(response){
            console.log(JSON.stringify(response.data, null, 2));
        })
        .catch(api.catchError);
}