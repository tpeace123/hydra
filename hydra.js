var config = require('./hydrauth.json'); // Main config file.
// var config = require('./auth.json'); // Alternate config file.
/* config
{
  "token": "<token>",
  "prefix": "<default prefix>",
  "sugChannel": "<suggestion channel>",
  "server_link": "https://discord.gg/T8w7dJW",
  "dbl": {
    "invite": "https://top.gg/bot/543909504706674688",
    "token": "<dbl token>",
    "vote": "https://top.gg/bot/543909504706674688/vote"
  },
  "userids": {
    "dev": "<dev id>",
    "owner": "<owner id>"
  }
}
*/

var fs = require('fs');
var Discord = require('discord.js');
var client = new Discord.Client();
var DBL = require('dblapi.js');
var dbl = new DBL(config.dbl.token, client);
var commands = require('./commands.js');
var commandsUse = {
  "hmw": 0,
  "prefix": 0,
  "ping": 0,
  "pong": 0,
  "commands": 0,
  "roll": 0,
  "links": 0,
  "rip": 0,
  "kick": 0,
  "ban": 0,
  "bulkdel": 0,
  "suggest": 0,
  "invite": 0,
  "avatar": 0,
  "flip": 0,
  "add": 0,
  "subtract": 0,
  "divide": 0,
  "multiply": 0,
  "welcome": 0,
  "help": 0,
  "react": 0,
  "8ball": 0,
  "blackjack": 0,
  "info": 0,
  "remind": 0,
  "rps": 0
};
// var voiceCommands = require('./voiceCommands.js');

// Prefix require
var prefix = require('./prefix.js');

// Welcome require
var welJoinChannel = require('./welcome.js').getJoinChannel;
var welJoinEnabled = require('./welcome.js').getJoinEnable;
var welLeaveChannel = require('./welcome.js').getLeaveChannel;
var welLeaveEnabled = require('./welcome.js').getLeaveEnable;

// Logs require
// var getChannel = require('./logs.js').getChannel;
// var getMessage = require('./logs.js').getMessage;
// var getRole = require('./logs.js').getRole;
// var getLogsChannel = require('./logs.js').getLogsChannel;

var timeout = [''];

client.login(config.token);

client.on('ready', _ready);

client.on('message', _parseMessage);

// client.on('message', _parseVC);

client.on('guildCreate', _createGuild);

client.on('guildMemberAdd', _memberJoin);

client.on('guildMemberRemove', _memberLeave);

client.on('guildDelete', _deleteGuild);

// client.on('channelCreate', _channelCreate);

// client.on('channelDelete', _channelDelete);

// client.on('messageDelete', _messageDelete);

// client.on('messageDeleteBulk', _messageBulkDel);

// // client.on('roleCreate', _roleCreate);

// client.on('roleDelete', _roleDelete);

// client.on('roleUpdate', _roleUpdate);

function _ready() {
  console.log(`\nConnected as ${client.user.tag}`);
  _setFirstActivity();
  _setActivity();
  setInterval(function() {
    dbl.postStats(client.guilds.cache.size);
  }, 1800000);
  setInterval(function() {
    _postCommands();
  }, 86400000);
}

function _parseMessage(message) {
  if (message && (message.author === client.user || message.author.bot || !message.guild)) return;
  else if (message && message.content && message.content.toLowerCase().startsWith(prefix.getPrefix(message))) _processCommand(message);
  else return;
}

async function _parseVC(message) {
  if (message && (message.author === client.user || message.author.bot || !message.guild)) return;
  else if (message && message.content && message.content.toLowerCase().startsWith(prefix.getPrefix())) _vcCommand(message);
  else return;
}

async function _setFirstActivity() {
  await client.user.setActivity(`Poker on ${config.prefix}help with ${client.guilds.cache.size} servers.`);
}

function _memberJoin(member) {
  // Check if join messages are enabled or if guild is DBL
  if (!welJoinEnabled(member.guild) || member.guild.id === '264445053596991498') return;
  // Get channel
  let channel = member.guild.channels.cache.get(welJoinChannel(member.guild));
  // Check if channel exists
  if (!channel) return;
  // Send welcome embed
  channel.send({
    embed: {
      color: Math.ceil(Math.random() * 16777215),
      author: {
        name: client.user.tag,
        icon_url: client.user.displayAvatarURL(),
      },
      title: "Member Join",
      thumbnail: {
        url: member.user.displayAvatarURL(),
      },
      fields: [
        {
          name: 'Username',
          value: `${member.user.tag}`,
          inline: true,
        },
        {
          name: '\u200b',
          value: '\u200b',
          inline: true
        },
      ],
      timestamp: new Date(),
      footer: {
        icon_url: member.guild.iconURL({dynamic: true}),
        text: `${member.guild.name}`
      }
    }
  });
}

function _memberLeave(member) {
  // Check if leave messages are enabled or if guild is DBL
  if (!welLeaveEnabled(member.guild) || member.guild.id === '264445053596991498') return;
  // Get channel
  let channel = member.guild.channels.cache.get(welLeaveChannel(member.guild));
  // Check if channel exists
  if (!channel) return;
  // Send leave embed
  channel.send({
    embed: {
      color: Math.ceil(Math.random() * 16777215),
      author: {
        name: client.user.tag,
        icon_url: client.user.displayAvatarURL()
      },
      title: 'Member Leave',
      thumbnail: {
        url: member.user.displayAvatarURL()
      },
      fields: [
        {
          name: 'Username',
          value: `${member.user.tag}`,
          inline: true
        },
        {
          name: '\u200b',
          value: '\u200b',
          inline: true
        }
      ],
      timestamp: new Date(),
      footer: {
        icon_url: member.guild.iconURL({dynamic: true}),
        text: `${member.guild.name}`
      }
    }
  });
}

function _createGuild(guild) {
  _setFirstActivity();
  _setActivity();
  // let sent = false;
  // guild.channels.cache.forEach(function(channel) {
  //   if (channel.type === 'text' && sent === false) {
  //     channel.send(`Thank you for inviting me to \`${guild.name}\`!\nMy default prefix is \`${config.prefix}\`\nTo access the commands list, use \`commands\`\nI have features like welcome message, moderator function, and social commands!\n\nMy support server link is \`${config.server_link}\`. Join this for bot updates, suggestions, and socializing.\nIf you would like to invite me to other servers, go to my DBL page at \`${config.invite_link}\``);
  //     sent = true;
  //   }
  // });
}

function _deleteGuild() {
  _setFirstActivity();
  _setActivity();
}

function _setActivity() {
  clearInterval(timeout[0]);
  let activity = {
    0: `Poker. ${config.prefix}help with ${client.guilds.cache.size} servers`,
    1: `my ${client.guilds.cache.size} servers. ${config.prefix}help for fun`,
    2: `the ${config.prefix}help of ${client.guilds.cache.size} guilds`,
    3: `Esports with ${client.guilds.cache.size} guilds on ${config.prefix}help`,
    4: `Games with ${client.guilds.cache.size} servers.`
  }
  let activityType = {
    0: "WATCHING",
    1: "WATCHING",
    2: "LISTENING",
    3: "WATCHING",
    4: "PLAYING"
  }
  /**
   * Activity:
   *   The activity (presence) of the bot
   * 
   * Activity Type:
   *   The type of activity from one of the three:
   *     PLAYING
   *     WATCHING
   *     LISTENING
   */
  timeout[0] = setInterval(function() {
    let num = Math.floor(Math.random() * Object.keys(activity).length);
    client.user.setActivity(activity[num], {type: activityType[num]});
  }, 1800000);
}

function _processCommand(message) {
  let command = message.content.toLowerCase().substr(prefix.getPrefix(message).length);
  let commandArray = command.split(' ');
  if (!commandArray.length) return;
  if (commands.hasOwnProperty(commandArray[0])) {
    commandsUse[commandArray[0]] += 1;
    commands[commandArray[0]](message, commandArray.slice(1), client);
  }
  else return;
}

function _channelCreate(channel) {
  if (!channel.guild || getChannel(channel.guild) === false) return;
  let sendChannel = client.channels.get(getLogsChannel(channel.guild));
  if (!sendChannel) return;
  sendChannel.send({
    embed: {
      color: 0xff0000,
      author: {
        name: client.user.tag,
        icon_url: client.user.displayAvatarURL(),
      },
      title: "Channel Create",
      description: "Logging Event",
      thumbnail: {
        url: client.user.displayAvatarURL(),
      },
      fields: [
        {
          name: "Channel Name",
          value: `${channel.name}`,
          inline: false,
        },
        {
          name: "Channel Type",
          value: `${channel.type}`,
          inline: false,
        },
      ],
      timestamp: new Date(),
    }
  });
}

function _channelDelete(channel) {
  if (!channel.guild || getChannel(channel.guild) === false) return;
  let sendChannel = client.channels.get(getLogsChannel(channel.guild));
  if (!sendChannel) return;
  sendChannel.send({
    embed: {
      color: 0xff0000,
      author: {
        name: client.user.tag,
        icon_url: client.user.displayAvatarURL(),
      },
      title: "Channel Delete",
      description: "Logging Event",
      thumbnail: {
        url: client.user.displayAvatarURL(),
      },
      fields: [
        {
          name: "Channel Name",
          value: `${channel.name}`,
          inline: false,
        },
        {
          name: "Channel Type",
          value: `${channel.type}`,
          inline: false,
        },
      ],
      timestamp: new Date(),
    }
  });
}

function _messageDelete(message) {
  if (!message.guild || getMessage(message.guild) === false) return;
  let sendChannel = client.channels.get(getLogsChannel(message.guild));
  if (!sendChannel) return;
  sendChannel.send({
    embed: {
      color: 0xff0000,
      author: {
        name: client.user.tag,
        icon_url: client.user.displayAvatarURL(),
      },
      title: "Message Delete",
      description: "Logging Event",
      thumbnail: {
        url: client.user.displayAvatarURL(),
      },
      fields: [
        {
          name: "Channel Name",
          value: `${message.channel.name}`,
          inline: false,
        },
      ],
      timestamp: new Date(),
    }
  });
}

function _messageBulkDel(message) {
  let messageGuild = message.find(val => val.guild).channel.guild;
  let messageChannel = message.find(val => val.channel).channel;
  if (!messageGuild || getMessage(messageGuild) === false) return;
  let sendChannel = client.channels.get(getLogsChannel(messageGuild));
  if (!sendChannel) return;
  sendChannel.send({
    embed: {
      color: 0xff0000,
      author: {
        name: client.user.tag,
        icon_url: client.user.displayAvatarURL(),
      },
      title: "Bulk Message Delete",
      description: "Logging Event",
      thumbnail: {
        url: client.user.displayAvatarURL(),
      },
      fields: [
        {
          name: "Channel Name",
          value: `${messageChannel.name}`,
          inline: false,
        },
        {
          name: "Messages Deleted",
          value: `${message.array().length}`,
          inline: false,
        },
      ],
      timestamp: new Date(),
    }
  });
}

function _roleCreate(role) {
  if (!role.guild || getRole(role.guild) === false) return;
  let sendChannel = client.channels.get(getLogsChannel(role.guild));
  if (!sendChannel) return;
  sendChannel.send({
    embed: {
      color: 0xff0000,
      author: {
        name: client.user.tag,
        icon_url: client.user.displayAvatarURL()
      },
      title: "Role Create",
      description: "Logging Event",
      thumbnail: {
        url: client.user.displayAvatarURL()
      },
      fields: [
        {
          name: "Role Name",
          value: `${role.name}`,
          inline: false
        }
      ],
      timestamp: new Date()
    }
  });
}

function _roleDelete(role) {
  if (!role.guild || getRole(role.guild) === false) return;
  let sendChannel = client.channels.get(getLogsChannel(role.guild));
  if (!sendChannel) return;
  sendChannel.send({
    embed: {
      color: 0xff0000,
      author: {
        name: client.user.tag,
        icon_url: client.user.displayAvatarURL()
      },
      title: "Role Delete",
      description: "Logging Event",
      thumbnail: {
        url: client.user.displayAvatarURL()
      },
      fields: [
        {
          name: "Role Name",
          value: `${role.name}`,
          inline: false
        }
      ],
      timestamp: new Date()
    }
  });
}

function _roleUpdate(oldRole, newRole) {
  if (!newRole.guild || getRole(newRole.guild) === false || oldRole.rawPosition !== newRole.rawPosition) return;
  let sendChannel = client.channels.get(getLogsChannel(newRole.guild));
  if (!sendChannel) return;
  sendChannel.send({
    embed: {
      color: 0xff0000,
      author: {
        name: client.user.tag,
        icon_url: client.user.displayAvatarURL()
      },
      title: "Role Update",
      description: "Logging Event",
      thumbnail: {
        url: client.user.displayAvatarURL()
      },
      fields: [
        {
          name: "Old Role Name",
          value: oldRole.name,
          inline: true
        },
        {
          name: "New Role Name",
          value: newRole.name,
          inline: true
        },
        {
          name: '\u200b',
          value: '\u200b',
          inline: true
        },
        {
          name: "Old Role Permissions",
          value: oldRole.permissions,
          inline: true
        },
        {
          name: "New Role Permissions",
          value: newRole.permissions,
          inline: true
        },
        {
          name: '\u200b',
          value: '\u200b',
          inline: true
        },
        {
          name: "Is Mentionable",
          value: newRole.mentionable,
          inline: true
        },
        {
          name: "Is Distinguished",
          value: newRole.hoist,
          inline: true
        }
      ],
      timestamp: new Date()
    }
  });
}

async function _postCommands() {
  await client.guilds.cache.get('630018316769034241').channels.cache.get('754083191576461482').send/*(`${new Date()}\n${JSON.stringify(commandsUse)}`);*/({
    embed: {
      color: 16777215,
      title: "Command Usage",
      fields: [
        {
          name: "hmw",
          value: commandsUse["hmw"],
          inline: true
        },
        {
          name: "prefix",
          value: commandsUse["prefix"],
          inline: true
        },
        {
          name: "ping",
          value: commandsUse["ping"],
          inline: true
        },
        {
          name: "pong",
          value: commandsUse["pong"],
          inline: true
        },
        {
          name: "commands",
          value: commandsUse["commands"],
          inline: true
        },
        {
          name: "roll",
          value: commandsUse["roll"],
          inline: true
        },
        {
          name: "links",
          value: commandsUse["links"],
          inline: true
        },
        {
          name: "rip",
          value: commandsUse["rip"],
          inline: true
        },
        {
          name: "kick",
          value: commandsUse["kick"],
          inline: true
        },
        {
          name: "ban",
          value: commandsUse["ban"],
          inline: true
        },
        {
          name: "bulkdel",
          value: commandsUse["bulkdel"],
          inline: true
        },
        {
          name: "suggest",
          value: commandsUse["suggest"],
          inline: true
        },
        {
          name: "invite",
          value: commandsUse["invite"],
          inline: true
        },
        {
          name: "avatar",
          value: commandsUse["avatar"],
          inline: true
        },
        {
          name: "flip",
          value: commandsUse["flip"],
          inline: true
        },
        {
          name: "add",
          value: commandsUse["add"],
          inline: true
        },
        {
          name: "subtract",
          value: commandsUse["subtract"],
          inline: true
        },
        {
          name: "divide",
          value: commandsUse["divide"],
          inline: true
        },
        {
          name: "multiply",
          value: commandsUse["multiply"],
          inline: true
        },
        {
          name: "welcome",
          value: commandsUse["welcome"],
          inline: true
        },
        {
          name: "help",
          value: commandsUse["help"],
          inline: true
        },
        {
          name: "react",
          value: commandsUse["react"],
          inline: true
        },
        {
          name: "8ball",
          value: commandsUse["8ball"],
          inline: true
        },
        {
          name: "blackjack",
          value: commandsUse["blackjack"],
          inline: true
        },
        {
          name: "info",
          value: commandsUse["info"],
          inline: true
        },
        {
          name: "remind",
          value: commandsUse["remind"],
          inline: true
        },
        {
          name: "rps",
          value: commandsUse["rps"],
          inline: true
        }
      ],
      timestamp: new Date(),
    }
  });
  for (let i in commandsUse) {
    commandsUse[i] = 0;
  }
}