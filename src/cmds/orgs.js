exports.command = 'orgs <command>';

exports.desc = 'Manage organizations';

exports.builder = function (yargs) {
  return yargs.commandDir('orgs_cmds');
};