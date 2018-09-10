exports.command = 'reports0 <command>';

exports.desc = 'Manage reports.\n\nThis command uses an unstable API end-point and is therefore unstable it\'s self. Expect it to disappear';

exports.builder = function (yargs) {
  return yargs.commandDir('reports0_cmds');
};