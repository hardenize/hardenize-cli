exports.command = 'certs <command>';

exports.desc = 'Search HDB for certificates';

exports.builder = function (yargs) {
  return yargs.commandDir('certs_cmds');
};