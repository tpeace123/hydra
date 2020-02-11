var config = require('./hydrauth.json');
// var config = require('./auth.json');
var commandsList = require('./commandsList.json');

// Prefix require
var getPrefix = require('./prefix.js').getPrefix;
var setPrefix = require('./prefix.js').setPrefix;
var resetPrefix = require('./prefix.js').resetPrefix;

// Welcome require
var setWelcome = require('./welcome.js').setChannel;
var getWelcome = require('./welcome.js').getChannel;
var resetWelcome = require('./welcome.js').removeChannel;
var disableWelcome = require('./welcome.js').disableChannel;
var welEnable = require('./welcome.js').getEnable;

// Blackjack require
var blackjack = require('./hydrajack.js').blackjack;

// Logs require
var getChannel = require('./logs.js').getChannel;
var setChannel = require('./logs.js').setChannel;
var disableChannel = require('./logs.js').disableChannel;
var getMessage = require('./logs.js').getMessage;
var setMessage = require('./logs.js').setMessage;
var disableMessage = require('./logs.js').disableMessage;
var getRole = require('./logs.js').getRole;
var setRole = require('./logs.js').setRole;
var disableRole = require('./logs.js').disableRole;
var getLogsChannel = require('./logs.js').getLogsChannel;
var setLogsChannel = require('./logs.js').setLogsChannel;
var disableLogs = require('./logs.js').disableLogs;
var getStatus = require('./logs.js').getStatus;

module.exports = {
  hmw: hmw,
  prefix: prefix,
  ping: ping,
  pong: pong,
  commands: commands,
  roll: roll,
  links: links,
  rip: rip,
  kick: kick,
  ban: ban,
  bulkdel: bulkdel,
  suggest: suggest,
  invite: invite,
  avatar: avatar,
  flip: flip,
  add: add,
  subtract: subtract,
  divide: divide,
  multiply: multiply,
  welcome: welcome,
  help: help,
  react: react,
  '8ball': ball,
  blackjack: jack,
  logs: logs
}

const permissionGroups = {
  basic: ['SEND_MESSAGES'],
  upload: ['SEND_MESSAGES', 'ATTACH_FILES'],
  kick: ['SEND_MESSAGES', 'KICK_MEMBERS'],
  ban: ['SEND_MESSAGES', 'BAN_MEMBERS'],
  manage: ['MANAGE_MESSAGES'],
  join: ['SEND_MESSAGES', 'CONNECT'],
  speak: ['SEND_MESSAGES', 'SPEAK'],
  react: ['SEND_MESSAGES', 'ADD_REACTIONS'],
  nickname: ['SEND_MESSAGES', 'MANAGE_NICKNAMES']
}

const userPermissionGroups = {
  kick: ['KICK_MEMBERS'],
  ban: ['BAN_MEMBERS'],
  admin: ['ADMINISTRATOR'],
  nickname: ['MANAGE_NICKNAMES']
}

function help(message) {
  message.author.send(`Use \`${getPrefix(message)}commands\` for a list of commands.`);
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
  else message.author.send("I don't have the permissions: " + permissionGroups.basic);
}

function pong(message, args) {
  if (_hasPermission(message, permissionGroups.basic)) {
    message.channel.send("Ya know, that's my line!");
  }
  else message.author.send("I don't have the permissions: " + permissionGroups.basic);
}

function prefix(message, args) {
  if (_hasPermission(message, permissionGroups.basic)) {
    if (_userHasPermission(message, userPermissionGroups.admin)) {
      if (args && args.length) {
        if (args.length >= 1) {
          if (args[0] === "set") {
            if (args.length >= 2) {
              let newPrefix = args[1];
              setPrefix(message, newPrefix);
              message.channel.send(`Set new prefix to ${newPrefix}`);
            }
            else message.author.send(`Usage: ${getPrefix(message)}prefix set <new_prefix>`);
          }
          else if (args[0] === "reset") {
            resetPrefix(message);
            message.channel.send(`Reset prefix to ${config.prefix}`);
          }
          else message.author.send(`Usage Options:\n\`\`\`yaml\n${getPrefix(message)}prefix set <new_prefix>\n${getPrefix(message)}prefix reset\`\`\``);
        }
        else message.author.send(`Usage Options:\n\`\`\`yaml\n${getPrefix(message)}prefix set <new_prefix>\n${getPrefix(message)}prefix reset\`\`\``);
      }
      else message.author.send(`Usage Options:\n\`\`\`yaml\n${getPrefix(message)}prefix set <new_prefix>\n${getPrefix(message)}prefix reset\`\`\``);
    }
    else message.author.send("You don't have the permissions: " + userPermissionGroups.admin);
  }
  else message.author.send("I don't have the permissions: " + permissionGroups.basic);
}

function commandsasd(message, args) {
  if (_hasPermission(message, permissionGroups.basic)) {
    let cmds = module.exports.keys();
    message.channel.send('Usable commands: ' + JSON.stringify(cmds));
  }
  else message.author.send("I don't have the permissions: ", permissionGroups.basic);
}

function commands(message, args, client) {
  let color = Math.ceil(Math.random() * 16777215);
  let options = ['social', 'mod', 'prefix', 'welcome', 'logs', 'music'];

  commandsList.socialCommands.color = color;
  commandsList.socialCommands.author.name = client.user.tag;
  commandsList.socialCommands.author.icon_url = client.user.displayAvatarURL();
  commandsList.socialCommands.thumbnail.url = client.user.displayAvatarURL();
  commandsList.socialCommands.fields[0].value = config.prefix;
  commandsList.socialCommands.fields[1].value = getPrefix(message);
  commandsList.socialCommands.fields[22].value = client.users.get(config.userids.owner).tag;
  commandsList.socialCommands.fields[23].value = client.users.get(config.userids.dev).tag;
  commandsList.socialCommands.timestamp = new Date();
  commandsList.socialCommands.footer.icon_url = message.author.displayAvatarURL();
  commandsList.socialCommands.footer.text = message.author.tag;
  
  commandsList.modCommands.color = color;
  commandsList.modCommands.author.name = client.user.tag;
  commandsList.modCommands.author.icon_url = client.user.displayAvatarURL();
  commandsList.modCommands.thumbnail.url = client.user.displayAvatarURL();
  commandsList.modCommands.fields[0].value = config.prefix;
  commandsList.modCommands.fields[1].value = getPrefix(message);
  commandsList.modCommands.fields[9].value = client.users.get(config.userids.owner).tag;
  commandsList.modCommands.fields[10].value = client.users.get(config.userids.dev).tag;
  commandsList.modCommands.timestamp = new Date();
  commandsList.modCommands.footer.icon_url = message.author.displayAvatarURL();
  commandsList.modCommands.footer.text = message.author.tag;

  commandsList.logsCommands.color = color;
  commandsList.logsCommands.author.name = client.user.tag;
  commandsList.logsCommands.author.icon_url = client.user.displayAvatarURL();
  commandsList.logsCommands.thumbnail.url = client.user.displayAvatarURL();
  commandsList.logsCommands.fields[0].value = config.prefix;
  commandsList.logsCommands.fields[1].value = getPrefix(message);
  commandsList.logsCommands.fields[13].value = client.users.get(config.userids.owner).tag;
  commandsList.logsCommands.fields[14].value = client.users.get(config.userids.dev).tag;
  commandsList.logsCommands.timestamp = new Date();
  commandsList.logsCommands.footer.icon_url = message.author.displayAvatarURL();
  commandsList.logsCommands.footer.text = message.author.tag;

  commandsList.welcomeCommands.color = color;
  commandsList.welcomeCommands.author.name = client.user.tag;
  commandsList.welcomeCommands.author.icon_url = client.user.displayAvatarURL();
  commandsList.welcomeCommands.thumbnail.url = client.user.displayAvatarURL();
  commandsList.welcomeCommands.fields[0].value = config.prefix;
  commandsList.welcomeCommands.fields[1].value = getPrefix(message);
  commandsList.welcomeCommands.fields[10].value = client.users.get(config.userids.owner).tag;
  commandsList.welcomeCommands.fields[11].value = client.users.get(config.userids.dev).tag;
  commandsList.welcomeCommands.timestamp = new Date();
  commandsList.welcomeCommands.footer.icon_url = message.author.displayAvatarURL();
  commandsList.welcomeCommands.footer.text = message.author.tag;

  commandsList.prefixCommands.color = color;
  commandsList.prefixCommands.author.name = client.user.tag;
  commandsList.prefixCommands.author.icon_url = client.user.displayAvatarURL();
  commandsList.prefixCommands.thumbnail.url = client.user.displayAvatarURL();
  commandsList.prefixCommands.fields[0].value = config.prefix;
  commandsList.prefixCommands.fields[1].value = getPrefix(message);
  commandsList.prefixCommands.fields[8].value = client.users.get(config.userids.owner).tag;
  commandsList.prefixCommands.fields[9].value = client.users.get(config.userids.dev).tag;
  commandsList.prefixCommands.timestamp = new Date();
  commandsList.prefixCommands.footer.icon_url = message.author.displayAvatarURL();
  commandsList.prefixCommands.footer.text = message.author.tag;

  commandsList.musicCommands.color = color;
  commandsList.musicCommands.author.name = client.user.tag;
  commandsList.musicCommands.author.icon_url = client.user.displayAvatarURL();
  commandsList.musicCommands.thumbnail.url = client.user.displayAvatarURL();
  commandsList.musicCommands.fields[0].value = config.prefix;
  commandsList.musicCommands.fields[1].value = getPrefix(message);
  commandsList.musicCommands.fields[9].value = client.users.get(config.userids.owner).tag;
  commandsList.musicCommands.fields[10].value = client.users.get(config.userids.dev).tag;
  commandsList.musicCommands.timestamp = new Date();
  commandsList.musicCommands.footer.icon_url = message.author.displayAvatarURL();
  commandsList.musicCommands.footer.text = message.author.tag;

  if (!args[0] || options.indexOf(args[0]) === -1) {
    message.author.send({embed: commandsList.socialCommands});
    message.author.send({embed: commandsList.modCommands});
    message.author.send({embed: commandsList.prefixCommands});
    message.author.send({embed: commandsList.welcomeCommands});
    message.author.send({embed: commandsList.logsCommands});
    message.author.send({embed: commandsList.musicCommands});
  }
  else if (args[0] === "social") message.author.send({embed: commandsList.socialCommands});
  else if (args[0] === "mod") message.author.send({embed: commandsList.modCommands});
  else if (args[0] === "prefix") message.author.send({embed: commandsList.prefixCommands});
  else if (args[0] === "welcome") message.author.send({embed: commandsList.welcomeCommands});
  else if (args[0] === "music") message.author.send({embed: commandsList.musicCommands});
  else message.author.send({embed: commandsList.logsCommands});
}

function roll(message, args) {
  if (_hasPermission(message, userPermissionGroups.basic)) {
    let d1 = Math.ceil(Math.random() * 6);
    let d2 = Math.ceil(Math.random() * 6);
    let sum = d1 + d2;
    if (!(args && args.length)) {
      message.channel.send(`You rolled a ${d1} and a ${d2}. Sum: ${sum}`);
    }
    else if (args[0] == 1) {
      message.channel.send(`You rolled a ${d1}`);
    }
    else if (args[0] == 2) {
      message.channel.send(`You rolled a ${d1} and a ${d2}. Sum: ${sum}`);
    }
    else if (args[0] == 3) {
      let d3 = Math.ceil(Math.random() * 6);
      sum += d3;
      message.channel.send(`You rolled a ${d1}, ${d2}, and a ${d3}. Sum: ${sum}`);
    }
    else {
      message.author.send(`Usage: ${getPrefix(message)}roll [1-3]`);
    }
  }
  else message.author.send("I don't have the permissions: " + userPermissionGroups.basic);
}

function links(message, args, client) {
  message.author.send({
    embed: {
      color: 2550000,
      author: {
        name: client.user.tag,
        icon_url: client.user.displayAvatarURL()
      },
      title: "Discord Links",
      description: "A list of important links!",
      thumbnail: {
        url: client.user.displayAvatarURL(),
      },
      fields: [
        {
          name: "Discord Essentials",
          value: "A list of important Discord links",
          inline: false,
        },
        {
          name: "Discord Terms of Service",
          value: "https://discordapp.com/terms",
        },
        {
          name: "Discord Privacy Policy",
          value: "https://discordapp.com/privacy",
          inline: false,
        },
      ],
      timestamp: new Date(),
      footer: {
        icon_url: message.author.displayAvatarURL(),
        text: message.author.tag
      }
    }
  });
}

function rip(message) {
  if (_hasPermission(message, permissionGroups.upload)) {
    message.channel.send({
      files: ['https://i.imgur.com/w3duR07.png'],
    });
    if (_hasPermission(message, permissionGroups.manage)) {
      message.delete([10]);
    }
  }
  else message.author.send("I don't have the permissions: " + permissionGroups.upload);
}

function kick(message, args) {
  if (_hasPermission(message, permissionGroups.kick)) {
    if (_userHasPermission(message, userPermissionGroups.kick)) {
      let user = message.mentions.users.first();
      let reason = args.slice(1).join(" ");
      if (user) {
        let member = message.guild.member(user);
        if (member) {
          member.kick(reason).then(function() {
            if (reason === "") {
              message.reply(`successfully kicked ${user.tag}`);
            }
            else {
              message.reply(`successfully kicked ${user.tag} for \`${reason}\``);
            }
          }).catch(function(err) {
            message.reply(`I was unable to kick ${user.tag}.`);
            console.error(`Error in kick: ${err}`);
          });
        }
        else {
          message.reply("that user isn't in this guild!");
        }
      }
      else {
        message.author.send(`Usage: ${getPrefix(message)}kick <user> [reason]`);
      }
    }
    else {
      message.author.send("You are missing the permissions: " + userPermissionGroups.kick);
    }
  }
  else {
    message.author.send("I am missing the permissions: " + permissionGroups.kick);
  }
}

function ban(message, args) {
  if (_hasPermission(message, permissionGroups.ban)) {
    if (_userHasPermission(message, userPermissionGroups.ban)) {
      let user = message.mentions.users.first();
      let reason = args.slice(1).join(" ");
      if (user) {
        let member = message.guild.member(user);
        if (member) {
          member.ban({
            reason: reason,
          }).then(function() {
            if (reason === "") {
              message.reply(`successfully banned ${user.tag}`);
            }
            else {
              message.reply(`successfully banned ${user.tag} for \`${reason}\``);
            }
          }).catch(function(err) {
            message.reply("I was unable to ban the member.");
            console.error(`Error in ban: ${err}`);
          });
        }
        else {
          message.reply("that user isn't in this guild!");
        }
      }
      else {
        message.author.send(`Usage: ${getPrefix(message)}ban <user> [reason]`);
      }
    }
    else {
      message.author.send("You are missing the permissions: " + userPermissionGroups.ban);
    }
  }
  else {
    message.author.send("I am missing the permissions: " + permissionGroups.ban);
  }
}

function nick(message, args) {
  if (_hasPermission(message, permissionGroups.nickname)) {
    if (_userHasPermission(message, userPermissionGroups.nickname)) {
      let user = message.mentions.users.first();
      if (user) {
        let member = message.guild.member(user);
        if (member) {
          if (args.length > 1) {
            let name = args.slice(1).join(' ');
            member.setNickname(name).catch(function() {
              message.channel.send("I could not change the nickname of the user.");
            });
          }
          else {
            member.setNickname(member.user.username).catch(function() {
              message.channel.send("I could not reset the nickname of the user.");
            });
            message.channel.send("Reset the nickname for that user.");
          }
        }
        else message.reply("that user isn't in this guild.");
      }
      else message.author.send(`Usage: ${getPrefix(message)}nick <user> [new_nickname]`);
    }
    else message.author.send("You are missing the permissions: " + userPermissionGroups.nickname);
  }
  else message.author.send("I am missing the permissions: " + permissionGroups.nickname);
}

function bulkdel(message, args) {
  if (_hasPermission(message, permissionGroups.manage)) {
    if (_userHasPermission(message, userPermissionGroups.admin)) {
      if (args && args.length) {
        if (!isNaN(args[0])) {
          message.channel.bulkDelete(args[0]).catch(function(err) {
            message.author.send("I was unable to delete messages in that channel.\nMake sure that I am not bulk deleting more than 100 messages and messages under 14 days old.");
          });
        }
        else {
          message.reply(`Usage: ${getPrefix(message)}bulkdel <number_of_message>`);
        }
      }
      else {
        message.reply(`Usage: ${getPrefix(message)}bulkdel <number_of_message>`);
      }
    }
    else {
      message.author.send("You are missing the permissions: " + userPermissionGroups.admin);
    }
  }
  else {
    message.author.send("I am missing the permissions: " + permissionGroups.manage);
  }
}

function suggest(message, args, client) {
  if (args && args.length) {
    let suggestion = args.join(" ");
    let color = Math.ceil(Math.random() * 16777215);
    client.channels.get(config.sugChannel).send({
      embed: {
        color: color,
        author: {
          name: message.author.tag,
          icon_url: message.author.displayAvatarURL(),
        },
        thumbnail: {
          url: message.author.displayAvatarURL(),
        },
        fields: [
          {
            name: "Suggestion",
            value: suggestion,
            inline: true
          },
          {
            name: '\u200b',
            value: '\u200b',
            inline: true
          },
          {
            name: "Server",
            value: message.guild.name,
            inline: false
          },
          {
            name: '\u200b',
            value: '\u200b',
            inline: false
          }
        ],
        timestamp: new Date(),
        footer: {
          icon_url: client.user.displayAvatarURL(),
          text: client.user.tag
        }
      }
    });
  }
  else {
    message.author.send(`Usage: ${getPrefix(message)}suggest <suggestion>`);
  }
}

function invite(message, args, client) {
  if (_hasPermission(message, permissionGroups.basic)) {
    let color = Math.ceil(Math.random() * 16777215);
    message.channel.send({
      embed: {
        color: color,
        author: {
          name: client.user.tag,
          icon_url: client.user.displayAvatarURL(),
        },
        title: "Invite Links",
        description: "A couple important links.",
        thumbnail: {
          url: client.user.displayAvatarURL(),
        },
        fields: [
          {
            name: "Bot invite link",
            value: `[Invite link](${config.dbl.invite})`,
            inline: false,
          },
          {
            name: "My support server",
            value: `${config.server_link}\nView this for bot updates and socializing.`,
            inline: false,
          },
          {
            name: "Voting link",
            value: `[Vote](${config.dbl.vote})`,
            inline: false,
          },
        ],
        timestamp: new Date(),
        footer: {
          icon_url: message.author.displayAvatarURL(),
          text: message.author.tag,
        }
      }
    });
  }
  else {
    message.author.send("I don't have the permissions: " + userPermissionGroups.basic);
  }
}

function avatar(message, args) {
  if (_hasPermission(message, permissionGroups.basic)) {
    let thumbURL = message.author.displayAvatarURL();
    let user = message.mentions.users.first();
    if (user) {
      thumbURL = user.displayAvatarURL();
    }
    message.channel.send({
      embed: {
        color: 15567,
        thumbnail: {
          url: thumbURL,
        }
      }
    });
  }
  else {
    message.author.send("I am missing the permissions: " + permissionGroups.basic);
  }
}

function flip(message) {
  if (_hasPermission(message, permissionGroups.basic)) {
    let number = Math.ceil(Math.random() * 2);
    if (number === 1) message.channel.send("**Coin Flip:** Tails!");
    else message.channel.send("**Coin Flip:** Heads!");
  }
  else {
    message.author.send("I am missing the permissions: " + permissionGroups.basic);
  }
}

function add(message, args) {
  if (_hasPermission(message, permissionGroups.basic)) {
    if (args && args.length) {
      let bad = false;
      let sum = 0;
      for (let i = 0; i < args.length; i++) {
        if (isNaN(args[i])) {
          bad = true;
          message.author.send(`Usage: ${getPrefix(message)}add <arguments>`);
          break;
        }
      }
      if (bad === false) {
        if (args.length === 1) {
          message.channel.send(`${args[0]} = ${args[0]}`);
        }
        else {
          for (let i = 0; i < args.length; i++) {
            sum += Number(args[i]);
          }
          message.channel.send(`Sum: ${sum}`);
        }
      }
    }
    else {
      message.author.send(`Usage: ${getPrefix(message)}add <arguments>`);
    }
  }
  else {
    message.author.send("I am missing the permissions: " + permissionGroups.basic);
  }
}

function subtract(message, args) {
  if (_hasPermission(message, permissionGroups.basic)) {
    if (args && args.length) {
      let bad = false;
      let diff = 0;
      for (let i = 0; i < args.length; i++) {
        if (isNaN(args[i])) {
          bad = true;
          message.author.send(`Usage: ${getPrefix(message)}subtract <arguments>`);
          break;
        }
      }
      if (bad === false) {
        if(args.length === 1) {
          message.channel.send(`${args[0]} = ${args[0]}`);
        }
        else {
          diff = args[0];
          for (let i = 1; i < args.length; i++) {
            diff -= Number(args[i]);
          }
          message.channel.send(`Difference: ${diff}`);
        }
      }
    }
    else {
      message.author.send(`Usage: ${getPrefix(message)}subtract <arguments>`);
    }
  }
  else {
    message.author.send("I am missing the permissions: " + permissionGroups.basic);
  }
}

function divide(message, args) {
  if (_hasPermission(message, permissionGroups.basic)) {
    if (args && args.length) {
      let bad = false;
      for (let i = 0; i < args.length; i++) {
        if (isNaN(args[i])) {
          bad = true;
          message.author.send(`Usage: ${getPrefix(message)}divide <arguments>`);
          break;
        }
      }
      if (bad === true) return;
      for (let i = 1; i < args.length; i++) {
        if (args[i] == 0) {
          bad = true;
          message.author.send(`Can't divide by 0.\nUsage: ${getPrefix(message)}divide <arguments>`);
          break;
        }
      }
      if (bad === true) return;
      if (args.length === 1) {
        message.channel.send(`${args[0]} = ${args[0]}`);
      }
      else {
        let quot = args[0];
        for (let i = 1; i < args.length; i++) {
          quot /= args[i];
        }
        message.channel.send(`Quotient: ${quot}`);
      }
    }
    else {
      message.author.send(`Usage: ${getPrefix(message)}divide <arguments>`);
    }
  }
  else {
    message.author.send("I am missing the permissions: " + permissionGroups.basic);
  }
}

function multiply(message, args) {
  if (_hasPermission(message, permissionGroups.basic)) {
    if (args && args.length) {
      let bad = false;
      for (let i = 0; i < args.length; i++) {
        if (isNaN(args[i])) {
          bad = true;
          message.author.send(`Usage: ${getPrefix(message)}multiply <arguments>`);
          break;
        }
      }
      if (bad === true) return;
      if (args.length === 1) {
        message.channel.send(`${args[0]} = ${args[0]}`);
      }
      else {
        let prod = 1;
        for (let i = 0; i < args.length; i++) {
          prod *= args[i];
        }
        message.channel.send(`Product: ${prod}`);
      }
    }
    else {
      message.author.send(`Usage: ${getPrefix(message)}multiply <arguments>`);
    }
  }
  else {
    message.author.send("I am missing the permissions: " + permissionGroups.basic);
  }
}

function join(message) {
  if (_hasPermission(message, permissionGroups.join)) {
    if (message.member.voice.channel) {
      if (!message.guild.me.voice.channel) {
        let connection = message.member.voice.channel.join();
      }
      else {
        message.reply(`I'm already in a voice channel! Use \`${getPrefix(message)}leave\` first.`);
      }
    }
    else {
      message.reply("You need to join a voice channel first!")
    }
  }
  else {
    message.author.send("I am missing the permissions: " + permissionGroups.join);
  }
}

function leave(message) {
  if (_hasPermission(message, permissionGroups.basic)) {
    if (message.guild.me.voice.channel) {
      message.guild.me.voice.channel.leave();
    }
    else {
      message.reply("I'm not in a voice channel!");
    }
  }
  else {
    message.author.send("I am missing the permissions: " + permissionGroups.basic);
  }
}

function welcome(message, args) {
  if (_hasPermission(message, permissionGroups.basic)) {
    if (_userHasPermission(message, userPermissionGroups.admin)) {
      if (args && args.length) {
        if (args[0] === "set") _welcomeSet(message, args);        
        else if (args[0] === "get") _welcomeGet(message);
        else if (args[0] === "reset") _welcomeReset(message);
        else if (args[0] === "disable") _welcomeDisable(message);
        else {
          message.author.send(`Usage options:\n\`\`\`yaml\n${getPrefix(message)}welcome set <arguments>\n${getPrefix(message)}welcome get\n${getPrefix(message)}welcome reset\n${getPrefix(message)}welcome disable\`\`\``);
        }
      }
      else {
        message.author.send(`Usage options:\n\`\`\`yaml\n${getPrefix(message)}welcome set <arguments>\n${getPrefix(message)}welcome get\n${getPrefix(message)}welcome reset\n${getPrefix(message)}welcome disable\`\`\``);
      }
    }
    else {
      message.author.send("You are missing the permissions: " + userPermissionGroups.admin);
    }
  }
  else {
    message.author.send("I am missing the permissions: " + permissionGroups.basic);
  }
}

function react(message) {
  if (_hasPermission(message, permissionGroups.react)) {
    message.guild.emojis.forEach(function(emoji) {
      message.react(emoji).catch(function(err) {
        return;
      });
    });
  }
  else {
    message.author.send("I am missing the permissions: " + permissionGroups.react);
  }
}

function ball(message, args) {
  if (_hasPermission(message, permissionGroups.basic)) {
    if (args && args.length) {
    let c = Math.ceil(Math.random() * 3);
      if (c === 1) message.channel.send("Yes.");
      else if (c === 2) message.channel.send("No.");
      else message.channel.send("Maybe.");
    }
    else {
      message.author.send(`Usage: \`${getPrefix(message)}8ball <arguments>\``);
    }
  }
  else {
    message.author.send("I am missing the permissions: " + permissionGroups.basic);
  }
}

function jack(message, args, client) {
  if (_hasPermission(message, permissionGroups.basic)) {
    blackjack(message, client);
  }
  else {
    message.author.send("I am missing the permissions: " + permissionGroups.basic);
  }
}

function logs(message, args) {
  if (_hasPermission(message, permissionGroups.basic)) {
    if (_userHasPermission(message, userPermissionGroups.admin)) {
      if (args && args.length) {
        if (args[0] === "disable") {
          disableLogs(message);
          message.channel.send("Logs are now disabled for this server.");
        }
        else if (args[1] && args[0] === "set") {
          if (_findChannel(message, args[1]) === true) {
            setLogsChannel(message, args[1]);
            message.channel.send(`Logs channel set to \`${getLogsChannel(message.guild)}\``);
          }
          else {
            message.author.send(`I was unable to find text channel id: \`${args[1]}\``);
          }
        }
        else if (args[0] === "status") {
          message.channel.send(`\`\`\`yaml\nChannel Logs: ${getStatus(message)[0]}\nMessage logs: ${getStatus(message)[1]}\nRole Logs: ${getStatus(message)[2]}\nLogs Channel: ${getStatus(message)[3]}\`\`\``);
        }
        else if (args[1] && args[0] === "channel" && args[1] === "enable") {
          setChannel(message);
          message.channel.send(`\`\`\`yaml\nChannel Logs: ${getStatus(message)[0]}\nMessage logs: ${getStatus(message)[1]}\nRole Logs: ${getStatus(message)[2]}\nLogs Channel: ${getStatus(message)[3]}\`\`\``);
        }
        else if (args[1] && args[0] === "channel" && args[1] === "disable") {
          disableChannel(message);
          message.channel.send(`\`\`\`yaml\nChannel Logs: ${getStatus(message)[0]}\nMessage logs: ${getStatus(message)[1]}\nRole Logs: ${getStatus(message)[2]}\nLogs Channel: ${getStatus(message)[3]}\`\`\``);
        }
        else if (args[1] && args[0] === "message" && args[1] === "enable") {
          setMessage(message);
          message.channel.send(`\`\`\`yaml\nChannel Logs: ${getStatus(message)[0]}\nMessage logs: ${getStatus(message)[1]}\nRole Logs: ${getStatus(message)[2]}\nLogs Channel: ${getStatus(message)[3]}\`\`\``);
        }
        else if (args[1] && args[0] === "message" && args[1] === "disable") {
          disableMessage(message);
          message.channel.send(`\`\`\`yaml\nChannel Logs: ${getStatus(message)[0]}\nMessage logs: ${getStatus(message)[1]}\nRole Logs: ${getStatus(message)[2]}\nLogs Channel: ${getStatus(message)[3]}\`\`\``);
        }
        else if (args[1] && args[0] === "role" && args[1] === "enable") {
          setRole(message);
          message.channel.send(`\`\`\`yaml\nChannel Logs: ${getStatus(message)[0]}\nMessage logs: ${getStatus(message)[1]}\nRole Logs: ${getStatus(message)[2]}\nLogs Channel: ${getStatus(message)[3]}\`\`\``);
        }
        else if (args[1] && args[0] === "role" && args[1] === "disable") {
          disableRole(message);
          message.channel.send(`\`\`\`yaml\nChannel Logs: ${getStatus(message)[0]}\nMessage logs: ${getStatus(message)[1]}\nRole Logs: ${getStatus(message)[2]}\nLogs Channel: ${getStatus(message)[3]}\`\`\``);
        }
        else if (args[0] === "enable") {
          setChannel(message);
          setMessage(message);
          setRole(message);
          message.channel.send(`\`\`\`yaml\nChannel Logs: ${getStatus(message)[0]}\nMessage logs: ${getStatus(message)[1]}\nRole Logs: ${getStatus(message)[2]}\nLogs Channel: ${getStatus(message)[3]}\`\`\``);
        }
        else {
          message.author.send(`\`\`\`yaml\nUsage options:\n\t${getPrefix(message)}logs set <arguments>\n\t${getPrefix(message)}logs enable/disable\n\t${getPrefix(message)}logs status\n\t${getPrefix(message)}logs channel enable/disable\n\t${getPrefix(message)}logs message enable/disable\n\t${getPrefix(message)}logs role enable/disable\`\`\``);
        }
      }
      else {
        message.author.send(`\`\`\`yaml\nUsage options:\n\t${getPrefix(message)}logs set <arguments>\n\t${getPrefix(message)}logs enable/disable\n\t${getPrefix(message)}logs status\n\t${getPrefix(message)}logs channel enable/disable\n\t${getPrefix(message)}logs message enable/disable\n\t${getPrefix(message)}logs role enable/disable\`\`\``);
      }
    }
    else {
      message.author.send("You are missing the permissions: " + userPermissionGroups.admin);
    }
  }
  else {
    message.author.send("I am missing the permissions: " + permissionGroups.basic);
  }
}

function _hasPermission(message, group) {
  return message.guild.me.hasPermission(group);
}

function _userHasPermission(message, group) {
  return message.member.hasPermission(group);
}

function _welcomeSet(message, args) {
  if (!args[1]) {
    message.author.send(`Usage: ${getPrefix(message)}welcome set <arguments>`);
    return;
  }
  if (args[1] === "default" || _findChannel(message, args[1]) === true) {
    if (args[1] === "default") {
      resetWelcome(message);
    }
    else {
      setWelcome(message, args[1]);
      message.reply("welcome channel changed to " + getWelcome(message.guild));
    }
  }
  else {
    message.author.send(`I was unable to find text channel id: \`${args[1]}\`\nUsage:\n\`\`\`yaml\n ${getPrefix(message)}welcome set <channel_id>\`\`\``);
  }
}

function _welcomeGet(message) {
  message.reply(`Welcome Message Enabled: \`${welEnable(message.guild)}\`\nWelcome Channel: \`${getWelcome(message.guild)}\``);
}

function _welcomeReset(message) {
  resetWelcome(message);
}

function _welcomeDisable(message) {
  disableWelcome(message);
}

function _findChannel(message, channel) {
  let found = false;
  message.guild.channels.forEach(function(ch) {
    if (ch.id == channel && ch.type === 'text') {
      found = true;
      return found;
    }
  });
  return found;
}