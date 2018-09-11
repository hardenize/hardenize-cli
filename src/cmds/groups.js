exports.command = 'groups <command>';

exports.desc = 'Manage groups';

exports.builder = function (yargs) {
  return yargs.commandDir('groups_cmds');
};