var cmd = require('../../../../cmd');

exports.command = 'update <keyword>';

exports.desc = 'Updates a host discovery keyword';

exports.builder = function(yargs) {
    yargs.option('op',        { required: true, type: 'string', description: 'Operation to perform (applied to exclusions)', choices: ['clear', 'set', 'add', 'remove'] });
    yargs.option('exclusion', { type: 'array', description: 'Supply as "type:value", e.g: "substring:hardenize"' });
};

exports.handler = function update_host_discovery_keyword_handler(argv) {

    var opt = {
        op: argv.op,
    };
    if (argv.exclusion && argv.exclusion.length) {
        opt.exclusions = argv.exclusion.map(function(value){
            var m = value.match(/^([^]+):(.+)$/);
            if (!m) cmd.catchError('Invalid exclusion: ' + value);
            return {
                type:      m[1],
                exclusion: m[2],
            };
        });
    }

    cmd.api(argv).updateHostDiscoveryKeyword(argv.keyword, opt)
        .then(function(response){
            cmd.displayResults(argv, response.data.hostDiscoveryKeyword);
        })
        .catch(function(err){
            if (err.res && err.res.status === 404) cmd.fail('Keyword not found');
            return Promise.reject(err);
        })
        .catch(cmd.catchError);
};
