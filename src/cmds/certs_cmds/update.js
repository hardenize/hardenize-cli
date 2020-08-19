var cmd = require('../../cmd');

exports.command = 'update <sha256>';

exports.desc = 'Update a certificate';

exports.builder = function(yargs) {
    yargs.option('mute', { type: 'boolean', description: 'Mute/unmute a certificate' });
}

exports.handler = function update_cert_handler(argv) {

    var options = {};

    if (argv.hasOwnProperty('mute')) {
        options.muted = argv.mute;
    }

    if (Object.keys(options).length === 0) {
        cmd.fail('Must specify at least one thing to update')
    }

    cmd.api(argv).updateCert(argv.sha256, options)
        .then(function(_response){
            console.log('Cert updated');
        })
        .catch(function(err){
            if (err.res && err.res.status === 404) cmd.fail('Certificate not found');
            return Promise.reject(err);
        })
        .catch(cmd.catchError);
}
