var config = require('./hydrauth.json');

var Discord = require('discord.js');
var client = new Discord.Client();
var commands = require('./commands.js');
var prefix = require('./prefix.js');
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
  "rps": 0,
  "tictactoe": 0
};

client.login(config.token);

client.on('ready', _ready);

client.on('message', _parseMessage);

function _ready() {
  setInterval(function() {
    _postCommands();
  }, 86400000);
}

function _parseMessage(message) {
  if (message && (message.author === client.user || message.author.bot || !message.guild)) return;
  else if (message && message.content && message.content.toLowerCase().startsWith(prefix.getPrefix(message))) _processCommand(message);
  else return;
}

function _processCommand(message) {
  let command = message.content.toLowerCase().substr(prefix.getPrefix(message).length);
  let commandArray = command.split(' ');
  if (!commandArray.length) return;
  if (commands.hasOwnProperty(commandArray[0])) {
    commandsUse[commandArray[0]] += 1;
  }
  else return;
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
        },
        {
          name: "tictactoe",
          value: commandsUser["tictactoe"],
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