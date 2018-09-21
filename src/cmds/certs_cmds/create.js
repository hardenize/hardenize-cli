var fs  = require('fs');
var cmd = require('../../cmd');

exports.command = 'create';

exports.desc = 'Create a certificate. (Reads PEM from stdin)';

exports.builder = function(yargs) {
    yargs.option('file', {
        alias:       'f',
        description: 'Read cert from disk instead of stdin',
        type:        'string',
    });
};

exports.handler = function create_cert_handler(argv) {

    if (argv.hasOwnProperty('file')) {
        fs.readFile(argv.file, function(err, data){
            if (err) cmd.fail(err);
            createCert(argv, data.toString());
        });
    } else {

        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        var buffer = '';
        process.stdin.on('data', function(chunk) {
            buffer += chunk;
        });

        process.stdin.on('end', function() {
            createCert(argv, buffer);
        });
    
    }
};

function createCert(argv, data) {
    cmd.api(argv).createCert(data)
        .then(function(response){
            switch (response.res.status) {
                case 201: console.log('Certificate successfully created. SHA256:', response.data.cert.sha256); break;
                case 202: console.log('Certificate already exists:',               response.data.cert.sha256); break;
            }
        })
        .catch(function(err){
            if (err.res && err.res.status === 400) {
                if (err.data && typeof err.data === 'object' && Array.isArray(err.data.errors) && err.data.errors.length === 0) {
                    cmd.fail('Unable to parse certificate');
                }
            }
            cmd.catchError(err);
        });
}