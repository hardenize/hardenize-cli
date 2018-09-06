var api = require('../../api');

exports.command = 'rm <hostnames...>';

exports.desc = 'Delete hosts';

exports.builder = function(yargs) {
    yargs.option('preview', { type: 'boolean', description: 'Do not apply changes. Just return a list of hosts that would have been affected' });
}

exports.handler = function rm_hosts_handler(argv) {

    var options = {};
    if (argv.preview) options.preview = true;

    api.init(argv).deleteHosts(argv.hostnames, options)
        .then(function(response){
            api.displayResults(argv, response.data);
        })
        .catch(api.catchError);
}