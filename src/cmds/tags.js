exports.command = 'tags <command>';

exports.desc = 'Manage tags';

exports.builder = function (yargs) {
  return yargs.commandDir('tags_cmds');
};