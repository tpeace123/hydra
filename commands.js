var config = require('./auth.json');
var getPrefix = require('./prefix.js').getPrefix;
var setPrefix = require('./prefix.js').setPrefix;

module.exports = {
  hmw: hmw,
  prefix: prefix,
  commands: commands
}

const permissionGroups = {
  basic: ['SEND_MESSAGES'],
  upload: ['SEND_MESSAGES', 'ATTACH_FILES'],
  kick: ['SEND_MESSAGES', 'KICK_MEMBERS'],
  ban: ['SEND_MESSAGES', 'BAN_MEMBERS']
}

function hmw(message, args) {
  if (_hasPermission(message, permissionGroups.basic)) {
    if (args && args.length) {
      let help = args.join(' ');
      let personalProblems = ['life', 'my life', 'friends', 'a boyfriend', 'a girlfriend'];
      if (personalProblems.indexOf(help) > -1) message.channel.send("That sounds like a personal problem.");
      else message.channel.send("It looks like you might need help with `" + help + "`");
    }
    else message.channel.send("I'm not sure what you need help with. Try `" + getPrefix(message) + "hmw [topic]`");
  }
  else message.author.send("I don't have the permissions: ", permissionGroups.basic);
}

function prefix(message, args) {
  if (_hasPermission(message, permissionGroups.basic)) {
    if (args && args.length) {
      let newPrefix = args[0];
      setPrefix(message, newPrefix);
      message.channel.send(`Set new prefix to ${newPrefix}`)
    }
    else message.channel.send(`Usage: ${getPrefix(message)}prefix <new_prefix>`);
  }
  else message.author.send("I don't have the permissions: ", permissionGroups.basic);
}

function commands(message, args) {
  if (_hasPermission(message, permissionGroups.basic) {
    let cmds = module.exports.keys();
    message.channel.send('Usable commands: ' + JSON.stringify(cmds));
  }
  else message.author.send("I don't have the permissions: " + permissionGroups.basic);
}

function _hasPermission(message, group) {
  return message.guild.me.hasPermission(group);
}