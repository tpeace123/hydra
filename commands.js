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

// Tictactoe require
var tictactoe = require('./tictactoe.js').tictactoe;

// Logs require
var logStatus = require('./logs.js').getStatus;
var setLogsChannel = require('./logs.js').setLogsChannel;
var clearLogsChannel = require('./logs.js').clearLogsChannel;
var enableUser = require('./logs.js').enableUser;
var disableUser = require('./logs.js').disableUser;
var enableRole = require('./logs.js').enableRole;
var disableRole = require('./logs.js').disableRole;
var enableMessage = require('./logs.js').enableMessage;
var disableMessage = require('./logs.js').disableMessage;
var enableChannel = require('./logs.js').enableChannel;
var disableChannel = require('./logs.js').disableChannel;

// Custom commands require
var cCom = require('./customCommands.js');

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
  rps: rps,
  tictactoe: tictac,
  logs: logs,
  policy: policy,
  cc: custom,
  ccl: ccL,
  unban: unban
}

const allCommands = [
  "hmw",
  "prefix",
  "ping",
  "pong",
  "commands",
  "roll",
  "links",
  "rip",
  "kick",
  "ban",
  "bulkdel",
  "suggest",
  "invite",
  "avatar",
  "flip",
  "add",
  "subtract",
  "divide",
  "multiply",
  "welcome",
  "help",
  "react",
  "8ball",
  "blackjack",
  "info",
  "remind",
  "rps",
  "tictactoe",
  "logs",
  "policy",
  "cc",
  "unban"
];

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
  if (_hasPermission(message, permissionGroups.basic)) {
    message.channel.send(`Use \`${getPrefix(message)}commands\` for a list of commands.`);
  }
  else {
    message.author.send(`Use \`${getPrefix(message)}commands\` for a list of commands.`);
  }
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
    else message.channel.send("I'm not sure what you need help with. Try `" + getPrefix(message) + "hmw <topic>`");
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
  let date = new Date();
  let thumbnail = await client.user.displayAvatarURL();

  // commandsList.music.color = color;
  // commandsList.music.author.name = client.user.tag;
  // commandsList.music.author.icon_url = client.user.displayAvatarURL();
  // commandsList.music.thumbnail.url = thumbnail;
  // commandsList.music.fields[0].value = config.prefix;
  // commandsList.music.fields[1].value = getPrefix(message);
  // commandsList.music.timestamp = new Date();
  // commandsList.music.footer.icon_url = message.author.displayAvatarURL();
  // commandsList.music.footer.text = message.author.tag;

  commandsList.social1.color = color;
  commandsList.social1.author.name = client.user.tag;
  commandsList.social1.author.icon_url = client.user.displayAvatarURL();
  commandsList.social1.description = "Social commands list page 1/4.\nServer Prefix: `" + getPrefix(message) + "`";
  commandsList.social1.thumbnail.url = thumbnail;
  commandsList.social1.timestamp = date;
  commandsList.social1.footer.icon_url = message.author.displayAvatarURL();
  commandsList.social1.footer.text = `${message.author.tag}\nThis will timeout after 10 minutes of the last action.`;

  commandsList.social2.color = color;
  commandsList.social2.author.name = client.user.tag;
  commandsList.social2.author.icon_url = client.user.displayAvatarURL();
  commandsList.social2.description = "Social commands list page 2/4.\nServer Prefix: `" + getPrefix(message) + "`";
  commandsList.social2.thumbnail.url = thumbnail;
  commandsList.social2.timestamp = date;
  commandsList.social2.footer.icon_url = message.author.displayAvatarURL();
  commandsList.social2.footer.text = `${message.author.tag}\nThis will timeout after 10 minutes of the last action.`;

  commandsList.social3.color = color;
  commandsList.social3.author.name = client.user.tag;
  commandsList.social3.author.icon_url = client.user.displayAvatarURL();
  commandsList.social3.description = "Social commands list page 3/4.\nServer Prefix: `" + getPrefix(message) + "`";
  commandsList.social3.thumbnail.url = thumbnail;
  commandsList.social3.timestamp = date;
  commandsList.social3.footer.icon_url = message.author.displayAvatarURL();
  commandsList.social3.footer.text = `${message.author.tag}\nThis will timeout after 10 minutes of the last action.`;

  commandsList.social4.color = color;
  commandsList.social4.author.name = client.user.tag;
  commandsList.social4.author.icon_url = client.user.displayAvatarURL();
  commandsList.social4.description = "Social commands list page 4/4.\nServer Prefix: `" + getPrefix(message) + "`";
  commandsList.social4.thumbnail.url = thumbnail;
  commandsList.social4.timestamp = date;
  commandsList.social4.footer.icon_url = message.author.displayAvatarURL();
  commandsList.social4.footer.text = `${message.author.tag}\nThis will timeout after 10 minutes of the last action.`;

  commandsList.mod1.color = color;
  commandsList.mod1.author.name = client.user.tag;
  commandsList.mod1.author.icon_url = client.user.displayAvatarURL();
  commandsList.mod1.description = "Moderator commands list page 1/1.\nServer Prefix: `" + getPrefix(message) + "`";
  commandsList.mod1.thumbnail.url = thumbnail;
  commandsList.mod1.timestamp = date;
  commandsList.mod1.footer.icon_url = message.author.displayAvatarURL();
  commandsList.mod1.footer.text = `${message.author.tag}\nThis will timeout after 10 minutes of the last action.`;

  commandsList.prefix1.color = color;
  commandsList.prefix1.author.name = client.user.tag;
  commandsList.prefix1.author.icon_url = client.user.displayAvatarURL();
  commandsList.prefix1.description = "Prefix commands list page 1/1. All commands require the administrator permission.\nServer Prefix: `" + getPrefix(message) + "`";
  commandsList.prefix1.thumbnail.url = thumbnail;
  commandsList.prefix1.timestamp = date;
  commandsList.prefix1.footer.icon_url = message.author.displayAvatarURL();
  commandsList.prefix1.footer.text = `${message.author.tag}\nThis will timeout after 10 minutes of the last action.`;

  commandsList.welcome1.color = color;
  commandsList.welcome1.author.name = client.user.tag;
  commandsList.welcome1.author.icon_url = client.user.displayAvatarURL();
  commandsList.welcome1.description = "Moderator commands list page 1/3. All commands require the administrator permission.\nServer Prefix: `" + getPrefix(message) + "`";
  commandsList.welcome1.thumbnail.url = thumbnail;
  commandsList.welcome1.timestamp = date;
  commandsList.welcome1.footer.icon_url = message.author.displayAvatarURL();
  commandsList.welcome1.footer.text = `${message.author.tag}\nThis will timeout after 10 minutes of the last action.`;

  commandsList.welcome2.color = color;
  commandsList.welcome2.author.name = client.user.tag;
  commandsList.welcome2.author.icon_url = client.user.displayAvatarURL();
  commandsList.welcome2.description = "Welcome commands list page 2/3. All commands require the administrator permission.\nServer Prefix: `" + getPrefix(message) + "`";
  commandsList.welcome2.thumbnail.url = thumbnail;
  commandsList.welcome2.timestamp = date;
  commandsList.welcome2.footer.icon_url = message.author.displayAvatarURL();
  commandsList.welcome2.footer.text = `${message.author.tag}\nThis will timeout after 10 minutes of the last action.`;

  commandsList.welcome3.color = color;
  commandsList.welcome3.author.name = client.user.tag;
  commandsList.welcome3.author.icon_url = client.user.displayAvatarURL();
  commandsList.welcome3.description = "Welcome commands list page 3/3. All commands require the administrator permission.\nServer Prefix: `" + getPrefix(message) + "`";
  commandsList.welcome3.thumbnail.url = thumbnail;
  commandsList.welcome3.timestamp = date;
  commandsList.welcome3.footer.icon_url = message.author.displayAvatarURL();
  commandsList.welcome3.footer.text = `${message.author.tag}\nThis will timeout after 10 minutes of the last action.`;

  commandsList.log1.color = color;
  commandsList.log1.author.name = client.user.tag;
  commandsList.log1.author.icon_url = client.user.displayAvatarURL();
  commandsList.log1.description = "Logging commands list page 1/2. All commands require the administrator permission.\nServer Prefix: `" + getPrefix(message) + "`";
  commandsList.log1.thumbnail.url = thumbnail;
  commandsList.log1.timestamp = date;
  commandsList.log1.footer.icon_url = message.author.displayAvatarURL();
  commandsList.log1.footer.text = `${message.author.tag}\nThis will timeout after 10 minutes of the last action.`;

  commandsList.log2.color = color;
  commandsList.log2.author.name = client.user.tag;
  commandsList.log2.author.icon_url = client.user.displayAvatarURL();
  commandsList.log2.description = "Logging commands list page 2/2. All commands require the administrator permission.\nServer Prefix: `" + getPrefix(message) + "`";
  commandsList.log2.thumbnail.url = thumbnail;
  commandsList.log2.timestamp = date;
  commandsList.log2.footer.icon_url = message.author.displayAvatarURL();
  commandsList.log2.footer.text = `${message.author.tag}\nThis will timeout after 10 minutes of the last action.`;

  commandsList.custom1.color = color;
  commandsList.custom1.author.name = client.user.tag;
  commandsList.custom1.author.icon_url = client.user.displayAvatarURL();
  commandsList.custom1.description = "Custom commands info page 1/1. All commands require the administrator permission.\nServer Prefix: `" + getPrefix(message) + "`";
  commandsList.custom1.thumbnail.url = thumbnail;
  commandsList.custom1.timestamp = date;
  commandsList.custom1.footer.icon_url = message.author.displayAvatarURL();
  commandsList.custom1.footer.text = `${message.author.tag}\nThis will timeout after 10 minutes of the last action.`;



  var list = [
    commandsList.social1, // Page 0
    commandsList.social2, // 1
    commandsList.social3, // 2
    commandsList.social4, // 3
    commandsList.mod1, // Page 4
    commandsList.prefix1, // Page 5
    commandsList.welcome1, // Page 6
    commandsList.welcome2, // 7
    commandsList.welcome3, // 8
    commandsList.log1, // Page 9
    commandsList.log2, // 10
    commandsList.custom1 // Page 11
  ];

  let ch = message.channel;
  let page = 0;
  switch (args[0]) {
    case "social": ch = message.channel; page = 0; break;
    case "mod": ch = message.channel; page = 4; break;
    case "prefix": ch = message.channel; page = 5; break;
    case "welcome": ch = message.channel; page = 6; break;
    case "logs": ch = message.channel; page = 9; break;
    case "custom": ch = message.channel; page = 11; break;
    case "dm":
      switch (args[1]) {
        case "social": ch = message.author; page = 0; break;
        case "mod": ch = message.author; page = 4; break;
        case "prefix": ch = message.author; page = 5; break;
        case "welcome": ch = message.author; page = 6; break;
        case "logs": ch = message.author; page = 9; break;
        case "custom": ch = message.author; page = 11; break;
        default: ch = message.author; page = 0;
      }
      break;
    default: ch = message.channel; page = 0;
  }
  if (!_hasPermission(message, permissionGroups.basic)) ch = message.author;
  _sendCommands(message, args, client, ch, list, page);
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
        },
        {
          name: "Server Count",
          value: client.guilds.cache.size,
          inline: false
        },
        {
          name: "Verification date",
          value: "September 11, 2020",
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
          value: "https://discord.com/terms",
        },
        {
          name: "Discord Privacy Policy",
          value: "https://discord.com/privacy",
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
      if (member) {
        if (message.member.roles.highest.position > member.roles.highest.position || message.guild.ownerID === message.author.id) {
          _kick(message, member, args.slice(1).join(" "));
        }
        else message.channel.send("Your highest role position must be higher than the person you wish to kick.");
      }
      else {
        member = await message.guild.member(args[0]);
        if (member) _kick(message, member, reason);
        else message.reply("Please mention a server member to kick.");
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
        if (member) {
          if (message.member.roles.highest.position > member.roles.highest.position || message.guild.ownerID === message.author.id) {
            _ban(message, member, reason);
          }
          else message.channel.send("Your highest role position must be higher than the position of the person you wish to ban.");
        }
        else message.reply("Please mention a server member to ban.");
      }
    }
    else message.author.send("You don't have the permissions: " + userPermissionGroups.ban);
  }
  else message.author.send("I am missing the permissions: " + permissionGroups.ban);
}

async function unban(message, args) {
  if (_hasPermission(message, permissionGroups.ban)) {
    if (_userHasPermission(message, userPermissionGroups.ban)) {
      if (!args || !args.length >= 1) {
        message.author.send(`Usage: ${getPrefix(message)}unban <user_id/username+discriminator>`);
        return;
      }
      let bans = await message.guild.fetchBans();
      if (await bans.array().length === 0) {
        message.reply("there are no banned users in this server.");
        return;
      }
      let user;
      let info = await message.guild.fetchBan(args[0]).catch(function(err) {});
      if (!info) {
        let filter = function(ban) {
          return `${ban.user.username}#${ban.user.discriminator}` === message.content.substring(getPrefix(message).length+6);
        }
        info = await bans.find(filter);
        if (!info) {
          message.channel.send("I was unable to find this user in the bans list. Check to see if you enter the user information correctly (user id is preferred) or if the user is banned in this server.");
          return;
        }
        user = info.user.id;
      }
      else user = args[0];
      await message.guild.members.unban(user).catch(function(err) {
        message.channel.send("There was an error unbanning this user.");
        console.error(err);
        return;
      });
      if (info.reason === null) {
        message.channel.send(`Unbanned ${info.user.username}#${info.user.discriminator}.`);
      }
      else message.channel.send(`Unbanned ${info.user.username}#${info.user.discriminator}.\nUser was previously banned for \`${info.reason}\``);
    }
    else message.author.send("You are missing the permissions: " + userPermissionGroups.ban);
  }
  else message.author.send("I am missing the permissions: " + permissionGroups.ban);
}

async function bulkdel(message, args) {
  if (_hasPermission(message, permissionGroups.manage)) {
    if (_userHasPermission(message, userPermissionGroups.admin)) {
      if ((args && args.length) && !isNaN(args[0])) {
        await message.channel.bulkDelete(args[0]).catch(function(err) {
          message.author.send("I was unable to delete messages in the channel.\nMake sure that I am not deleting more than 100 messages and messages over 14 days old.");
        });
      }
      else message.author.send(`Usage: ${getPrefix(message)}bulkdel <number_of_messages_1-100>`);
    }
    else message.author.send("You are missing the permissions: " + userPermissionGroups.admin);
  }
  else message.author.send("I am missing the permissions: " + permissionGroups.manage);
}

async function suggest(message, args, client) {
  if (args && args.length) {
    client.channels.cache.get(config.sugChannel).send({
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
          }/*,
          {
            name: "Server",
            value: message.guild.name,
            inline: false
          },
          {
            name: '\u200b',
            value: '\u200b',
            inline: false
          }*/
        ],
        timestamp: new Date(),
        footer: {
          icon_url: client.user.displayAvatarURL(),
          text: client.user.tag
        }
      }
    }).then(function() {
      if (_hasPermission(message, permissionGroups.basic)) {
        message.channel.send(`Suggestion \`${args.join(" ")}\` sent.`);
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
            name: "Support Server",
            value: `[Join](${config.server_link}) for bot updates and socializing.`,
            inline: false,
          },
          {
            name: "Voting link",
            value: `[Vote on DBL](${config.dbl.vote})`,
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

async function avatar(message, args, client) {
  if (_hasPermission(message, permissionGroups.basic)) {
    let user = await message.mentions.users.first();
    if (!user) {
      user = await client.users.cache.get(args[0]);
      if (!user) user = message.author;
    }
    message.channel.send({
      embed: {
        color: 15567,
        thumbnail: {
          url: user.displayAvatarURL()/*,
          height: 10,
          width: 10*/
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
      if (letter) {
        let sentUnit = args[0][args[0].length-1].toLowerCase();
        let unit = "";
        if (sentUnit === "s") unit = "seconds";
        else unit = "hours";
        message.channel.send(`Reminder set for \`${reason}\` in \`${args[0].substring(0, args[0].length-1)} ${unit}\``)
      }
      else {
        message.channel.send(`Reminder set for \`${reason}\` in \`${args[0]} minutes\``);
      }
    }
    else message.author.send(`Usage: ${getPrefix(message)}remind <time> <arguments>`);
  }
  else message.author.send("I am missing the permissions " + permissionGroups.basic);
}

function rps(message, args) {
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
        default: message.author.send(`Usage: ${getPrefix(message)}rps <rock/paper/scissor> [hard/medium/easy]`); return;
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
      _rpsCheck(message, user, ai);
    }
    else message.author.send(`Usage: ${getPrefix(message)}rps <rock/paper/scissor> [hard/medium/easy]`);
  }
  else message.author.send("I am missing the permissions: " + permissionGroups.basic);
}

function tictac(message, args, client) {
  if (_hasPermission(message, permissionGroups.basic)) {
    tictactoe(message, client);
  }
  else message.author.send("I am missing the permissions: " + permissionGroups.basic);
}

function logs(message, args, client) {
  if (_hasPermission(message, permissionGroups.basic)) {
    if (_userHasPermission(message, userPermissionGroups.admin)) {
      if (args && args.length >= 1) {
        switch (args[0]) {
          case "status": _logStatus(message); break;
          case "enable":
          case "disable": _logToggle(message, args[0]); break;
          case "set": _logSet(message, args); break;
          case "user": _logUser(message, args); break;
          case "role": _logRole(message, args); break;
          case "message": _logMessage(message, args); break;
          case "channel": _logChannel(message, args); break;
          default: message.author.send(`\`\`\`yaml\nUsage Options:\n\t${getPrefix(message)}logs status\n\t${getPrefix(message)}logs enable\n\t${getPrefix(message)}logs disable\n\t${getPrefix(message)}logs set <channel_id>\n\t${getPrefix(message)}logs user enable\n\t${getPrefix(message)}logs user disable\n\t${getPrefix(message)}logs role enable\n\t${getPrefix(message)}logs role disable\n\t${getPrefix(message)}logs message enable\n\t${getPrefix(message)}logs message disable\n\t${getPrefix(message)}logs channel enable\n\t${getPrefix(message)}logs channel disable\`\`\``);
        }
      }
      else message.author.send(`\`\`\`yaml\nUsage Options:\n\t${getPrefix(message)}logs status\n\t${getPrefix(message)}logs enable\n\t${getPrefix(message)}logs disable\n\t${getPrefix(message)}logs set <channel_id>\n\t${getPrefix(message)}logs user enable\n\t${getPrefix(message)}logs user disable\n\t${getPrefix(message)}logs role enable\n\t${getPrefix(message)}logs role disable\n\t${getPrefix(message)}logs message enable\n\t${getPrefix(message)}logs message disable\n\t${getPrefix(message)}logs channel enable\n\t${getPrefix(message)}logs channel disable\`\`\``);
    }
    else message.channel.send("You are missing the " + userPermissionGroups.admin + " permissions.");
  }
  else message.author.send("I am missing the permissions: " + permissionGroups.basic);
}

function policy(message, args, client) {
  let receiver;
  if (_hasPermission(message, permissionGroups.basic) && (!args[0] || args[0] !== 'dm')) {
    receiver = message.channel;
  }
  else receiver = message.author;
  receiver.send({
    embed: {
      title: "Hydra Privacy Policy",
      author: {
        name: client.user.name,
        icon_url: client.user.displayAvatarURL()
      },
      color: Math.ceil(Math.random() * 16777215),
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
          name: "1) What data do you collect, including but not limited to personal identifying information?",
          value: "Hydra stores server ids and channel ids of servers that have opted in to use features such as welcome, logs, and prefix storage.",
          inline: false
        },
        {
          name: "2) Why do you need the data?",
          value: "The server ids and channel ids are used to first identify if a server has opted in to use one of these features, and if yes, which channel to send the required messages to.",
          inline: false
        },
        {
          name: "3) How do you use the data?",
          value: "A server id is used to identify whether or not the feature is enabled for a server. The channel ids are used to identify which channel to send the required messages to.",
          inline: false
        },
        {
          name: "4) Other than Discord the company and users of your own bot on Discord the platform, who do you share your collected data with, if anyone?",
          value: "This data is not shared with anyone. The only person that has access to this data is the primary developer, `T Peace#9407`. Moderators can view the data for the server they moderate, but not for any other servers.",
          inline: false
        },
        {
          name: "5) How can users contact you if they have concerns about your bot?",
          value: "Users can DM the primary developer, `T Peace#9407`, or visit the support server and ask a developer or admin.",
          inline: false
        },
        {
          name: "6) If you store data, how can users have that data removed?",
          value: "If a user wishes to delete any stored data, they can use a command to disable the feature. Doing this will delete any stored data. Alternatively, the user can contact `T Peace#9407` and ask to delete the information in the stored file.",
          inline: false
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

async function custom(message, args, client) {
  if (_hasPermission(message, permissionGroups.basic)) {
    if (_userHasPermission(message, userPermissionGroups.admin)) {
      if (args && args.length >= 2) {
        switch (args[0]) {
          case "del":
          case "delete":
            switch (cCom.del(message.guild, args[1])) {
              case "s": message.channel.send("Successfully deleted custom command: `" + args[1] + "`."); break;
              case "g": message.channel.send("An error occured. Please try again."); break;
              case "n": message.channel.send(`The custom command \`${args[1]}\` does not exist for this server.`); break;
            }
            break;
          case "add":
            if (!(args.length >= 4)) {
              message.author.send(`\`\`\`yaml\nUsage Options\n${getPrefix(message)}cc add <name> message <message_sent>\n${getPrefix(message)}cc add <name> role [availability] <role_ids>\`\`\``);
              return;
            }
            if (allCommands.indexOf(args[1]) > -1) {
              message.author.send("You cannot make a custom command the same name as an official command.");
              return;
            }
            if (args[2] === "message" || args[2] === "role") {
              if (args[2] === "message") {
                let r = await cCom.add(message.guild, args[1], "message", "e", args.slice(3).join(' '));
                switch (r) {
                  case "g": message.channel.send("An error occured. Please try again."); break;
                  case "s": message.channel.send("Successfully added custom command: `" + args[1] + "`."); break;
                  case "t": message.channel.send("The command `" + args[1] + "` already exists for this guild."); break;
                }
              }
              else {
                let avail = "e";
                let roles = [];
                if (args[3] === "e" || args[3] === "m") avail = args[3];
                let arr = args.slice(3);
                for (let i = 0; i < arr.length; i++) {
                  let role = await message.guild.roles.cache.get(arr[i]);
                  if (role) roles.push(arr[i]);
                }
                if (roles.length === 0) {
                  message.reply("you need to specify which roles to add when this command is used.");
                  return;
                }
                let r = await cCom.add(message.guild, args[1], "role", avail, roles);
                switch (r) {
                  case "g": message.channel.send("An error occured. Please try again."); break;
                  case "s": message.channel.send("Successfully added custom command: `" + args[1] + "`."); break;
                  case "t": message.channel.send("The command `" + args[1] + "` already exists for this guild."); break;
                }
              }
            }
            else {
              message.author.send(`\`\`\`yaml\nUsage Options\n${getPrefix(message)}cc add <name> message <message_sent>\n${getPrefix(message)}cc add <name> role [availability] <role_ids>\`\`\``);
            }
            break;
          default: message.author.send(`\`\`\`yaml\nUsage Options\n${getPrefix(message)}cc del <command>\n${getPrefix(message)}cc add <name> message <message>\ncc add <name> role [availability] <role_ids>\`\`\``);
        }
      }
      else message.author.send(`\`\`\`yaml\nUsage Options\n${getPrefix(message)}cc del <command>\n${getPrefix(message)}cc add <name> message <message>\ncc add <name> role [availability] <role_ids>\`\`\``);
    }
    else message.author.send("You are missing the permissions: " + userPermissionGroups.admin);
  }
  else message.author.send("I am missing the permissions: " + permissionGroups.basic);
}

async function ccL(message, args, client) {
  if (_hasPermission(message, permissionGroups.basic)) {
    let list = cCom.list(message.guild);
    if (list === "g") {
      message.channel.send("An error occured. Please try again.");
      return;
    }
    else if (list === "e") {
      message.channel.send("There are no custom commands for this server.");
      return;
    }
    let color = [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];
    let thumbURL = message.guild.iconURL({dynamic: true});
    if (!thumbURL) thumbURL = client.user.displayAvatarURL();
    var embed = {
      color: color,
      title: `${message.guild.name} Custom Commands List.`,
      description: "A list of all custom commands for this server.",
      thumbnail: {
        url: thumbURL
      },
      author: {
        name: client.user.tag,
        icon_url: client.user.displayAvatarURL()
      },
      fields: [],
      timestamp: new Date(),
      footer: {
        text: message.author.tag,
        icon_url: message.author.displayAvatarURL()
      }
    };
    let arr = Object.keys(list);
    for (let i = 0; i < arr.length; i += 25) {
      let arr2 = arr.slice(i);
      for (let j = 0; j < arr2.length && j < 25; j++) {
        let val;
        if (list[arr2[j]].type === "message") {
          val = `Sends the message:\n${list[arr2[j]].action}`;
        }
        else {
          let roles = [];
          for (let k in list[arr2[j]].action) {
            roles.push(` \`${await message.guild.roles.cache.get(list[arr2[j]].action[k]).name}\` `);
          }
          let usage;
          if (list[arr2[j]].user === "e") usage = "Everyone";
          else usage = "Moderators";
          val = `Adds the roles to selected user:\n${roles}\nUsage: ${usage}`;
        }
        embed.fields.push({
          name: arr2[j],
          value: val,
          inline: false
        });
      }
      message.channel.send({embed: embed});
      embed.fields = [];
    }
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
  let joinChannel;
  let leaveChannel;
  if (status[1]) joinChannel = `#${message.guild.channels.cache.get(status[1]).name}`;
  if (status[3]) leaveChannel = `#${message.guild.channels.cache.get(status[3]).name}`;
  message.channel.send(`\`\`\`yaml\nWelcome Status\n\nJoin Messages: ${status[0]}\nJoin Channel: ${joinChannel}\nLeave Messages: ${status[2]}\nLeave Channel: ${leaveChannel}\`\`\``);
}

function _welcomeToggle(message, option) {
  if (option === 'enable') welEnable(message);
  else welDisable(message);
}

function _welcomeJoin(message, args) {
  if (args[1]) {
    switch (args[1]) {
      case 'enable':
      case 'disable': _welcomeJoinToggle(message, args[1]); _welcomeStatus(message); break;
      case 'set': _welcomeJoinChannel(message, args); break;
      default: message.author.send(`\`\`\`yaml\nUsage options:\n\t${getPrefix(message)}welcome join enable\n\t${getPrefix(message)}welcome join disable\n\t${getPrefix(message)}welcome join set <channel_id>\`\`\``);
    }
  }
  else message.author.send(`\`\`\`yaml\nUsage options:\n\t${getPrefix(message)}welcome join enable\n\t${getPrefix(message)}welcome join disable\n\t${getPrefix(message)}welcome join set <channel_id>\`\`\``);
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

function _rpsCheck(message, user, ai) {
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

function _logStatus(message) {
  let status = logStatus(message.guild);
  let logChannel;
  if (status[0]) logChannel = `#${message.guild.channels.cache.get(status[0]).name}`;
  message.channel.send(`\`\`\`yaml\nLogs Status\n\nLogs Channel: ${logChannel}\nUser Logs: ${status[1]}\nRole Logs: ${status[2]}\nMessage Logs: ${status[3]}\nChannel Logs: ${status[4]}\`\`\``);
}

function _logToggle(message, option) {
  if (option === "enable") {
    enableUser(message.guild);
    enableRole(message.guild);
    enableMessage(message.guild);
    enableChannel(message.guild);
  }
  else {
    disableUser(message.guild);
    disableRole(message.guild);
    disableMessage(message.guild);
    disableChannel(message.guild);
    clearLogsChannel(message.guild);
  }
  _logStatus(message);
}

async function _logSet(message, args) {
  if (args[1]) {
    if (await _findChannel(message, args[1])) {
      setLogsChannel(message.guild, args[1]);
      _logStatus(message);
    }
    else message.channel.send(`I could not find a text channel with channel id ${args[1]}`);
  }
  else message.author.send(`Usage: ${getPrefix(message)}logs set <channel_id>`);
}

function _logUser(message, args) {
  if (args[1] && (args[1] === "enable" || args[1] === "disable")) {
    if (args[1] === "enable") enableUser(message.guild);
    else disableUser(message.guild);
    _logStatus(message);
  }
  else message.author.send(`\`\`\`yaml\nUsage options:\n\t${getPrefix(message)}logs user enable\n\t${getPrefix(message)}logs user disable\`\`\``);
}

function _logRole(message, args) {
  if (args[1] && (args[1] === "enable" || args[1] === "disable")) {
    if (args[1] === "enable") enableRole(message.guild);
    else disableRole(message.guild);
    _logStatus(message);
  }
  else message.author.send(`\`\`\`yaml\nUsage options:\n\t${getPrefix(message)}logs role enable\n\t${getPrefix(message)}logs role disable\`\`\``); 
}

function _logMessage(message, args) {
  if (args[1] && (args[1] === "enable" || args[1] === "disable")) {
    if (args[1] === "enable") enableMessage(message.guild);
    else disableMessage(message.guild);
    _logStatus(message);
  }
  else message.author.send(`\`\`\`yaml\nUsage options:\n\t${getPrefix(message)}logs message enable\n\t${getPrefix(message)}logs message disable\`\`\``);
}

function _logChannel(message, args) {
  if (args[1] && (args[1] === "enable" || args[1] === "disable")) {
    if (args[1] === "enable") enableChannel(message.guild);
    else disableChannel(message.guild);
    _logStatus(message);
  }
  else message.author.send(`\`\`\`yaml\nUsage options:\n\t${getPrefix(message)}logs channel enable\n\t${getPrefix(message)}logs channel disable\`\`\``);
}

async function _sendCommands(message, args, client, channel, list, page = 0) {
  let sent = await channel.send({embed: list[page]});
  await sent.react('⏪').catch(function(err) {
    console.error(err);
    return;
  });
  await sent.react('◀️').catch(function(err) {
    console.error(err);
    return;
  });
  await sent.react('▶️').catch(function(err) {
    console.error(err);
    return;
  });
  await sent.react('⏩').catch(function(err) {
    console.error(err);
    return;
  });
  _commandsReaction(message, args, client, list, page, sent);
}

async function _commandsReaction(message, args, client, list, page, sent) {
  const commandFilter = function(reaction, user) {
    return (reaction.emoji.name === '◀️' || reaction.emoji.name === '▶️' ||
    reaction.emoji.name === '⏪' || reaction.emoji.name === '⏩') &&
    user.id === message.author.id
  };
  var collector = await sent.createReactionCollector(commandFilter, {time: 600000 /*10000*/, max: 1, maxUsers: 1});
  collector.on('collect', async function(r) {
    if (r.emoji.name === '◀️') {
      page -= 1;
      if (page < 0) page = list.length - 1;
    }
    else if (r.emoji.name === '⏪') {
      if (page === 0) {
        _commandsReaction(message, args, client, list, page, sent);
        return;
      }
      page = 0;
    }
    else if (r.emoji.name === '⏩') {
      if (page === list.length - 1) {
        _commandsReaction(message, args, client, list, page, sent);
        return;
      }
      page = list.length - 1;
    }
    else {
      page += 1;
      if (page >= list.length) page = 0;
    }
    list[page].timestamp = new Date();
    // if (list[page].color !== color) list[page].color = color;
    sent.edit({embed: list[page]});
    // await sent.reactions.cache.get(r.emoji.name).remove();
    // await sent.react(r.emoji.name);
  
    // await sent.reactions.removeAll();
    // await sent.react('⏪');
    // await sent.react('◀️');
    // await sent.react('▶️');
    // await sent.react('⏩');
    _commandsReaction(message, args, client, list, page, sent);
  });
  collector.on('end', function(collected) {
  });
}