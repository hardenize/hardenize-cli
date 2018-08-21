var fs  = require('fs');
var api = require('../../api');

exports.command = 'add <root>';

exports.desc = 'Add a dns zone for the hostname <root>. (Reads bind compatible zone from stdin)';

exports.builder = function(yargs) {
    yargs.option('status', {
        description: 'Status for hosts found in zone file',
        choices:     ['archive', 'idle', 'monitored'],
    });
    yargs.option('file', {
        alias:       'f',
        description: 'Read zone file from disk instead of stdin',
        type:        'string',
    });
};

exports.handler = function add_dns_zone_handler(argv) {

    if (argv.hasOwnProperty('file')) {
        fs.readFile(argv.file, function(err, data){
            if (err) {
                console.error(err.message);
                process.exit(1);
            }
            addZone(argv, data.toString());
        });
    } else {
        process.stdin.resume();
        process.stdin.setEncoding('utf8');

        var buffer = '';
        process.stdin.on('data', function(chunk) {
            buffer += chunk;
        });

        process.stdin.on('end', function() {
            addZone(argv, buffer);
        });
    }
};

function addZone(argv, data) {
    var options = {};
    if (argv.hasOwnProperty('status')) {
        options.status = argv.status;
    }
    api.init(argv)
        .addDnsZone(argv.root, data, options)
        .then(function(_){
            console.log('Zone successfully added');
        })
        .catch(api.catchError);
}