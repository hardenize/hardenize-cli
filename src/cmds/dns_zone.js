exports.command = 'dns-zone <command>';

exports.desc = 'Manage dns zones';

exports.builder = function (yargs) {
  return yargs.commandDir('dns_zone_cmds');
};

exports.handler = function (argv) {};