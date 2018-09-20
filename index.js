#!/usr/bin/env node

var os     = require('os');
var path   = require('path');
var api    = require('./src/api');

require('yargs')
    .epilogue('Find our API documentation at https://www.hardenize.com/docs/api/v' + api.version() + '/')
    .option('config', {
        alias:       'c',
        default:     path.join(os.homedir(), '.hardenize'),
        description: 'Path to configuration file',
        type:        'string',
    })
    .option('org', {
        description: 'Organization (falls back to config default_org)',
        type:        'string',
    })
    .option('format', {
        description: 'Output format (falls back to config "default_format", otherwise "yaml")',
        choices:     ['yaml', 'json', 'csv'],
    })
    .option('debug', {
        alias:       'd',
        type:        'boolean',
        description: 'Displays debug information about API requests and responses',
    })
    .commandDir('src/cmds')
    .demandCommand()
    .strict()
    .help()
    .argv;