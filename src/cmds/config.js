exports.command = 'config <command>';

exports.desc = 'Manage configuration at Hardenize';

exports.builder = function (yargs) {
  return yargs.commandDir('config_cmds');
};