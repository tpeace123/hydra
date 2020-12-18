var getPrefix = require('./prefix.js').getSlashPrefix;

module.exports = {
  hmw: hmw,
  ping: ping,
  pong: pong,
  policy: policy,
  prefix: prefix
}

function hmw(args) {
  if (args && args.length) {
    let personalProblems = ['life', 'my life', 'friends', 'a boyfriend', 'a girlfriend'];
    if (personalProblems.indexOf(args[0].value) > -1) return "That sounds like a personal problem";
    else return "It looks like you might need help with `" + args[0].value + "`";
  }
}

function ping() {
  return "Pong!";
}

function pong() {
  return "Ya know, that's my line!";
}

function policy(args, client, member) {
  return [{
    title: "Hydra Privacy Policy",
    author: {
      name: client.user.tag,
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
      }
    ],
    timestamp: new Date(),
    footer: {
      // icon_url: member.user.avatar,
      icon_url: client.user.displayAvatarURL(),
      text: `${member.user.username}#${member.user.discriminator}`
    }
  }];
}

function prefix(args, client, member, gid) {
  return `My prefix for this server is \`${getPrefix(gid)}\``;
}