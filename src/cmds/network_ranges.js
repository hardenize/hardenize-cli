exports.command = 'network-ranges <command>';

exports.desc = 'Manage network ranges';

exports.builder = function (yargs) {
  return yargs.commandDir('network_ranges_cmds');
};