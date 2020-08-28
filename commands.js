var config = require('./hydrauth.json');
// var config = require('./auth.json'); // Alternate config file
var commandsList = require('./commandsList.json');

// Prefix require
var getPrefix = require('./prefix.js').getPrefix;
var setPrefix = require('./prefix.js').setPrefix;
var resetPrefix = require('./prefix.js').resetPrefix;

// Welcome require
var welStatus = require('./welcome.js').status;
var welEnable = require('./welcome.js').enable;
var welDisable = require('./welcome.js').disable;
var welEnableJoin = require('./welcome.js').enableJoin;
var welDisableJoin = require('./welcome.js').disableJoin;
var welEnableLeave = require('./welcome.js').enableLeave;
var welDisableLeave = require('./welcome.js').disableLeave;
var welSetJoinChannel = require('./welcome.js').setJoinChannel;
var welSetLeaveChannel = require('./welcome.js').setLeaveChannel;
var welGetJoinEnable = require('./welcome.js').getJoinEnable;
var welGetJoinChannel = require('./welcome.js').getJoinChannel;
var welGetLeaveEnable = require('./welcome.js').getLeaveEnable;
var welGetLeaveChannel = require('./welcome.js').getLeaveChannel;

// Blackjack require
var blackjack = require('./hydrajack.js').blackjack;

// Logs require
// var getChannel = require('./logs.js').getChannel;
// var setChannel = require('./logs.js').setChannel;
// var disableChannel = require('./logs.js').disableChannel;
// var getMessage = require('./logs.js').getMessage;
// var setMessage = require('./logs.js').setMessage;
// var disableMessage = require('./logs.js').disableMessage;
// var getRole = require('./logs.js').getRole;
// var setRole = require('./logs.js').setRole;
// var disableRole = require('./logs.js').disableRole;
// var getLogsChannel = require('./logs.js').getLogsChannel;
// var setLogsChannel = require('./logs.js').setLogsChannel;
// var disableLogs = require('./logs.js').disableLogs;
// var getStatus = require('./logs.js').getStatus;

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
  info: info,
  remind: remind,
  rpc: rpc
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
  nickname: ['SEND_MESSAGES', 'MANAGE_NICKNAMES'],
  mute: ['SEND_MESSAGES', 'MUTE_MEMBERS']
}

const userPermissionGroups = {
  kick: ['KICK_MEMBERS'],
  ban: ['BAN_MEMBERS'],
  admin: ['ADMINISTRATOR'],
  nickname: ['MANAGE_NICKNAMES'],
  mute: ['MUTE_MEMBERS']
}

function help(message) {
  message.author.send(`Use \`${getPrefix(message)}commands\` for a list of commands.`);
}

function hmw(message, args) {
  if (_hasPermission(message, permissionGroups.basic)) {
    if (args && args.length) {
      if (_hasPermission(message, permissionGroups.upload) && Math.ceil(Math.random() * 20) === 5) {
        message.channel.send({files: ['https://i.imgur.com/w3duR07.png']});
        return;
      }
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
      if (args && args.length && args.length >= 1) {
        switch (args[0]) {
          case "set": setPrefix(message, args[1]); message.channel.send(`Set new prefix to ${getPrefix(message)}`); break;
          case "reset": resetPrefix(message); message.channel.send(`Reset prefix to ${config.prefix}`); break;
          default: message.author.send(`Usage Options:\n\`\`\`yaml\n${getPrefix(message)}prefix set <new_prefix>\n${getPrefix(message)}prefix reset\`\`\``);
        }
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

async function commands(message, args, client) {
  let color = Math.ceil(Math.random() * 16777215);
  let options = ['social', 'mod', 'prefix', 'welcome'];

  commandsList.socialCommands.color = color;
  commandsList.socialCommands.author.name = client.user.tag;
  commandsList.socialCommands.author.icon_url = client.user.displayAvatarURL();
  commandsList.socialCommands.thumbnail.url = client.user.displayAvatarURL();
  commandsList.socialCommands.fields[0].value = config.prefix;
  commandsList.socialCommands.fields[1].value = getPrefix(message);
  commandsList.socialCommands.timestamp = new Date();
  commandsList.socialCommands.footer.icon_url = message.author.displayAvatarURL();
  commandsList.socialCommands.footer.text = message.author.tag;

  commandsList.modCommands.color = color;
  commandsList.modCommands.author.name = client.user.tag;
  commandsList.modCommands.author.icon_url = client.user.displayAvatarURL();
  commandsList.modCommands.thumbnail.url = client.user.displayAvatarURL();
  commandsList.modCommands.fields[0].value = config.prefix;
  commandsList.modCommands.fields[1].value = getPrefix(message);
  commandsList.modCommands.timestamp = new Date();
  commandsList.modCommands.footer.icon_url = message.author.displayAvatarURL();
  commandsList.modCommands.footer.text = message.author.tag;

  // commandsList.logsCommands.color = color;
  // commandsList.logsCommands.author.name = client.user.tag;
  // commandsList.logsCommands.author.icon_url = client.user.displayAvatarURL();
  // commandsList.logsCommands.thumbnail.url = client.user.displayAvatarURL();
  // commandsList.logsCommands.fields[0].value = config.prefix;
  // commandsList.logsCommands.fields[1].value = getPrefix(message);
  // commandsList.logsCommands.timestamp = new Date();
  // commandsList.logsCommands.footer.icon_url = message.author.displayAvatarURL();
  // commandsList.logsCommands.footer.text = message.author.tag;

  commandsList.welcomeCommands.color = color;
  commandsList.welcomeCommands.author.name = client.user.tag;
  commandsList.welcomeCommands.author.icon_url = client.user.displayAvatarURL();
  commandsList.welcomeCommands.thumbnail.url = client.user.displayAvatarURL();
  commandsList.welcomeCommands.fields[0].value = config.prefix;
  commandsList.welcomeCommands.fields[1].value = getPrefix(message);
  commandsList.welcomeCommands.timestamp = new Date();
  commandsList.welcomeCommands.footer.icon_url = message.author.displayAvatarURL();
  commandsList.welcomeCommands.footer.text = message.author.tag;

  commandsList.prefixCommands.color = color;
  commandsList.prefixCommands.author.name = client.user.tag;
  commandsList.prefixCommands.author.icon_url = client.user.displayAvatarURL();
  commandsList.prefixCommands.thumbnail.url = client.user.displayAvatarURL();
  commandsList.prefixCommands.fields[0].value = config.prefix;
  commandsList.prefixCommands.fields[1].value = getPrefix(message);
  commandsList.prefixCommands.timestamp = new Date();
  commandsList.prefixCommands.footer.icon_url = message.author.displayAvatarURL();
  commandsList.prefixCommands.footer.text = message.author.tag;

  // commandsList.musicCommands.color = color;
  // commandsList.musicCommands.author.name = client.user.tag;
  // commandsList.musicCommands.author.icon_url = client.user.displayAvatarURL();
  // commandsList.musicCommands.thumbnail.url = client.user.displayAvatarURL();
  // commandsList.musicCommands.fields[0].value = config.prefix;
  // commandsList.musicCommands.fields[1].value = getPrefix(message);
  // commandsList.musicCommands.timestamp = new Date();
  // commandsList.musicCommands.footer.icon_url = message.author.displayAvatarURL();
  // commandsList.musicCommands.footer.text = message.author.tag;

  switch (args[0]) {
    case "social": message.author.send({embed: commandsList.socialCommands}); break;
    case "mod": message.author.send({embed: commandsList.modCommands}); break;
    case "prefix": message.author.send({embed: commandsList.prefixCommands}); break;
    case "welcome": message.author.send({embed: commandsList.welcomeCommands}); break;
    default: await message.author.send({embed: commandsList.socialCommands}); await message.author.send({embed: commandsList.modCommands}); await message.author.send({embed: commandsList.prefixCommands}); await message.author.send({embed: commandsList.welcomeCommands});
  }
}

async function info(message, args, client) {
  message.channel.send({
    embed: {
      color: Math.ceil(Math.random() * 16777215),
      author: {
        name: client.user.tag,
        icon_url: client.user.displayAvatarURL()
      },
      title: `${client.user.username} Information`,
      // description: "The list of credits",
      thumbnail: {
        url: client.user.displayAvatarURL()
      },
      fields: [
        {
          name: '\u200b',
          value: '\u200b',
          inline: false
        },
        {
          name: "Bot Owner",
          value: client.users.cache.get(config.userids.owner).tag,
          inline: false
        },
        {
          name: "Bot Developer",
          value: client.users.cache.get(config.userids.dev).tag,
          inline: false
        }
      ],
      timestamp: new Date(),
      footer: {
        icon_url: message.author.displayAvatarURL(),
        text: message.author.tag
      }
    }
  });
}

function roll(message, args) {
  if (_hasPermission(message, permissionGroups.basic)) {
    let d1 = Math.ceil(Math.random() * 6);
    let d2 = Math.ceil(Math.random() * 6);
    let sum = d1 + d2
    if (!(args && args.length)) {
      message.channel.send(`You rolled a ${d1} and a ${d2}. Sum: ${sum}`);
    }
    else {
      switch (args[0]) {
        case '1': message.channel.send(`You rolled a ${d1}`); break;
        case '2': message.channel.send(`You rolled a ${d1} and a ${d2}. Sum: ${sum}`); break;
        case '3': let d3 = Math.ceil(Math.random() * 6); sum += d3; message.channel.send(`You rolled a ${d1}, ${d2}, and a ${d3}. Sum ${sum}`); break;
        default: message.author.send(`Usage: ${getPrefix(message)}roll [1-3]`);
      }
    }
  }
  else message.author.send("I don't have the premissions: " + permissionGroups.basic);
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
        url: client.user.displayAvatarURL()
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
      files: ['https://i.imgur.com/w3duR07.png']
    });
    if (_hasPermission(message, permissionGroups.manage)) {
      message.delete([10]);
    }
  }
  else message.author.send("I don't have the permissions: " + permissionGroups.upload);
}

async function kick(message, args) {
  if (_hasPermission(message, permissionGroups.kick)) {
    if (_userHasPermission(message, userPermissionGroups.kick)) {
      let member = await message.mentions.members.first();
      let reason = args.slice(1).join(" ");
      if (member) _kick(message, member, reason);
      else {
        member = await message.guild.member(args[0]);
        if (member) _kick(message, member, reason);
        else message.reply("Please mention a guild member to kick.");
      }
    }
    else message.author.send("You don't have the permissions: " + userPermissionGroups.kick);
  }
  else message.author.send("I am missing the permissions: " + permissionGroups.kick);
}

async function ban(message, args) {
  if (_hasPermission(message, permissionGroups.ban)) {
    if (_userHasPermission(message, userPermissionGroups.ban)) {
      let member = await message.mentions.members.first();
      let reason = args.slice(1).join(" ");
      if (member) _ban(message, member, reason);
      else {
        member = await message.guild.member(args[0]);
        if (member) _ban(message, member, reason);
        else message.reply("Please mention a guild member to ban.");
      }
    }
    else message.author.send("You don't have the permissions: " + userPermissionGroups.ban);
  }
  else message.author.send("I am missing the permissions: " + permissionGroups.ban);
}

async function bulkdel(message, args) {
  if (_hasPermission(message, permissionGroups.manage)) {
    if (_userHasPermission(message, userPermissionGroups.admin)) {
      if ((args && args.length) && !isNaN(args[0])) {
        await message.channel.bulkDelete(args[0]).catch(function(err) {
          message.author.send("I was unable to delete messages in the channel.\nMake sure that I am not bulk deleting more than 100 messages and messages over 14 days old.");
        });
      }
      else message.author.send(`Usage: ${getPrefix(message)}bulkdel <number_of_messages_1-100>`);
    }
    else message.author.send("You are missing the permissions: " + userPermissionGroups.admin);
  }
  else message.author.send("I am missing the permissions: " + permissionGroups.manage);
}

function suggest(message, args, client) {
  if (args && args.length) {
    client.channels.get(config.sugChannel).send({
      embed: {
        color: Math.ceil(Math.random() * 16777215),
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
            value: args.join(" "),
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
    message.channel.send({
      embed: {
        color: Math.ceil(Math.random() * 16777215),
        author: {
          name: client.user.tag,
          icon_url: client.user.displayAvatarURL(),
        },
        title: "Invite Links",
        description: "Links to invite me.",
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
    let user = message.mentions.users.first();
    if (!user) user = message.author;
    message.channel.send({
      embed: {
        color: 15567,
        thumbnail: {
          url: user.displayAvatarURL(),
        }
      }
    });
  }
  else {
    message.author.send("I am missing the permissions: " + permissionGroups.basic);
  }
}

function add(message, args) {
  if (_hasPermission(message, permissionGroups.basic)) {
    if (args && args.length) {
      for (let i = 0; i < args.length; i++) {
        if (isNaN(args[i])) {
          message.author.send(`Usage: ${getPrefix(message)}add <arguments>`);
          return;
        }
      }
      if (args.length === 1) message.channel.send(`${args[0]} = ${args[0]}`);
      else {
        let sum = 0;
        for (let i = 0; i < args.length; i++) {
          sum += Number(args[i]);
        }
        message.channel.send(`Sum: ${sum}`);
      }
    }
    else message.author.send(`Usage: ${getPrefix(message)}add <arguments>`);
  }
  else message.author.send("I am missing the permission: " + permissionGroups.basic);
}

function subtract(message, args) {
  if (_hasPermission(message, permissionGroups.basic)) {
    if (args && args.length) {
      for (let i = 0; i < args.length; i++) {
        if (isNaN(args[i])) {
          message.author.send(`Usage: ${getPrefix(message)}subtract <arguments>`);
          return;
        }
      }
      if (args.length === 1) message.channel.send(`${args[0]} = ${args[0]}`);
      else {
        let diff = args[0];
        for (let i = 1; i < args.length; i++) {
          diff -= Number(args[i]);
        }
        message.channel.send(`Difference: ${diff}`);
      }
    }
    else message.author.send(`Usage: ${petPrefix(message)}subtract <arguments>`);
  }
  else message.author.send("I am missing the permissions: " + permissionGroups.basic);
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

function divide(message, args) {
  if (_hasPermission(message, permissionGroups.basic)) {
    if (args && args.length) {
      for (let i = 0; i < args.length; i++) {
        if (isNaN(args[i])) {
          message.author.send(`Usage: ${getPrefix(message)}divide <arguments>`);
          return;
        }
      }
      if (args.length === 1) message.channel.send(`${args[0]} = ${args[0]}`);
      else {
        for (let i = 1; i < args.length; i++) {
          if (args[i] == 0) {
            message.author.send(`Can't divide by 0.\nUsage: ${getPrefix(message)}divide <arguments>`);
            return;
          }
        }
        let quot = args[0];
        for (let i = 1; i < args.length; i++) {
          quot /= args[i];
        }
        message.channel.send(`Quotient: ${quot}`);
      }
    }
    else message.author.send(`Usage: ${getPrefix(message)}divide <arguments>`);
  }
  else message.author.send("I am missing the permissions: " + permissionGroups.basic);
}

function multiply(message, args) {
  if (_hasPermission(message, permissionGroups.basic)) {
    if (args && args.length) {
      for (let i = 0; i < args.length; i++) {
        if (isNaN(args[i])) {
          message.author.send(`Usage: ${getPrefix(message)}multiply <arguments>`);
          return;
        }
      }
      if (args.length === 1) message.channel.send(`${args[0]} = ${args[0]}`);
      else {
        let prod = 1;
        for (let i = 0; i < args.length; i++) {
          prod *= args[i];
        }
        message.channel.send(`Product: ${prod}`);
      }
    }
    else message.author.send(`Usage: ${getPrefix(message)}multiply <arguments>`);
  }
  else message.author.send("I am missing the permissions: " + permissionGroups.basic);
}

function welcome(message, args) {
  if (_hasPermission(message, permissionGroups.basic)) {
    if (_userHasPermission(message, userPermissionGroups.admin)) {
      if (args && args.length) {
        switch (args[0]) {
          case 'status': _welcomeStatus(message); break;
          case 'enable':
          case 'disable': _welcomeToggle(message, args[0]); _welcomeStatus(message); break;
          case 'join': _welcomeJoin(message, args); break;
          case 'leave': _welcomeLeave(message, args); break;
          default: message.author.send(`\`\`\`yaml\nUsage options:\n\t${getPrefix(message)}welcome status\n\t${getPrefix(message)}welcome enable\n\t${getPrefix(message)}welcome disable\n\t${getPrefix(message)}welcome join enable\n\t${getPrefix(message)}welcome join disable\n\t${getPrefix(message)}welcome join set <channel_id>\n\t${getPrefix(message)}welcome leave enable\n\t${getPrefix(message)}welcome leave disable\n\t${getPrefix(message)}welcome leave set <channel_id>\`\`\``);
        }
      }
      else message.author.send(`\`\`\`yaml\nUsage options:\n\t${getPrefix(message)}welcome status\n\t${getPrefix(message)}welcome enable\n\t${getPrefix(message)}welcome disable\n\t${getPrefix(message)}welcome join enable\n\t${getPrefix(message)}welcome join disable\n\t${getPrefix(message)}welcome join set <channel_id>\n\t${getPrefix(message)}welcome leave enable\n\t${getPrefix(message)}welcome leave disable\n\t${getPrefix(message)}welcome leave set <channel_id>\`\`\``);
    }
    else message.author.send("You are missing the permissions: " + userPermissionGroups.admin);
  }
  else message.author.send("I am missing the permissions: " + permissionGroups.basic);
}

function react(message) {
  if (_hasPermission(message, permissionGroups.react)) {
    message.guild.emojis.cache.forEach(function(emoji) {
      message.react(emoji).catch(function(err) {
        return;
      });
    });
  }
  else message.author.send("I am missing the permissions: " + permisionGroups.react);
}

function ball(message, args) {
  if (_hasPermission(message, permissionGroups.basic)) {
    if (args && args.length) {
      let c = Math.ceil(Math.random() * 3);
      if (c === 1) message.channel.send("Yes.");
      else if (c === 2) message.channel.send("No.");
      else message.channel.send("Maybe.");
    }
    else message.author.send(`Usage: \`${getPrefix(message)}8ball <arguments>\``);
  }
  else message.autho.send("I am missing the permissions: " + permissionGroups.basic);
}

function jack(message, args, client) {
  if (_hasPermission(message, permissionGroups.basic)) {
    blackjack(message, client);
  }
  else {
    message.author.send("I am missing the permissions: " + permissionGroups.basic);
  }
}

async function remind(message, args) {
  if (_hasPermission(message, permissionGroups.basic)) {
    let letter = false;
    if (args && args.length && args.length >= 2) {
      if (isNaN(args[0])) {
        if (isNaN(args[0].substring(0, args[0].length - 1))) {
          await message.author.send("Time must be a number. Add S or H directly after the number to indicate seconds or hours, respectively. Put nothing to indicate minutes.");
          return;
        }
        switch (args[0][args[0].length-1].toLowerCase()) {
          case "s":
          case "h": letter = true; break;
          default: await message.author.send("Only S or H directly after the number."); return;
        }
      }
      let time;
      if (letter === true) {
        switch (args[0][args[0].length-1].toLowerCase()) {
          case "s": time = Number(args[0].substring(0, args[0].length - 1)) * 1000; break;
          case "h": time = Number(args[0].substring(0, args[0].length - 1)) * 3600000; break;
        }
      }
      else time = Number(args[0]) * 60000;
      if (time > 2147483647) {
        await message.author.send("Time is too long. Maximum time is about 24.8 days, or 2,147,483,647 milliseconds.");
        return;
      }
      let reason = args.slice(1).join(" ");
      setTimeout(function() {
        message.author.send(`Reminder:\n\`${reason}\``);
      }, time);
      message.channel.send(`Reminder set for \`${reason}\` in \`${time} milliseconds\``);
    }
    else message.author.send(`Usage: ${getPrefix(message)}remind <time> <arguments>`);
  }
  else message.author.send("I am missing the permissions " + permissionGroups.basic);
}

function rpc(message, args) {
  if (_hasPermission(message, permissionGroups.basic)) {
    if (args && args.length >= 1) {
      let user;
      switch (args[0]) {
        case "r": user = "r"; break;
        case "rock": user = "r"; break;
        case "s": user = "s"; break;
        case "scissor": user = "s"; break;
        case "p": user = "p"; break;
        case "paper": user = "p"; break;
        default: message.author.send(`Usage: ${getPrefix(message)}rpc <rock/paper/scissor> [hard/medium/easy]`); return;
      }
      let d = "m";
      if (args.length >= 2) {
        switch (args[1]) {
          case "m":
          case "medium": d = "m"; break;
          case "h":
          case "hard": d = "h"; break;
          case "e":
          case "easy": d = "e"; break;
        }
      }
      let ai;
      if (d === "m") {
        switch (Math.ceil(Math.random() * 3)) {
          case 1: ai = "s"; break;
          case 2: ai = "r"; break;
          case 3: ai = "p"; break;
        }
      }
      else if (d === "e") {
        switch (user) {
          case "r": ai = "s"; break;
          case "p": ai = "r"; break;
          case "s": ai = "p"; break;
        }
      }
      else if (d === "h") {
        switch (user) {
          case "r": ai = "p"; break;
          case "p": ai = "s"; break;
          case "s": ai = "r"; break;
        }
      }
      _rpcCheck(message, user, ai);
    }
    else message.author.send(`Usage: ${getPrefix(message)}rpc <rock/paper/scissor> [hard/medium/easy]`);
  }
  else message.author.send("I am missing the permissions: " + permissionGroups.basic);
}

function _hasPermission(message, group) {
  return message.guild.me.hasPermission(group);
}

function _userHasPermission(message, group) {
  return message.member.hasPermission(group);
}

async function _kick(message, member, reason) {
  await member.kick(reason).catch(function(err) {
    message.reply(`I was unable to kick ${user.tag}.`);
    console.error(`Error in kick: ${err}`);
    return;
  });
  if (reason === "") message.reply(`successfully kicked ${member.user.tag}`);
  else message.reply(`successfully kicked ${member.user.tag} for \`${reason}\``);
}

async function _ban(message, member, reason) {
  await member.ban({reason: reason}).catch(function(err) {
    message.reply(`Unable to ban ${user.tag}`);
    console.error(`Error in kick: ${err}`);
    return;
  });
  if (reason === "") message.reply(`successfully banned ${member.user.tag}`);
  else message.reply(`successfully banned ${member.user.tag} for \`${reason}\``);
}

function _welcomeStatus(message) {
  let status = welStatus(message);
  message.channel.send(`\`\`\`yaml\nWelcome Status\n\nJoin Messages: ${status[0]}\nJoin Channel: ${status[1]}\nLeave Messages: ${status[2]}\nLeave Channel: ${status[3]}\`\`\``);
}

function _welcomeToggle(message, option) {
  if (option === 'enable') welEnable(message);
  else welDisable(message);
}

function _welcomeLeave(message, args) {
  if (args[1]) {
    switch (args[1]) {
      case 'enable':
      case 'disable': _welcomeLeaveToggle(message, args[1]); _welcomeStatus(message); break;
      case 'set': _welcomeLeaveChannel(message, args); break;
      default: message.author.send(`\`\`\`yaml\nUsage options:\n\t${getPrefix(message)}welcome leave enable\n\t${getPrefix(message)}welcome leave disable\n\t${getPrefix(message)}welcome leave set <channel_id>\`\`\``);
    }
  }
  else message.author.send(`\`\`\`yaml\nUsage options:\n\t${getPrefix(message)}welcome leave enable\n\t${getPrefix(message)}welcome leave disable\n\t${getPrefix(message)}welcome leave set <channel_id>\`\`\``);
}

function _welcomeJoinToggle(message, option) {
  if (option === 'enable') welEnableJoin(message);
  else welDisableJoin(message);
}

function _welcomeJoinChannel(message, args) {
  if (args[2]) {
    if (_findChannel(message, args[2])) {
      welSetJoinChannel(message, args[2]);
      _welcomeStatus(message);
    }
    else message.author.send(`I could not find a text channel with id \`${args[2]}\``);
  }
  else message.author.send(`Usage: \`${getPrefix(message)}welcome join set <channel_id>\``);
}

function _welcomeLeaveToggle(message, option) {
  if (option === 'enable') welEnableLeave(message);
  else welDisableLeave(message);
}

function _welcomeLeaveChannel(message, args) {
  if (args[2]) {
    if (_findChannel(message, args[2])) {
      welSetLeaveChannel(message, args[2]);
      _welcomeStatus(message);
    }
    else message.author.send(`I could not find a text channel with id \`${args[2]}\``);
  }
  else message.author.send(`Usage: \`${getPrefix(message)}welcome leave set <channel_id>\``);
}

function _findChannel(message, channel) {
  let found = false;
  message.guild.channels.cache.forEach(function(ch) {
    if (ch.id == channel && ch.type === 'text') {
      found = true;
      return found;
    }
  });
  return found;
}

function _rpcCheck(message, user, ai) {
  if (user === ai) {
    switch (ai) {
      case "r": ai = "rock"; break;
      case "p": ai = "paper"; break;
      case "s": ai = "scissor"; break;
    }
    message.channel.send(`I choose ${ai}. It's a tie.`);
  }
  else if (user === "r" && ai === "s") message.channel.send(`I choose scissor. You win!`);
  else if (user === "s" && ai === "p") message.channel.send(`I choose paper. You win!`);
  else if (user === "p" && ai === "r") message.channel.send(`I choose rock. You win!`);
  else if (user === "r" && ai === "p") message.channel.send(`I choose paper. I win!`);
  else if (user === "s" && ai === "r") message.channel.send(`I choose rock. I win!`);
  else if (user === "p" && ai === "s") message.channel.send(`I choose scissor. I win!`);
}