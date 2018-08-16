#!/usr/bin/env node

var fs              = require('fs');
var os              = require('os');
var path            = require('path');
var program         = require('commander');
var readline        = require('readline');
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
  .action(handle_config);

program
  .command('get-config')
  .description('Display configuration')
  .action(handle_get_config);

program
  .command('ls-certs')
  .option('-o, --org [org]', 'Organization. If not supplied, uses default organization')
  .description('List all certificates for an organization')
  .action(handle_ls_certs);

program
  .command('get-cert <sha256>')
  .option('-o, --org [org]',    'Organization. If not supplied, uses default organization')
  .description('Get certificates for an organization')
  .action(handle_get_cert);

program
  .command('upload-cert')
  .option('-o, --org [org]',    'Organization. If not supplied, uses default organization')
  .description('Get certificates for an organization')
  .action(handle_upload_cert);

program.on('command:*', function () {
  console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
  process.exit(1);
});

var command_run = false;
function pre_handle_command(cmd) {
  command_run = true;
  if (cmd.parent.config) configPath = cmd.parent.config;
}

program.parse(process.argv);

if (!command_run) program.outputHelp();

function handle_get_config(cmd) {
  pre_handle_command(cmd);

  console.log(JSON.stringify(read_config(), null, 2));
}

function handle_config(cmd) {
  pre_handle_command(cmd);

  var rl = readline.createInterface({
    input:  process.stdin,
    output: process.stdout
  });

  var config = read_config();

  rl.question('* API Username' + (config.username ? ' [' + config.username + ']' : '') + ': ', function(username) {
    if (username.length) {
      config.username = username;
    } else if (!config.username) {
      exit_error('Invalid username');
    }
    rl.question('* API Password' + (config.password ? ' [' + config.password + ']' : '') + ': ', function(password) {
      if (password.length) {
        config.password = password;
      } else if (!config.password) {
        exit_error('Invalid password');
      }
      rl.question('  Default organization: ', function(default_org) {
        if (default_org.length) {
          config.default_org = default_org;
        } else {
          delete config.default_org;
        }
        rl.close();
        write_config(config);
        console.log('Configuration saved');
      });
    });
  });
}

function handle_ls_certs(cmd) {
  pre_handle_command(cmd);

  setupApi(cmd.org);
  var api = new HardenizeOrgApi.CertificatesApi();

  api.listCertificates(function(error, data, response) {
    if (error) exit_error(error.message);
    console.log(JSON.stringify(data.certs, null, 2));
  });
}

function handle_get_cert(sha256, cmd) {
  pre_handle_command(cmd);

  setupApi(cmd.org);
  var api = new HardenizeOrgApi.CertificatesApi();

  api.retrieveACertificate(sha256, function(error, data, response) {
    if (error) exit_error(error.message);
    console.log(JSON.stringify(data.cert, null, 2));
  });
}

function handle_upload_cert(cmd) {
  pre_handle_command(cmd);

  setupApi(cmd.org);
  var api = new HardenizeOrgApi.CertificatesApi();

  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  var buffer = '';
  process.stdin.on('data', function(chunk) {
    buffer += chunk;
  });
  process.stdin.on('end', function() {
    api.createACertificate(buffer, function(error, _, response) {
      if (error) exit_error('API:', error.message);
      switch (response.status) {
        case 201: return console.log('Certificate successfully created');
        case 204: return console.log('Certificate already exists');
        default:  exit_error('Unexpected response code', response.status);
      }
    });
  });
}

function setupApi(orgLabel) {
  if (!orgLabel) orgLabel = default_org();
  if (!orgLabel) exit_error('Either set a default org in the config, or specify --org');
  
  var config = read_config();

  if (!config.username || !config.password) {
    console.warn('You must configure the API username and password first');
  }

  apiClient.basePath = config.base_url + '/org/' + orgLabel + '/api/v' + api_version;
  var auth      = apiClient.authentications['Basic HTTP Authentication'];
  auth.username = config.username;
  auth.password = config.password;

  if (config.disable_tls_validation) process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
}

function exit_error() {
  console.warn.apply(null, arguments);
  process.exit(1);
}

function default_org() {
  return read_config().default_org;
}

function read_config() {
  let config = {};
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