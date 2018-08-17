#!/usr/bin/env node

var fs              = require('fs');
var os              = require('os');
var path            = require('path');
var program         = require('commander');
var HardenizeOrgApi = require('./openapi/dist');

var cli_version = require('./package.json').version;
var api_version = '0';
var configPath  = path.join(os.homedir(), '.hardenize');

var apiClient = HardenizeOrgApi.ApiClient.instance;

program.version(cli_version, '-v, --version')
program.option('-c, --config [config-path]', 'Path to config. Default is ~/.hardenize');

program
  .command('config')
  .description('Create / edit configuration')
  .action(handle_command('config'));

program
  .command('get-config')
  .description('Display configuration')
  .action(handle_command('get_config'));

program
  .command('ls-certs')
  .option('-o, --org [org]',           'Organization. If not supplied, uses default organization')
  .option('--active [yes/no]',         'Filter by active',  opt_bool('active'))
  .option('--expired [yes/no]',        'Filter by expired', opt_bool('expired'))
  .option('--expireInDays <days>',     'Include only certificates that have already expired or expire in the specified number of days, according to the effectiveNotAfter timestamp', opt_int('expireInDays'))
  .option('--host <host>',             'Include only certificates that are valid for the specified host, either because they contain the exact hostname or because they are wildcards and contain the parent hostname (e.g., a search for blog.example.com will match *.example.com wildcards)')
  .option('--limit <max>',             'Maximum number of certificates to return', opt_int('limit'))
  .option('--spkiSha256 <spkiSha256>', 'Include only certificates whose public key (SPKI) matches the provided hash', opt_sha256('spkiSha256'))
  .description('List all certificates')
  .action(handle_command('ls_certs'));

program
  .command('get-cert <sha256>')
  .option('-o, --org [org]',    'Organization. If not supplied, uses default organization')
  .description('Get a certificate')
  .action(handle_command('get_cert'));

program
  .command('upload-cert')
  .option('-o, --org [org]',    'Organization. If not supplied, uses default organization')
  .description('Upload a certificate')
  .action(handle_command('upload_cert'));

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
      exit_api_error: exit_api_error,
      read_config:    read_config,
      write_config:   write_config,
      api:            api(cmd),
    };

    try {
      func.apply(ctx, arguments);
    } catch(err) {
      console.warn(err.message);
      process.exit(1);
    }
  }
}

function api(cmd) {
  return function(name) {
    var config = read_config();

    var orgLabel = cmd.org || config.default_org;
    if (!orgLabel) throw new Error('Either set a default org in the config, or specify --org');

    if (!config.username || !config.password) {
      console.warn('You must configure the API username and password first');
    }

    apiClient.basePath = config.base_url + '/org/' + orgLabel + '/api/v' + api_version;
    var auth      = apiClient.authentications['Basic HTTP Authentication'];
    auth.username = config.username;
    auth.password = config.password;

    if (config.disable_tls_validation) process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

    return new HardenizeOrgApi[name + 'Api']();
  };
}

function exit_error() {
  console.warn.apply(null, arguments);
  process.exit(1);
}

function exit_api_error(error, response) {
  console.warn(error.status + ' ' + error.message);
  if (response && response.error && response.error.text) {
      console.log(response.error.text);
  }
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