module.exports = {
  getChannel: getChannel,
  setChannel: setChannel,
  disableChannel: disableChannel,
  getMessage: getMessage,
  setMessage: setMessage,
  disableMessage: disableMessage,
  getRole: getRole,
  setRole: setRole,
  disableRole: disableRole,
  getLogsChannel: getLogsChannel,
  setLogsChannel: setLogsChannel,
  disableLogs: disableLogs,
  getStatus: getStatus
}

var fs = require('fs');

var channels = require('./hydra_json/channels.json');
var messages = require('./hydra_json/messages.json');
var roles = require('./hydra_json/roles.json');
var logs = require('./hydra_json/logs_channel.json');

function getChannel(guild) {
  if (guild && guild.id) {
    if (channels[guild.id]) return channels[guild.id];
    else return false;
  }
  else return false;
}

function setChannel(message) {
  if (message && message.guild && message.guild.id) {
    channels[message.guild.id] = true;
    fs.writeFile('./hydra_json/channels.json', JSON.stringify(channels), function(err) {
      if (err) console.error(err);
    });
  }
  else message.reply("No guild id found");
}

function disableChannel(message) {
  if (message && message.guild && message.guild.id) {
    delete channels[message.guild.id];
    fs.writeFile('./hydra_json/channels.json', JSON.stringify(channels), function(err) {
      if (err) console.error(err);
    });
  }
  else message.reply("No guild id found");
}

function getMessage(guild) {
  if (guild && guild.id) {
    if (messages[guild.id]) return messages[guild.id];
    else return false;
  }
  else return false;
}

function setMessage(message) {
  if (message && message.guild && message.guild.id) {
    messages[message.guild.id] = true;
    fs.writeFile('./hydra_json/messages.json', JSON.stringify(messages), function(err) {
      if (err) console.error(err);
    });
  }
  else message.reply("No guild id found");
}

function disableMessage(message) {
  if (message && message.guild && message.guild.id) {
    delete messages[message.guild.id];
    fs.writeFile('./hydra_json/messages.json', JSON.stringify(messages), function(err) {
      if (err) console.error(err);
    });
  }
  else message.reply("No guild id found");
}

function getRole(guild) {
  if (guild && guild.id) {
    if (roles[guild.id]) return roles[guild.id];
    else return false;
  }
  else return false;
}

function setRole(message) {
  if (message && message.guild && message.guild.id) {
    roles[message.guild.id] = true;
    fs.writeFile('./hydra_json/roles.json', JSON.stringify(roles), function(err) {
      if (err) console.error(err);
    });
  }
  else message.reply("No guild id found");
}

function disableRole(message) {
  if (message && message.guild && message.guild.id) {
    delete roles[message.guild.id];
    fs.writeFile('./hydra_json/roles.json', JSON.stringify(roles), function(err) {
      if (err) console.error(err);
    });
  }
  else message.reply("No guild id found");
}

function getLogsChannel(guild) {
  if (guild && guild.id) {
    if (logs[guild.id]) return logs[guild.id];
  }
}

function setLogsChannel(message, channel) {
  if (message && message.guild && message.guild.id) {
    logs[message.guild.id] = channel;
    fs.writeFile('./hydra_json/logs_channel.json', JSON.stringify(logs), function(err) {
      if (err) console.error(err);
    });
  }
  else message.reply("No guild id found");
}

function disableLogs(message) {
  if (message && message.guild && message.guild.id) {
    delete logs[message.guild.id];
    fs.writeFile('./hydra_json/logs_channel.json', JSON.stringify(logs), function(err) {
      if (err) console.error(err);
    });
    disableChannel(message);
    disableMessage(message);
    disableRole(message);
  }
  else message.reply("No guild id found");
}

function getStatus(message) {
  return [getChannel(message.guild), getMessage(message.guild), getRole(message.guild), getLogsChannel(message.guild)];
}