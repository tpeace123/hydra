var config = require('./hydrauth.json');
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
// Main require
var Discord = require('discord.js');
var client = new Discord.Client();
var DBL = require('dblapi.js');
var dbl = new DBL(config.dbl.token, client);
var commands = require('./commands.js');
var voiceCommands = require('./voiceCommands.js');

// Prefix require
var prefix = require('./prefix.js');

// Welcome require
var welJoinChannel = require('./welcome.js').getJoinChannel;
var welJoinEnabled = require('./welcome.js').getJoinEnable;
var welLeaveChannel = require('./welcome.js').getLeaveChannel;
var welLeaveEnabled = require('./welcome.js').getLeaveEnable;

// Logs require
var getChannel = require('./logs.js').getChannel;
var getMessage = require('./logs.js').getMessage;
var getRole = require('./logs.js').getRole;
var getLogsChannel = require('./logs.js').getLogsChannel;

var timeout = [''];

client.login(config.token);

client.on('ready', _ready);

client.on('message', _parseMessage);

// client.on('message', _parseVC);

client.on('guildCreate', _createGuild);

client.on('guildMemberAdd', _memberJoin);

client.on('guildMemberRemove', _memberLeave);

client.on('guildDelete', _deleteGuild);

client.on('channelCreate', _channelCreate);

client.on('channelDelete', _channelDelete);

client.on('messageDelete', _messageDelete);

client.on('messageDeleteBulk', _messageBulkDel);

// client.on('roleCreate', _roleCreate);

client.on('roleDelete', _roleDelete);

client.on('roleUpdate', _roleUpdate);

function _ready() {
  client.user.setActivity(`Poker on ${config.prefix}help with ${client.guilds.size} servers.`);
  _setActivity();
  console.log(`\nConnected as ${client.user.tag}`);
  setInterval(function() {
    dbl.postStats(client.guilds.size);
  }, 1800000);
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

function _memberJoin(member) {
  // Check if join messages are enabled or if guild is DBL
  if (!welJoinEnabled || member.guild.id === '264445053596991498') return;
  // Get channel
  let channel = member.guild.channels.get(welJoinChannel(member.guild));
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
  if (!welLeaveEnabled || member.guild.id === '264445053596991498') return;
  // Get channel
  let channel = member.guild.channels.get(welLeaveChannel(member.guild));
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
  _setActivity();
  let sent = false;
  guild.channels.forEach(function(channel) {
    if (channel.type === 'text' && sent === false) {
      channel.send(`Thank you for inviting me to \`${guild.name}\`!\nMy default prefix is \`${config.prefix}\`\nTo access the commands list, use \`commands\`\nI have features like welcome message, moderator function, and social commands!\n\nMy support server link is \`${config.server_link}\`. Join this for bot updates, suggestions, and socializing.\nIf you would like to invite me to other servers, go to my DBL page at \`${config.invite_link}\``);
      sent = true;
    }
  });
}

function _deleteGuild() {
  _setActivity();
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

function _processCommand(message) {
  let command = message.content.toLowerCase().substr(prefix.getPrefix(message).length);
  let commandArray = command.split(' ');
  if (!commandArray.length) return;
  if (commands.hasOwnProperty(commandArray[0])) {
    commands[commandArray[0]](message, commandArray.slice(1), client);
  }
  else return;
}

async function _vcCommand(message) {
  let command = message.content.toLowerCase().substr(prefix.getPrefix(message).length);
  let commandArray = command.split(' ');
  if (!commandArray.length) return;
  if (voiceCommands.hasOwnProperty(commandArray[0])) {
    voiceCommands.voice(message, commandArray[0], commandArray.slice(1));
  }
}

function _setActivity() {
  clearInterval(timeout[0]);
  let activity = {
    0: `Poker. ${config.prefix}help with ${client.guilds.size} servers`,
    1: `my ${client.guilds.size} servers. ${config.prefix}help for fun`,
    2: `the ${config.prefix}help of ${client.guilds.size} guilds`,
    3: `Esports with ${client.guilds.size} on ${config.prefix}help`
  }
  let activityType = {
    0: "WATCHING",
    1: "WATCHING",
    2: "LISTENING",
    3: "WATCHING"
  }
  /**
   * Activity:
   *   The activity (presence) of the bot
   * 
   * Activity Type:
   *   The type of activty from one of the three:
   *     PLAYING
   *     WATCHING
   *     LISTENING
   */
  timeout[0] = setInterval(function() {
    let num = Math.floor(Math.random() * Object.keys(activity).length);
    client.user.setActivity(activity[num], {type: activityType[num]});
  }, 1800000);
}