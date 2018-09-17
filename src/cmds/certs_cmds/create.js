var fs  = require('fs');
var api = require('../../api');

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
            if (err) {
                console.error(err.message);
                process.exit(1);
            }
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
    api.init(argv).createCert(data)
        .then(function(response){
            switch (response.res.status) {
                case 201: console.log('Certificate successfully created. SHA256:', response.data.cert.sha256); break;
                case 202: console.log('Certificate already exists:',               response.data.cert.sha256); break;
            }
        })
        .catch(api.catchError);
}