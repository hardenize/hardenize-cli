exports.command = 'hdb <command>';

exports.desc = 'Search HDB';

exports.builder = function (yargs) {
  return yargs.commandDir('hdb_cmds');
};