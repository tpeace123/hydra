var config = require('./hydrauth.json');
// var config = require('./auth.json');
var Discord = require('discord.js');
var client = new Discord.Client();
var DBL = require('dblapi.js');
var dbl = new DBL(config.dbl.token, client);
var commands = require('./commands.js');
var prefix = require('./prefix.js');
var welChan = require('./welcome.js').getChannel;
var welEnable = require('./welcome.js').getEnable;
var getChannel = require('./logs.js').getChannel;
var getMessage = require('./logs.js').getMessage;
var getRole = require('./logs.js').getRole;
var getLogsChannel = require('./logs.js').getLogsChannel;

client.login(config.token);

client.on('ready', _ready);

client.on('message', _parseMessage);

client.on('guildCreate', _createGuild);

client.on('guildMemberAdd', _addMemberToGuild);

client.on('guildDelete', _deleteGuild);

client.on('channelCreate', _channelCreate);

client.on('channelDelete', _channelDelete);

client.on('messageDelete', _messageDelete);

client.on('messageDeleteBulk', _messageBulkDel);

client.on('roleCreate', _roleCreate);

client.on('roleDelete', _roleDelete);

client.on('roleUpdate', _roleUpdate);

function _ready() {
  _setActivity();
  console.log(`\nConnected as ${client.user.tag} on ${_getServerCount()} servers`);
  setInterval(function() {
    dbl.postStats(client.guilds.size);
  }, 1800000);
}

function _parseMessage(message) {
  if (message && (message.author === client.user || message.author.bot || !message.guild)) return;
  else if (message && message.content && message.content.startsWith(prefix.getPrefix(message))) _processCommand(message);
  else return;
}

function _addMemberToGuild(member) {
  // Check if welcome messages are enabled for the guild
  if (welEnable(member.guild) === "false") return;
  // Ignore if guild is DBL
  if (member.guild.id === "264445053596991498") return;
  let channel = welChan(member.guild);
  if (channel === config.welcome_channel) {
    channel = member.guild.channels.find(ch => ch.name === channel);
  }
  else channel = member.guild.channels.find(ch => ch.id === channel);
  // If couldn't find channel, exit
  if (!channel) return;
  channel.send({
    embed: {
      color: Math.ceil(Math.random() * 16777215),
      author: {
        name: client.user.tag,
        icon_url: client.user.displayAvatarURL(),
      },
      title: "Member Welcome",
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
          inline: true,
        },
      ],
      timestamp: new Date(),
      footer: {
        icon_url: client.user.displayAvatarURL(),
        text: member.tag
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
  // console.log(newRole);
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
          inline: true,
        },
        {
          name: "New Role Name",
          value: newRole.name,
          inline: true,
        },
        {
          name: '\u200b',
          value: '\u200b',
          inline: true,
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
          name: "Is Mentionable",
          value: newRole.mentionable,
          inline: false
        }
      ],
      timestamp: new Date()
    }
  });
}

function _processCommand(message) {
  let command = message.content.substr(prefix.getPrefix(message).length);
  let commandArray = command.split(' ');
  if (!commandArray.length) return;
  if (commands.hasOwnProperty(commandArray[0])) {
    commands[commandArray[0]](message, commandArray.slice(1), client);
  }
  else return;
}

function _setActivity() {
  client.user.setActivity(`Poker. ${config.prefix}help with ${_getServerCount()} servers`, {type: "WATCHING"});
}

function _getServerCount() {
  return client.guilds.size;
}