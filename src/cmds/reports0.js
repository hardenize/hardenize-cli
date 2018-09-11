exports.command = 'reports0 <command>';

exports.desc = 'Manage reports (unstable)';

exports.builder = function (yargs) {
  return yargs.commandDir('reports0_cmds');
};