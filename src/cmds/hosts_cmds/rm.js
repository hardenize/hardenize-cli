var cmd = require('../../cmd');

exports.command = 'rm <hostnames...>';

exports.desc = 'Delete hosts';

exports.builder = function(yargs) {
    yargs.option('preview',    { type: 'boolean', description: 'Do not apply changes. Just return a list of hosts that would have been affected' });
    yargs.option('subdomains', { type: 'boolean', description: 'Delete subdomains too' });
}

exports.handler = function rm_hosts_handler(argv) {

    var options = {};
    if (argv.preview)    options.preview    = true;
    if (argv.subdomains) options.subdomains = true;

    cmd.api(argv).deleteHosts(argv.hostnames, options)
        .then(function(response){
            cmd.displayResults(argv, response.data);
        })
        .catch(cmd.catchError);
}