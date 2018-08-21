exports.command = 'config <command>';

exports.desc = 'Manage configuration';

exports.builder = function (yargs) {
  return yargs.commandDir('config_cmds');
};

exports.handler = function (argv) {};