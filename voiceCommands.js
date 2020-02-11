var getPrefix = require('./prefix.js').getPrefix;
var ytdl = require('ytdl-core');

module.exports = {
  voice: voice,
  join: join,
  leave: leave,
  play: play
}

const permissionGroups = {
  connect: ['SEND_MESSAGES', 'CONNECT'],
  basic: ['SEND_MESSAGES'],
  play: ['SEND_MESSAGES', 'SPEAK']
}

async function voice(message, command, args, client) {
  if (_hasPermission(message, permissionGroups.basic)) {
    let connection;
    if (command === "join") {
      connection = join(message); 
    }
    else if (command === "leave") leave(message);
    else {
      if (message.guild.me.voice.channel) {
        connection = message.guild.me.voice.channel.join();
        if (command === "play") play(message, args, connection);
      }
      else message.channel.send(`I am not in a voice channel.\nPlease use \`${getPrefix(message)}join\`.`);
    }
  }
  else message.author.send("I am missing the permissions " + permissionGroups.basic);
}

function join(message) {
  if (_hasPermission(message, permissionGroups.connect)) {
    if (message.member.voice.channel) {
      if (!message.guild.me.voice.channel) {
        return message.member.voice.channel.join();
      }
      else message.reply(`I am already in a voice channel.\nUse \`${getPrefix(message)}leave\` before I join a new one.`);
    }
    else message.reply("please join a voice channel first.");
  }
  else message.author.send("I am missing the permissions: " + permissionGroups.connect);
}

async function leave(message) {
  if (message.guild.me.voice.channel) message.guild.me.voice.channel.leave();
  else {
    if (_hasPermission(message, permissionGroups.basic)) message.channel.send("I am not in a voice channel.");
    else message.author.send("I am not in a voice channel.");
  }
}

async function play(message, args) {
  if (_hasPermission(message, permissionGroups.play)) {
    if (args && args.length) {
      message.guild.me.voice.channel.join().then(function(connection) {
        // connection.play(ytdl(args[0], {filter: 'audioonly'})).catch(function(err) {
        //   message.author.send(`Usage: \`${getprefix(message)}play <youtube_link>\``);
        // });

        try {
          connection.play(ytdl(args[0], {filter: 'audioonly'}));
        }
        catch (err) {
          message.author.send(`Usage: \`${getPrefix(message)}play <youtube_link>\``);
        };
      });
    }
    else message.author.send(`Usage: \`${getPrefix(message)}play <youtube_link>\``);
  }
  else message.author.send("I am missing the permissions " + permissionGroups.play);
}

function _hasPermission(message, permissions) {
  return message.guild.me.hasPermission(permissions);
}

function _userHasPermission(message, permissions) {
  return message.member.hasPermission(permissions);
}