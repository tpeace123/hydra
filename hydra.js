var config = require('./hydrauth.json');
// var config = require('./auth.json');
var Discord = require('discord.js');
var client = new Discord.Client();
var DBL = require('dblapi.js');
var dbl = new DBL(config.dbl_token, client);
var commands = require('./commands.js');
var prefix = require('./prefix.js');
var welChan = require('./welcome.js').getChannel;
var welEnable = require('./welcome.js').getEnable;

client.login(config.token);

client.on('ready', _ready);

client.on('message', _parseMessage);

client.on('guildCreate', _createGuild);

client.on('guildMemberAdd', _addMemberToGuild);

client.on('guildDelete', _deleteGuild);

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
}

function _deleteGuild() {
  _setActivity();
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