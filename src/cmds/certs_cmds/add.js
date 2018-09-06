var fs  = require('fs');
var api = require('../../api');

exports.command = 'add';

exports.desc = 'Add a certificate. (Reads PEM from stdin)';

exports.builder = function(yargs) {
    yargs.option('file', {
        alias:       'f',
        description: 'Read cert from disk instead of stdin',
        type:        'string',
    });
};

exports.handler = function add_cert_handler(argv) {

    if (argv.hasOwnProperty('file')) {
        fs.readFile(argv.file, function(err, data){
            if (err) {
                console.error(err.message);
                process.exit(1);
            }
            addCert(argv, data.toString());
        });
    } else {

        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        var buffer = '';
        process.stdin.on('data', function(chunk) {
            buffer += chunk;
        });

        process.stdin.on('end', function() {
            addCert(argv, buffer);
        });
    
    }
};

function addCert(argv, data) {
    api.init(argv).addCert(data)
        .then(function(response){
            switch (response.res.status) {
                case 201: console.log('Certificate successfully created. SHA256:', response.data.sha256); break;
                case 202: console.log('Certificate already exists:',               response.data.sha256); break;
            }
        })
        .catch(api.catchError);
}