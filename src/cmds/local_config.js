exports.command = 'local_config <command>';

exports.desc = 'Manage local configuration';

exports.builder = function (yargs) {
  return yargs.commandDir('local_config_cmds');
};