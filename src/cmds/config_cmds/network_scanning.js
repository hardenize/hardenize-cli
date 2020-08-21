exports.command = 'network_scanning <command>';

exports.desc = 'Manage the network scanning configuration';

exports.builder = function (yargs) {
  return yargs.commandDir('network_scanning_cmds');
};