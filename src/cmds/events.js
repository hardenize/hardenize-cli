exports.command = 'events <command>';

exports.desc = 'Manage events';

exports.builder = function (yargs) {
  return yargs.commandDir('events_cmds');
};