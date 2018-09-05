exports.command = 'certs <command>';

exports.desc = 'Manage certificates';

exports.builder = function (yargs) {
  return yargs.commandDir('certs_cmds');
};