var config = require('./hydrauth.json');
var getPrefix = require('./prefix.js').getPrefix;
var setPrefix = require('./prefix.js').setPrefix;
var resetPrefix = require('./prefix.js').resetPrefix;
var setWelcome = require('./welcome.js').setChannel;
var getWelcome = require('./welcome.js').getChannel;
var resetWelcome = require('./welcome.js').removeChannel;
var disableWelcome = require('./welcome.js').disableChannel;
var welEnable = require('./welcome.js').getEnable;

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
  join: join,
  leave: leave,
  add: add,
  subtract: subtract,
  divide: divide,
  multiply: multiply,
  welcome: welcome,
  help: help,
}

const permissionGroups = {
  basic: ['SEND_MESSAGES'],
  upload: ['SEND_MESSAGES', 'ATTACH_FILES'],
  kick: ['SEND_MESSAGES', 'KICK_MEMBERS'],
  ban: ['SEND_MESSAGES', 'BAN_MEMBERS'],
  manage: ['MANAGE_MESSAGES'],
  join: ['SEND_MESSAGES', 'CONNECT'],
  speak: ['SEND_MESSAGES', 'SPEAK'],
}

const userPermissionGroups = {
  kick: ['KICK_MEMBERS'],
  ban: ['BAN_MEMBERS'],
  admin: ['ADMINISTRATOR']
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
  message.author.send({
    embed: {
      color: color,
      author: {
        name: client.user.tag,
        icon_url: client.user.displayAvatarURL(),
      },
      title: "Hydra Commands",
      description: "A list of my commands!",
      thumbnail: {
        url: client.user.displayAvatarURL(),
      },
      fields: [
        {
          name: "Global Prefix",
          value: config.prefix,
          inline: true,
        },
        {
          name: "Guild Prefix",
          value: getPrefix(message),
          inline: true,
        },
        {
          name: '\u200b',
          value: '\u200b',
          inline: false,
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
          name: 'roll [1-3]',
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
          name: "Ping/Pong",
          value: '\u200b',
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
        icon_url: message.author.displayAvatarURL(),
        text: message.author.tag
      }
    }
  });
  message.author.send({
    embed: {
      color: color,
      thumbnail: {
        url: client.user.displayAvatarURL(),
      },
      fields: [
        {
          name: "kick <user> [reason]",
          value: "Kick a user [with reason]. Must have the KICK_MEMBERS permission.",
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
          name: "prefix set <new_prefix>",
          value: "Set a new prefix for the guild. Must have the ADMINISTRATOR permission.",
          inline: false,
        },
        {
          name: "prefix reset",
          value: "Reset the guild prefix to the global prefix. Must have the ADMINISTRATOR permissions.",
          inline: false,
        },
        {
          name: '\u200b',
          value: '\u200b',
        },
        {
          name: "Welcome Channel Commands",
          value: "The commands for changing welcome channels.\nAll commands require the ADMINISTRATOR permission.",
          inline: false,
        },
        {
          name: "welcome set <channel_id>",
          value: "Set a welcome channel using a channel id.\nPass `default` as an argument to reset channel to default.",
          inline: false,
        },
        {
          name: "welcome get",
          value: "Get the current welcome channel in the guild",
          inline: false,
        },
        {
          name: "welcome disable",
          value: "Disable welcome message for this guild",
          inline: false,
        },
        {
          name: "welcome reset",
          value: "Reset the welcome channel for the guild.\nDefault welcome channel is `welcomes` if I can find it in the guild.\nEnables welcome messages as well",
          inline: false,
        },
        {
          name: '\u200b',
          value: '\u200b',
        },
        {
          name: 'Owner',
          value: config.ownerUser,
          inline: false,
        },
        {
          name: 'Bot Developer',
          value: config.devUser,
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
        icon_url: message.author.displayAvatarURL(),
        text: message.author.tag
      }
    }
  });
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

function bulkdel(message, args) {
  if (_hasPermission(message, permissionGroups.manage)) {
    if (_userHasPermission(message, userPermissionGroups.admin)) {
      if (args && args.length) {
        if (!isNaN(args[0])) {
          message.channel.bulkDelete(args[0]).catch(function(err) {
            message.author.send("I was unable to delete messages in that channel.\nMake sure that I am bulk deleting messages under 14 days old.");
            console.error(err);
          });
        } else {
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
    let channel = client.channels.get(config.sugChannel);
    channel.send({
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
            inline: true,
          },
          {
            name: '\u200b',
            value: '\u200b',
            inline: true,
          },
          {
            name: '\u200b',
            value: '\u200b',
            inline: false,
          },
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
            value: `[Invite link](${config.invite_link})`,
            inline: false,
          },
          {
            name: "My support server",
            value: `${config.server_link}\nView this for bot updates and socializing.`,
            inline: false,
          },
          {
            name: "Voting link",
            value: `[Vote](${config.vote_link})`,
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
    if (message.member.voiceChannel) {
      if (!message.guild.me.voiceChannel) {
        message.member.voiceChannel.join().then(function(connection) {
          message.reply(`I have successfully connected to the channel.`);
        }).catch(function(err) {
          console.log(`Error in joining voice channel: ${err}`);
        });
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
    if (message.guild.me.voiceChannel) {
      let id = message.guild.me.voiceChannelID;
      let channel = message.guild.channels.find(ch => ch.id === id);
      message.guild.me.voiceChannel.leave().catch(function(err) {
        message.reply(`Something went wrong and I wasn't able to disconnect.`);
        console.error(`Error in disconnecting from voice channel: ${err}`);
      });
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
  if (_findChannel(message, args[1]) === true || args[1] === "default") {
    
    if (args[1] === "default") {
      resetWelcome(message);
    }
    else {
      setWelcome(message, args[1]);
      message.reply("welcome channel changed to " + getWelcome(message.guild));
    }
  }
  else {
    message.author.send(`I was unable to find channel id: \`${args[1]}\`\nUsage:\n\`\`\`yaml\n ${getPrefix(message)}welcome set <channel_id>\`\`\``);
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
    if (ch.id === channel) {
      found = true;
    }
  });
  return found;
}