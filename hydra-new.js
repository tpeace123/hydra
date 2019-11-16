var Discord = require('discord.js');
var client = new Discord.Client();
var config = require('./auth.json');
var commands = require('./commands.js');
var prefix = require('./prefix.js');

client.login(config.token);

client.on('ready', function() {
  client.user.setActivity(`Poker $help with ${0} servers`, {type: "WATCHING"});
  console.log(`\nConnected as ${client.user.tag} on ${0} servers`);
});

client.on('message', _parseMessage);

client.on('guildCreate', _createGuild);

client.on('guildMemberAdd', _addMemberToGuild);

client.on('guildDelete', _deleteGuild);

function _parseMessage(message) {
  if (message && (message.author === client.user || message.author.bot || !message.guild)) return;
  else if (message && message.content && message.content.startsWith(prefix.getPrefix(message))) _processCommand(message);
  else return;
}

function _createGuild(guild) {

}

function _addMemberToGuild(member) {

}

function _deleteGuild() {

}

function _processCommand(message) {
  let command = message.content.substr(prefix.getPrefix(message).length);
  let commandArray = command.split(' ');
  if (!commandArray.length) return;
  if (commands.hasOwnProperty(commandArray[0])) {
    commands[commandArray[0]](message, commandArray.slice(1));
  }
  else return;
}