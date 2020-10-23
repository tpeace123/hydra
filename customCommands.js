module.exports = {
  add: addCommand,
  del: delCommand,
  list: list,
  getCommand: getCommand,
  useCommand: useCommand
}

var fs = require('fs');

var commands = require('./hydra_json/customCommands.json');

const permissionGroups = {
  basic: ['SEND_MESSAGES'],
  role: ["SEND_MESSAGES", "MANAGE_ROLES"]
}

const userPermissonGroups = {
  role: ["MANAGE_ROLES"]
}

/**
 * Return values
 *
 * g: Unknown guild object/guild id
 * t: Same command already exists for this guild
 * n: Command does not exist
 * s: Successful action
 * e: There are no custom commands for this guild
 */

/**
 * Object setup
 * 
 * <Guild ID> {
 *   <name>: {
 *     type: <type (message/role)>
 *     user: <availability (e/m)>
 *   }
 * }
 */

function addCommand(guild, name, type, user, args) {
  if (guild && guild.id) {
    if (!commands[guild.id] || !commands[guild.id][name]) {
      if (!commands[guild.id]) commands[guild.id] = {};
      commands[guild.id][name] = {
        "type": type,
        "user": user,
        "action": args
      };
      _writeFile();
      return "s";
    }
    else return "t";
  }
  else return "g";
}

function delCommand(guild, name) {
  if (guild && guild.id && commands[guild.id] && commands[guild.id][name]) {
    delete commands[guild.id][name];
    if (Object.keys(commands[guild.id]).length === 0) delete commands[guild.id];
    _writeFile();
    return "s";
  }
  else {
    if (!guild || !guild.id) return "g";
    else return "n";
  }
}

function list(guild) {
  if (guild && guild.id && commands[guild.id]) {
    return commands[guild.id];
  }
  else {
    if (!guild || !guild.id) return "g";
    else return "e";
  }
}

function getCommand(guild, name) {
  if (guild && guild.id && commands[guild.id] && commands[guild.id][name]) {
    return commands[guild.id][name];
  }
  else return;
}

async function useCommand(message, command, args, client) {
  if (message.guild.id && commands[message.guild.id] && commands[message.guild.id][command]) {
    if (commands[message.guild.id][command].type === "message") {
      if (_hasPermission(message, permissionGroups.basic)) {
        message.channel.send(commands[message.guild.id][command].action);
      }
      else message.author.send("I am missing the permissions: " + permissionGroups.basic);
    }
    else {
      if (_hasPermission(message, permissionGroups.role)) {
        let member;
        if (commands[message.guild.id][command].user === "m") {
          if (!_userHasPermission(message, userPermissonGroups.role)) {
            message.author.send("You are missing the permissions: " + userPermissonGroups.role);
            return;
          }
          member = await message.mentions.members.first();
          if (!member) {
            member = await message.guild.member(args[0]);
            if (!member) member = message.member;
          }
        }
        else {
          member = message.member;
        }
        member.roles.add(commands[message.guild.id][command].action).then(function() {
          message.channel.send(`Added roles to \`${member.user.tag}\``);
        }).catch(function(err) {
          message.author.send("I was unable to add roles. Check to see if the selected roles are above my bot role.");
          return;
        });
      }
      else message.author.send("I am missing the permissions: " + permissionGroups.role);
    }
  }
  else return;
}

function _writeFile() {
  fs.writeFile('./hydra_json/customCommands.json', JSON.stringify(commands), function(err) {
    if (err) console.error(err);
  });
}

function _hasPermission(message, group) {
  return message.guild.me.hasPermission(group);
}

function _userHasPermission(message, group) {
  return message.member.hasPermission(group);
}