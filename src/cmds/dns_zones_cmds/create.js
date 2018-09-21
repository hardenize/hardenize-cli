var fs     = require('fs');
var cmd    = require('../../cmd');
var config = require('../../config');

exports.command = 'create <root>';

exports.desc = 'Create a dns zone for the hostname <root>';

exports.builder = function(yargs) {
    yargs.option('file', {
        alias:       'f',
        description: 'Local path to zone file if src is file',
        type:        'string',
    });
    yargs.option('src', {
        description: 'The source of the zone file to upload. If not supplied, defaults to either "stdin" or "file" depending on if a --file argument was supplied. The "cloudflare" source will only work if you have "cloudflare_email" and "cloudflare_key" configuration items set',
        choices:     ['stdin', 'file', 'cloudflare'],
    });
};

exports.handler = function create_dns_zone_handler(argv) {
    switch (argv.src) {
        case 'stdin':      return handle_stdin(argv);
        case 'file':       return handle_file(argv);
        case 'cloudflare': return handle_cloudflare(argv);
        default: return argv.file ? handle_file(argv) : handle_stdin(argv);
    }
};

function handle_cloudflare(argv) {

    var conf = config.read(argv);

    var email = conf.cloudflare_email;
    var key   = conf.cloudflare_key;
    if (!email) cmd.fail('No cloudflare_email configuration available');
    if (!key)   cmd.fail('No cloudflare_key configuration available');

    var cf = require('cloudflare')({
        email: email,
        key:   key,
    });

    cf.zones.browse({ name: argv.root })
        .catch(function(err){
            cmd.fail('Fetching zone from cloudflare - ' + err.message);
        })
        .then(function(response){
            var zoneInfo = response.result[0];
            if (!zoneInfo) cmd.fail('Unable to locate zone at cloudflare');
            return cf.dnsRecords.export(response.result[0].id);
        })
        .catch(cmd.fail)
        .then(function(zoneData){
            createZone(argv, zoneData);
        })
        .catch(cmd.catchError);
}

function handle_file(argv) {

    if (!argv.file) return cmd.fail('Missing --file argument');

    fs.readFile(argv.file, function(err, data){
        if (err) cmd.fail(err);
        createZone(argv, data.toString());
    });

}

function handle_stdin(argv) {

    if (argv.file) cmd.fail('Do not use --file when specifying --src stdin');

    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    var buffer = '';
    process.stdin.on('data', function(chunk) {
        buffer += chunk;
    });

    process.stdin.on('end', function() {
        createZone(argv, buffer);
    });

}

function createZone(argv, data) {
    cmd.api(argv)
        .createDnsZone(argv.root, data)
        .then(function(_){
            console.log('Zone successfully created');
        })
        .catch(function(err){
            if (err.res && err.res.status === 400) {
                if (err.data && typeof err.data === 'object' && Array.isArray(err.data.errors) && err.data.errors.length === 0) {
                    cmd.fail('Unable to parse dns zone');
                }
            }
            cmd.catchError(err);
        });
}