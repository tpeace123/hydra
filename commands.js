var config = require('./auth.json');
var getPrefix = require('./prefix.js').getPrefix;
var setPrefix = require('./prefix.js').setPrefix;

module.exports = {
  hmw: hmw,
  prefix: prefix,
  ping: ping,
  pong: pong,
  commands: commands
}

const permissionGroups = {
  basic: ['SEND_MESSAGES'],
  upload: ['SEND_MESSAGES', 'ATTACH_FILES'],
  kick: ['SEND_MESSAGES', 'KICK_MEMBERS'],
  ban: ['SEND_MESSAGES', 'BAN_MEMBERS']
}

const userPermissionGroups = {
  kick: ["KICK_MEMBERS"],
  ban: ["BAN_MEMBERS"],
  admin: ["ADMINISTRATOR"]
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

function ping(message, args) {
  if (_hasPermission(message, permissionGroups.basic)) {
    message.channel.send("Pong!");
  }
  else message.author.send("I don't have the permissions: ", permissionGroups.basic);
}

function pong(message, args) {
  if (_hasPermission(message, permissionGroups.basic)) {
    message.channel.send("Ya know, that's my line!");
  }
  else message.author.send("I don't have the permissions: ", permissionGroups.basic);
}

function prefix(message, args) {
  if (_hasPermission(message, permissionGroups.basic)) {
    if (_userHasPermission(message, userPermissionGroups.admin)) {
      if (args && args.length) {
        let newPrefix = args[0];
        setPrefix(message, newPrefix);
        message.channel.send(`Set new prefix to ${newPrefix}`)
      }
      else message.channel.send(`Usage: ${getPrefix(message)}prefix <new_prefix>`);
    }
  }
  else message.author.send("I don't have the permissions: ", permissionGroups.basic);
}

function commandsasd(message, args) {
  if (_hasPermission(message, permissionGroups.basic)) {
    let cmds = module.exports.keys();
    message.channel.send('Usable commands: ' + JSON.stringify(cmds));
  }
  else message.author.send("I don't have the permissions: " + permissionGroups.basic);
}

function commands(message, args) {
  var color = Math.ceil(Math.random() * 16777215);
  let Embed = {
    color: color,
    author: {
      name: client.user.tag,
      icon_url: 'https://i.imgur.com/XHT1viU.png'
    },
    title: "Hydra Commands",
    description: "A list of my commands!",
    thumbnail: {
      url: 'https://i.imgur.com/XHT1viU.png',
    },
    fields: [
      {
        name: "Prefix",
        value: getPrefix(message),
      },
      {
        name: '\u200b',
        value: '\u200b',
      },
      {
        name:'commands',
        value: 'A list of commands (This)',
        inline: false,
      },
      {
        name: "hmw <arguments>",
        value: "Ask for help from me",
        inline: true,
      },
      {
        name: 'roll [dice (1-3)]',
        value: "Roll a couple dice. You're not gambling",
        inline: false,
      },
      {
        name: 'flip',
        value: "Flip a coin",
        inline: false,
      },
      {
        name: "rip",
        value: "RIP",
        inline: false,
      },
      {
        name: "add <numbers>",
        value: "Add numbers together",
        inline: false,
      },
      {
        name: "subtract <numbers>",
        value: "Subtract numbers together. Numbers will subtract from the first.",
        inline: false,
      },
      {
        name: "multiply <numbers>",
        value: "Multiply numbers together.",
        inline: false,
      },
      {
        name: "divide <numbers>",
        value: "Divide numbers together. Numbers will divide from the first.",
        inline: false,
      },
      {
        name: 'links',
        value: "A list of important links",
        inline: false,
      },
      {
        name: "invite",
        value: "A link to invite me with.",
        inline: false,
      },
      {
        name: "avatar",
        value: "Get your avatar.",
        inline: false,
      },
      {
        name: "suggest",
        value: "Suggest a suggestion for me to have.",
        inline: false,
      },
      {
        name: '\u200b',
        value: '\u200b',
      },
      {
        name: "kick <user> [reason]",
        value: "Kick a user (with reason). Must have the KICK_MEMBERS permission.",
        inline: false,
      },
      {
        name: "ban <user> [reason]",
        value: "Ban a user (with reason). Must have the BAN_MEMBERS permission.",
        inline: false,
      },
      {
        name: "bulkdel <num_of_messages>",
        value: "Bulk delete a number of messages.",
        inline: false,
      },
      {
        name: '\u200b',
        value: '\u200b',
      },
      {
        name: 'Owner',
        // value: owner.tag,
        value: "DutifulHydra22#7391",
        inline: false,
      },
      {
        name: 'Bot Developer',
        // value: developer.tag,
        value: "T Peace#9407",
        inline: false,
      },
      {
        name: '\u200b',
        value: '\u200b',
      },
      {
        name: '[] = optional field',
        value: '\u200b',
        inline: false,
      },
      {
        name: '<> = required field',
        value: '\u200b',
        inline: false,
      },  
    ],
    timestamp: new Date(),
    footer: {
      icon_url: client.user.avatarURL,
      text: recievedMessage.author.tag
    }
  }
  recievedMessage.author.send({embed: Embed});
}

function _hasPermission(message, group) {
  return message.guild.me.hasPermission(group);
}

function _userHasPermission(message, group) {
  return message.member.hasPermission(group);
}