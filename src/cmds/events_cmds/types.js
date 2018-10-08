exports.command = 'types <command>';

exports.desc = 'Manage event types';

exports.builder = function (yargs) {
  return yargs.commandDir('types_cmds');
};