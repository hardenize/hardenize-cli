var fs          = require('fs');
var cli_version = require('../package.json').version;
var cmd         = require('./cmd');

module.exports.read  = read_config;
module.exports.write = write_config;

function read_config(argv, options) {
    if (typeof options === 'undefined' || options === null) options = {};

    var config = {};
    if (fs.existsSync(argv.config)) {
        var data;
        try {
            data = fs.readFileSync(argv.config);
        } catch (err) {
            cmd.fail('Failed to read config at', argv.config, '-', err.toString());
        }
        try {
            config = JSON.parse(data);
        } catch (err) {
            cmd.fail('Failed to parse config at', argv.config, '-', err.toString());
        }
    }
    if (!config.cli_version) config.cli_version = cli_version;

    if ([
        'https://www.hardenize.com',
        'https://api.hardenize.com',
    ].some(u => u === config.base_url)) {
        delete config.base_url;
    }

    migrate_config(argv, options, config);

    if (!options.no_env) {
        Object.keys(process.env).forEach(function(envName){
            var m = envName.match(/^HZ_(.+)$/);
            if (!m) return;
            var name = m[1].toLowerCase();
            if (name === 'cli_version') return;
            config[name] = process.env[envName];
        });
    }

    return config;
}

function write_config(argv, config) {
    config.cli_version = cli_version;

    var create = !fs.existsSync(argv.config);
    fs.writeFileSync(argv.config, JSON.stringify(config, null, 2));
    if (create) fs.chmodSync(argv.config, 0600);
}

function migrate_config(argv, options, config) {

    if (config.cli_version === '0.0.1') {
      var default_org;
      Object.keys(config.orgs).forEach(function(org){
          if (config.orgs[org].default) default_org = org;
          config.username = config.username || config.orgs[org].username;
          config.password = config.password || config.orgs[org].password;
      });
      delete config.orgs;
      if (default_org) config.default_org = default_org;
      write_config(argv, config);
    }

    return config;
}