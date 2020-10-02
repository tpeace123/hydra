module.exports = {
  getStatus,
  setLogsChannel,
  clearLogsChannel,
  enableUser,
  disableUser,
  enableRole,
  disableRole,
  enableMessage,
  disableMessage,
  enableChannel,
  disableChannel,
  getLogsChannel,
  getUser,
  getRole,
  getMessage,
  getChannel
}

/**
 * 4 Log Types:
 * 
 * User Logs
 * Role Logs
 * Message Logs
 * Channel Logs
 */

var fs = require('fs');

var logs = require('./hydra_json/logs_channel.json');
var users = require('./hydra_json/users.json');
var roles = require('./hydra_json/roles.json');
var messages = require('./hydra_json/messages.json');
var channels = require('./hydra_json/channels.json');

function getStatus(guild) {
  return [getLogsChannel(guild), getUser(guild), getRole(guild), getMessage(guild), getChannel(guild)];
}

function setLogsChannel(guild, channel) {
  if (guild && guild.id) {
    logs[guild.id] = channel;
    _writeLogsChannel();
  }
}

function clearLogsChannel(guild) {
  if (guild && guild.id) {
    delete logs[guild.id];
    _writeLogsChannel();
  }
}

function enableUser(guild) {
  if (guild && guild.id) {
    users[guild.id] = true;
    _writeUsers();
  }
}

function disableUser(guild) {
  if (guild && guild.id) {
    delete users[guild.id];
    _writeUsers();
  }
}

function enableRole(guild) {
  if (guild && guild.id) {
    roles[guild.id] = true;
    _writeRoles();
  }
}

function disableRole(guild) {
  if (guild && guild.id) {
    delete roles[guild.id];
    _writeRoles();
  }
}

function enableMessage(guild) {
  if (guild && guild.id) {
    messages[guild.id] = true;
    _writeMessages();
  }
}

function disableMessage(guild) {
  if (guild && guild.id) {
    delete messages[guild.id];
    _writeMessages();
  }
}

function enableChannel(guild) {
  if (guild && guild.id) {
    channels[guild.id] = true;
    _writeChannels();
  }
}

function disableChannel(guild) {
  if (guild && guild.id) {
    delete channels[guild.id];
    _writeChannels();
  }
}

function getLogsChannel(guild) {
  if (guild && guild.id) {
    if (logs[guild.id]) return logs[guild.id];
  }
}

function getUser(guild) {
  if (guild && guild.id) {
    if (users[guild.id]) return users[guild.id];
    else return false;
  }
}

function getRole(guild) {
  if (guild && guild.id) {
    if (roles[guild.id]) return roles[guild.id];
    else return false;
  }
}

function getMessage(guild) {
  if (guild && guild.id) {
    if (messages[guild.id]) return messages[guild.id];
    else return false;
  }
}

function getChannel(guild) {
  if (guild && guild.id) {
    if (channels[guild.id]) return channels[guild.id];
    else return false;
  }
}

function _writeLogsChannel() {
  fs.writeFile('./hydra_json/logs_channel.json', JSON.stringify(logs), function(err) {
    if (err) console.error(err);
  });
}

function _writeUsers() {
  fs.writeFile('./hydra_json/users.json', JSON.stringify(users), function(err) {
    if (err) console.error(err);
  });
}

function _writeRoles() {
  fs.writeFile('./hydra_json/roles.json', JSON.stringify(roles), function(err) {
    if (err) console.error(err);
  });
}

function _writeMessages() {
  fs.writeFile('./hydra_json/messages.json', JSON.stringify(messages), function(err) {
    if (err) console.error(err);
  });
}

function _writeChannels() {
  fs.writeFile('./hydra_json/channels.json', JSON.stringify(channels), function(err) {
    if (err) console.error(err);
  });
}