exports.command = 'suborgs <command>';

exports.desc = 'Manage organizations';

exports.builder = function (yargs) {
  return yargs.commandDir('suborgs_cmds');
};