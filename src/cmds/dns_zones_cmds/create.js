var fs     = require('fs');
var api    = require('../../api');
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
    if (!email) fail('No cloudflare_email configuration available');
    if (!key)   fail('No cloudflare_key configuration available');

    var cf = require('cloudflare')({
        email: email,
        key:   key,
    });

    cf.zones.browse({ name: argv.root })
        .catch(function(err){
            fail('Fetching zone from cloudflare - ' + err.message);
        })
        .then(function(response){
            var zoneInfo = response.result[0];
            if (!zoneInfo) fail('Unable to locate zone at cloudflare');
            return cf.dnsRecords.export(response.result[0].id);
        })
        .catch(fail)
        .then(function(zoneData){
            createZone(argv, zoneData);
        })
        .catch(api.catchError);
}

function handle_file(argv) {

    if (!argv.file) return fail('Missing --file argument');

    fs.readFile(argv.file, function(err, data){
        if (err) fail(err);
        createZone(argv, data.toString());
    });

}

function handle_stdin(argv) {

    if (argv.file) return fail('Do not use --file when specifying --src stdin');

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
    api.init(argv)
        .createDnsZone(argv.root, data)
        .then(function(_){
            console.log('Zone successfully created');
        })
        .catch(api.catchError);
}

function fail(err) {
    if (err instanceof Error) err = err.message;
    console.error(err);
    process.exit(1);
}