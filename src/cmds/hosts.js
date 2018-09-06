exports.command = 'hosts <command>';

exports.desc = 'Manage hosts';

exports.builder = function (yargs) {
  return yargs.commandDir('hosts_cmds');
};