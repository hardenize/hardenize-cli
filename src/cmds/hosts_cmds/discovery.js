exports.command = 'discovery <command>';

exports.desc = 'Manage host discovery';

exports.builder = function (yargs) {
  return yargs.commandDir('discovery_cmds');
};