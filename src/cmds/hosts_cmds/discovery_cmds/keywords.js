exports.command = 'keywords <command>';

exports.desc = 'Manage host discovery keywords';

exports.builder = function (yargs) {
  return yargs.commandDir('keywords_cmds');
};