exports.command = 'access_control <command>';

exports.desc = 'Manage access control';

exports.builder = function (yargs) {
  return yargs.commandDir('access_control_cmds');
};