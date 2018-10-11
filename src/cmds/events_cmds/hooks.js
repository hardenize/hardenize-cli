exports.command = 'hooks <command>';

exports.desc = 'Manage event hooks';

exports.builder = function (yargs) {
  return yargs.commandDir('hooks_cmds');
};