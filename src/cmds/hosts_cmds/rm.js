var cmd = require('../../cmd');

exports.command = 'rm <hostnames...>';

exports.desc = 'Delete hosts';

exports.builder = function(yargs) {
    yargs.option('preview', { type: 'boolean', description: 'Do not apply changes. Just return a list of hosts that would have been affected' });
}

exports.handler = function rm_hosts_handler(argv) {

    var options = {};
    if (argv.preview) options.preview = true;

    cmd.api(argv).deleteHosts(argv.hostnames, options)
        .then(function(response){
            cmd.displayResults(argv, response.data);
        })
        .catch(cmd.catchError);
}