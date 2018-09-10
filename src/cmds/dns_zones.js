exports.command = 'dns-zones <command>';

exports.desc = 'Manage dns zones';

exports.builder = function (yargs) {
  return yargs.commandDir('dns_zones_cmds');
};