exports.command = 'users <command>';

exports.desc = 'Manage users';

exports.builder = function (yargs) {
  return yargs.commandDir('users_cmds');
};