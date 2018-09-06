var api = require('../../api');

exports.command = 'ls [host]';

exports.desc = 'List certificates';

exports.builder = function(yargs) {
    yargs.option('active',         { type: 'boolean', description: 'Return only active cerificates' });
    yargs.option('expired',        { type: 'boolean', description: 'Return only expired certificates' });
    yargs.option('expire-in-days', { type: 'number',  description: 'Return only certificates that have already expired or expire in the specified number of days, according to the effectiveNotAfter timestamp' });
    yargs.option('limit',          { type: 'number',  description: 'Return only up to the specified number of certificates' });
    yargs.option('new-since',      { type: 'date',    description: 'Return only certificates added to the account since the specified date' });
    yargs.option('spki-sha256',    { type: 'string',  description: 'Return only certificates whose public key (SPKI) matches the provided hash' });
}

exports.handler = function ls_certs_handler(argv) {
    
    var opt = {};
    if (argv.active  === true)  opt.active  = true;
    if (argv.active  === false) opt.active  = false;
    if (argv.expired === true)  opt.expired = true;
    if (argv.expired === false) opt.expired = false;
    if (argv.hasOwnProperty('expire-in-days')) opt.expireInDays = argv['expire-in-days'];
    if (argv.hasOwnProperty('host'))           opt.host         = argv.host;
    if (argv.hasOwnProperty('limit'))          opt.limit        = argv.limit;
    if (argv.hasOwnProperty('new-since'))      opt.newSince     = argv['new-since'];
    if (argv.hasOwnProperty('spki-sha256'))    opt.spkiSha256   = argv['spki-sha256'];

    api.init(argv).getCerts(opt)
        .then(function(response){
            console.log(JSON.stringify(response.data, null, 2));
        })
        .catch(api.catchError);

};