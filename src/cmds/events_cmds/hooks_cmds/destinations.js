exports.command = 'destinations <command>';

exports.desc = 'Manage event hook destinations';

exports.builder = function (yargs) {
  return yargs.commandDir('destinations_cmds');
};