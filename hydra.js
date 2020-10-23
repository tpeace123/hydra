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

var Discord = require('discord.js');
var client = new Discord.Client();
var DBL = require('dblapi.js');
var dbl = new DBL(config.dbl.token, client);
var commands = require('./commands.js');
// var voiceCommands = require('./voiceCommands.js');

// Prefix require
var prefix = require('./prefix.js');

// Welcome require
var welJoinChannel = require('./welcome.js').getJoinChannel;
var welJoinEnabled = require('./welcome.js').getJoinEnable;
var welLeaveChannel = require('./welcome.js').getLeaveChannel;
var welLeaveEnabled = require('./welcome.js').getLeaveEnable;

// Logs require
var getLogsChannel = require('./logs.js').getLogsChannel;
var getUser = require('./logs.js').getUser;
var getRole = require('./logs.js').getRole;
var getMessage = require('./logs.js').getMessage;
var getChannel = require('./logs.js').getChannel;

// Custom commands require
var useCommand = require('./customCommands.js').useCommand;

var timeout = [''];

/**
 * Events
 *
 * ready Event
 * message Event
 * guildCreate (guild join) Event
 * guildMemberAdd (new member) Event
 * guildDelete (guild leave) Event
 * 
 * guildBanAdd Event
 * guildBanRemove Event
 * roleDelete Event
 * roleUpdate Event
 * messageDelete Event
 * messageDeleteBulk Event
 * channelCreate Event
 * channelDelete Event
 * channelUpdate Event
 * 
 */

client.login(config.token);

client.on('ready', _ready);

client.on('message', _parseMessage);

// client.on('message', _parseVC);

client.on('guildCreate', _createGuild);

client.on('guildMemberAdd', _memberJoin);

client.on('guildMemberRemove', _memberLeave);

client.on('guildDelete', _deleteGuild);

client.on('guildBanAdd', _banAdd);

client.on('guildBanRemove', _banRemove);

client.on('roleDelete', _roleDelete);

client.on('roleUpdate', _roleUpdate);

client.on('messageDelete', _messageDelete);

client.on('messageDeleteBulk', _messageDeleteBulk);

client.on('channelCreate', _channelCreate);

client.on('channelDelete', _channelDelete);

client.on('channelUpdate', _channelUpdate);

function _ready() {
  console.log(`\nConnected as ${client.user.tag}`);
  _setFirstActivity();
  _setActivity();
  setInterval(function() {
    dbl.postStats(client.guilds.cache.size);
  }, 1800000);
  console.log(client.user.displayAvatarURL());
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

function _setFirstActivity() {
  client.user.setActivity(`Poker on ${config.prefix}help with ${client.guilds.cache.size} servers.`);
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
    0: `poker. ${config.prefix}help with ${client.guilds.cache.size} servers`,
    1: `my ${client.guilds.cache.size} servers. ${config.prefix}help for fun`,
    2: `the ${config.prefix}help of ${client.guilds.cache.size} guilds`,
    3: `Esports with ${client.guilds.cache.size} guilds on ${config.prefix}help`,
    4: `games with ${client.guilds.cache.size} servers.`
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
  let old = commandArray.slice(1);
  let args = [];
  for (let i in old) {
    if (old[i] !== "") args.push(old[i]);
  }
  if (commands.hasOwnProperty(commandArray[0])) {
    commands[commandArray[0]](message, args, client);
  }
  else {
    useCommand(message, commandArray[0], args, client);
    return;
  }
}

function _banAdd(guild, user) {
  if (!guild || !getUser(guild)) return;
  let channel = client.channels.cache.get(getLogsChannel(guild));
  if (!channel) return;
  channel.send({
    embed: {
      color: 0xff0000,
      title: "Member Ban",
      author: {
        name: client.user.tag,
        icon_url: client.user.displayAvatarURL()
      },
      thumbnail: {
        url: user.displayAvatarURL()
      },
      fields: [
        {
          name: "Banned Member",
          value: user.tag
        }
      ],
      timestamp: new Date(),
      footer: {
        icon_url: guild.iconURL({dynamic: true}),
        text: guild.name
      }
    }
  });
}

function _banRemove(guild, user) {
  if (!guild || !getUser(guild)) return;
  let channel = client.channels.cache.get(getLogsChannel(guild));
  if (!channel) return;
  channel.send({
    embed: {
      color: [255, 165, 0],
      title: "Member Unban",
      author: {
        name: client.user.tag,
        icon_url: client.user.displayAvatarURL()
      },
      thumbnail: {
        url: user.displayAvatarURL()
      },
      fields: [
        {
          name: "Unbanned Member",
          value: user.tag
        }
      ],
      timestamp: new Date(),
      footer: {
        icon_url: guild.iconURL({dynamic: true}),
        text: guild.name
      }
    }
  });
}

function _roleDelete(role) {
  if (!role.guild || !getRole(role.guild)) return;
  let channel = client.channels.cache.get(getLogsChannel(role.guild));
  if (!channel) return;
  let thumbnail = role.guild.iconURL({dynamic: true});
  if (!thumbnail) thumbnail = client.user.displayAvatarURL();
  channel.send({
    embed: {
      color: [0, 0, 255],
      title: "Role Delete",
      author: {
        name: client.user.tag,
        icon_url: client.user.displayAvatarURL()
      },
      thumbnail: {
        url: thumbnail
      },
      fields: [
        {
          name: "Role Name",
          value: role.name
        }
      ],
      timestamp: new Date(),
      footer: {
        icon_url: role.guild.iconURL({dynamic: true}),
        text: role.guild.name
      }
    }
  });
}

function _roleUpdate(oldRole, newRole) {
  if (!newRole.guild || !getRole(newRole.guild) || oldRole.name === newRole.name) return;
  let channel = client.channels.cache.get(getLogsChannel(newRole.guild));
  if (!channel) return;
  let thumbnail = newRole.guild.iconURL({dynamic: true});
  if (!thumbnail) thumbnail = client.user.displayAvatarURL();
  channel.send({
    embed: {
      color: [0, 0, 255],
      title: "Role Update",
      author: {
        name: client.user.tag,
        icon_url: client.user.displayAvatarURL()
      },
      thumbnail: {
        url: thumbnail
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
        }
      ],
      timestamp: new Date(),
      footer: {
        text: newRole.guild.name,
        icon_url: newRole.guild.iconURL({dynamic: true})
      }
    }
  });
}

function _messageDelete(message) {
  if (!message.guild || !getMessage(message.guild)) return;
  let channel = client.channels.cache.get(getLogsChannel(message.guild));
  if (!channel) return;
  let thumbnail = message.guild.iconURL({dynamic: true});
  if (!thumbnail) thumbnail = client.user.displayAvatarURL();
  channel.send({
    embed: {
      color: [255, 255, 0],
      title: "Message Delete",
      thumbnail: {
        url: thumbnail
      },
      author: {
        name: client.user.tag,
        icon_url: client.user.displayAvatarURL()
      },
      fields: [
        {
          name: "Channel",
          value: `#${message.channel.name}`
        }
      ],
      timestamp: new Date(),
      footer: {
        text: message.guild.name,
        icon_url: message.guild.iconURL({dynamic: true})
      }
    }
  });
}

function _messageDeleteBulk(messages) {
  let messageArray = messages.array();
  if (!messageArray[0].guild || !getMessage(messageArray[0].guild)) return;
  let channel = client.channels.cache.get(getLogsChannel(messageArray[0].guild));
  if (!channel) return;
  let thumbnail = messageArray[0].guild.iconURL({dynamic: true});
  if (!thumbnail) thumbnail = client.user.displayAvatarURL();
  channel.send({
    embed: {
      color: [255, 255, 0],
      title: "Message Bulk Delete",
      thumbnail: {
        url: thumbnail
      },
      author: {
        name: client.user.tag,
        icon_url: client.user.displayAvatarURL()
      },
      fields: [
        {
          name: "channel",
          value: `#${messageArray[0].channel.name}`,
          inline: false
        },
        {
          name: "Number of Messages Deleted",
          value: messageArray.length,
          inline: false
        }
      ],
      timestamp: new Date(),
      footer: {
        text: messageArray[0].guild.name,
        icon_url: messageArray[0].guild.iconURL({dynamic: true})
      }
    }
  });
}

function _channelCreate(channel) {
  if (!channel.guild || !getChannel(channel.guild)) return;
  let ch = client.channels.cache.get(getLogsChannel(channel.guild));
  if (!ch) return;
  let thumbnail = channel.guild.iconURL({dynamic: true});
  if (!thumbnail) thumbnail = client.user.displayAvatarURL();
  ch.send({
    embed: {
      color: [0, 255, 0],
      // color: [0, 128, 0],
      title: "Channel Create",
      author: {
        name: client.user.tag,
        icon_url: client.user.displayAvatarURL()
      },
      thumbnail: {
        url: thumbnail
      },
      fields: [
        {
          name: "Channel Name",
          value: `${channel.name}`,
          inline: false
        },
        {
          name: "Channel Type",
          value: `${channel.type.toUpperCase()}`,
          inline: false
        }
      ],
      timestamp: new Date(),
      footer: {
        text: channel.guild.name,
        icon_url: channel.guild.iconURL({dynamic: true})
      }
    }
  });
}

function _channelDelete(channel) {
  if (!channel.guild || !getChannel(channel.guild)) return;
  let ch = client.channels.cache.get(getLogsChannel(channel.guild));
  if (!ch) return;
  let thumbnail = channel.guild.iconURL({dynamic: true});
  if (!thumbnail) thumbnail = client.user.displayAvatarURL();
  ch.send({
    embed: {
      color: [0, 255, 0],
      // color: [0, 128, 0],
      title: "Channel Delete",
      author: {
        name: client.user.tag,
        icon_url: client.user.displayAvatarURL()
      },
      thumbnail: {
        url: thumbnail
      },
      fields: [
        {
          name: "Channel Name",
          value: `${channel.name}`,
          inline: false
        },
        {
          name: "Channel Type",
          value: `${channel.type}`,
          inline: false
        }
      ],
      timestamp: new Date(),
      footer: {
        text: channel.guild.name,
        icon_url: channel.guild.iconURL({dynamic: true})
      }
    }
  });
}

function _channelUpdate(oldChannel, newChannel) {
  if (!newChannel.guild || !getChannel(newChannel.guild) || oldChannel.name === newChannel.name) return;
  let channel = client.channels.cache.get(getLogsChannel(newChannel.guild));
  if (!channel) return;
  let thumbnail = newChannel.guild.iconURL({dynamic: true});
  if (!thumbnail) thumbnail = client.user.displayAvatarURL();
  channel.send({
    embed: {
      color: [0, 255, 0],
      // color: [0, 128, 0],
      title: "Channel Update",
      author: {
        name: client.user.tag,
        icon_url: client.user.displayAvatarURL()
      },
      thumbnail: {
        url: thumbnail
      },
      fields: [
        {
          name: "Old Channel Name",
          value: `${oldChannel.name}`,
          inline: true
        },
        {
          name: "New Channel Name",
          value: `${newChannel.name}`,
          inline: true
        }
      ],
      timestamp: new Date(),
      footer: {
        text: newChannel.guild.name,
        icon_url: newChannel.guild.iconURL({dynamic: true})
      }
    }
  });
}