exports.command = 'mgmt_ip_whitelist <command>';

exports.desc = 'Manage the management IP whitelist';

exports.builder = function (yargs) {
  return yargs.commandDir('mgmt_ip_whitelist_cmds');
};