#!/usr/bin/env node

var fs           = require('fs');
var os           = require('os');
var path         = require('path');
var program      = require('commander');
var HardenizeApi = require('@hardenize/api');

var cli_version = require('./package.json').version;
var configPath  = path.join(os.homedir(), '.hardenize');

var devMode = false;
for (var i = 2; i < process.argv.length; ++i) {
    if (process.argv[i] === '--dev-mode') devMode = true;
}

program.version(cli_version, '-v, --version')
program.option('-c, --config [config-path]', 'Path to config. Default is ~/.hardenize');
if (devMode) program.option('--dev-mode', 'Enable dev mode');

program
    .command('config')
    .description('Create / edit configuration')
    .action(handle_command('config'));

program
    .command('get-config')
    .description('Display configuration')
    .action(handle_command('get_config'));

program
    .command('get-certs')
    .option('-o, --org [org]',             'Organization. If not supplied, uses default organization')
    .option('--active  [yes/no]',          'Filter by active',  opt_bool('active'))
    .option('--expired [yes/no]',          'Filter by expired', opt_bool('expired'))
    .option('--expire-in-days <days>',     'Include only certificates that have already expired or expire in the specified number of days, according to the effectiveNotAfter timestamp', opt_int('expire-in-days'))
    .option('--host  <host>',              'Include only certificates that are valid for the specified host, either because they contain the exact hostname or because they are wildcards and contain the parent hostname (e.g., a search for blog.example.com will match *.example.com wildcards)')
    .option('--limit <max>',               'Maximum number of certificates to return', opt_int('limit'))
    .option('--spki-sha256 <spki-sha256>', 'Include only certificates whose public key (SPKI) matches the provided hash', opt_sha256('spki-sha256'))
    .description('List all certificates')
    .action(handle_command('get_certs'));

program
    .command('get-cert <sha256>')
    .option('-o, --org [org]', 'Organization. If not supplied, uses default organization')
    .description('Get a certificate')
    .action(handle_command('get_cert'));

program
    .command('add-cert')
    .option('-o, --org [org]', 'Organization. If not supplied, uses default organization')
    .description('Add a certificate (reads as PEM from stdin)')
    .action(handle_command('add_cert'));

if (devMode) {
    program.command('del-cert <sha256>')
        .option('-o, --org [org]', 'Organization. If not supplied, uses default organization')
        .description('Delete a certificate (DEV-MODE)')
        .action(handle_command('del_cert'));
}

program
    .command('add-dns-zone <root>')
    .description('Add DNS zone file (reads bind compatible zone from stdin)')
    .option('-o, --org [org]', 'Organization. If not supplied, uses default organization')
    .option('--status [status]', 'Status for new hosts discovered in zone file: monitored, idle or archive')
    .action(handle_command('add_dns_zone'));

program.on('command:*', function () {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
    process.exit(1);
});

var command_run = false;
program.parse(process.argv);
if (!command_run) program.outputHelp();

function handle_command(name) {
    return function() {

        command_run = true;
        var func    = require('./command/' + name);

        var cmd = arguments[arguments.length-1];
        if (cmd.parent && cmd.parent.config) configPath = cmd.parent.config;

        var ctx = {
            read_config:  read_config,
            write_config: write_config,
            api:          api(cmd),
        };

        try {
            var res = func.apply(ctx, arguments);
            if (res instanceof Promise) {
                res.catch(exit_error);
            }
        } catch(err) {
            exit_error(err.message);
        }
    }
}

function api(cmd) {
    return function() {
        var config = read_config();

        var orgLabel = cmd.org || config.default_org;
        if (!orgLabel) throw new Error('Either set a default org in the config, or specify --org');

        if (!config.username || !config.password) {
            console.warn('You must configure the API username and password first');
        }

        if (config.disable_tls_validation) process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

        var apiConfig = {
            user: config.username,
            pass: config.password,
            org:  orgLabel,
        };
        if (config.base_url) apiConfig.url = config.base_url;
        if (devMode) apiConfig.devMode = true;

        return new HardenizeApi(apiConfig);
    };
}

function exit_error(err) {
    var res     = err.res;
    var message = err instanceof Error ? err.message : err;
    if (res)                                console.error('Error: ' + res.status + ' ' + res.statusText);
    if ((!res || res.statusText !== message) && message.length) console.error('Error: ' + message);

    if (err.data) console.error(JSON.stringify(err.data, null, 2));
    process.exit(1);
}

function read_config() {
    var config = {};
    if (fs.existsSync(configPath)) {
        config = JSON.parse(fs.readFileSync(configPath));
    }
    if (!config.cli_version) config.cli_version = cli_version;
    if (!config.base_url)    config.base_url    = 'https://www.hardenize.com';

    return migrate_config(config);
}

function write_config(config) {
    config.cli_version = cli_version;

    var create = !fs.existsSync(configPath);
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    if (create) fs.chmodSync(configPath, 0600);
}

function migrate_config(config) {

    if (config.cli_version === '0.0.1') {
      var default_org;
      Object.keys(config.orgs).forEach(function(org){
          if (config.orgs[org].default) default_org = org;
          config.username = config.username || config.orgs[org].username;
          config.password = config.password || config.orgs[org].password;
      });
      delete config.orgs;
      if (default_org) config.default_org = default_org;
      write_config(config);
    }

    return config;
}

function opt_bool(name) {
    return function (val) {
        if (val.match(/^(t(rue)?|y(es?)?|1)$/i)) return true;
        if (val.match(/^(f(alse)?|no?|0)$/i))    return false;
        exit_error('Invalid bool value passed to ' + name + '. Should be one of true/yes/false/no');
    };
}

function opt_int(name) {
    return function (val) {
        if (val.match(/^[1-9][0-9]*$/)) return parseInt(val, 10);
        exit_error('Invalid integer value passed to ' + name);
    };
}

function opt_sha256(name) {
    return function (val) {
        val = val.toLowerCase();
        if (val.match(/^[a-f0-9]{64}$/)) return val;
        exit_error('Invalid sha256 value passed to ' + name);
    };
}