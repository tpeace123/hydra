module.exports = {
  status: status,
  enable: enable,
  disable: disable,
  enableJoin: enableJoin,
  disableJoin: disableJoin,
  enableLeave: enableLeave,
  disableLeave: disableLeave,
  setJoinChannel: setJoinChannel,
  setLeaveChannel: setLeaveChannel,
  getJoinEnable: getJoinEnable,
  getJoinChannel: getJoinChannel,
  getLeaveEnable: getLeaveEnable,
  getLeaveChannel: getLeaveChannel
}

var fs = require('fs');

var joinEnabled = require('./hydra_json/joinEnabled.json');
var leaveEnabled = require('./hydra_json/leaveEnabled.json');
var joinChannel = require('./hydra_json/joinChannel.json');
var leaveChannel = require('./hydra_json/leaveChannel.json');

var getPrefix = require('./prefix.js').getPrefix;

function status(message) {
  if (message && message.guild && message.guild.id) {
    return [getJoinEnable(message.guild), getJoinChannel(message.guild), getLeaveEnable(message.guild), getLeaveChannel(message.guild)];
  }
  else message.reply("no guild id found.");
}

function enable(message) {
  if (message && message.guild && message.guild.id) {
    joinEnabled[message.guild.id] = true;
    leaveEnabled[message.guild.id] = true;
    _writeJoinEnable();
    _writeLeaveEnable();
  }
  else message.reply("no guild id found.");
}

function disable(message) {
  if (message && message.guild && message.guild.id) {
    delete joinEnabled[message.guild.id];
    delete leaveEnabled[message.guild.id];
    delete joinChannel[message.guild.id];
    delete leaveChannel[message.guild.id];
    _writeJoinEnable();
    _writeLeaveEnable();
    _writeJoinChannel();
    _writeLeaveChannel();
  }
  else message.reply("no guild id found.");
}

function enableJoin(message) {
  if (message && message.guild && message.guild.id) {
    joinEnabled[message.guild.id] = true;
    _writeJoinChannel();
  }
  else message.reply("no guild id found.");
}

function disableJoin(message) {
  if (message && message.guild && message.guild.id) {
    delete joinEnabled[message.guild.id];
    delete joinChannel[message.guild.id];
    _writeJoinEnable();
    _writeJoinChannel();
  }
  else message.reply("no guild id found.");
}

function enableLeave(message) {
  if (message && message.guild && message.guild.id) {
    leaveEnabled[message.guild.id] = true;
    _writeLeaveEnable();
  }
  else message.reply("no guild id found.");
}

function disableLeave(message) {
  if (message && message.guild && message.guild.id) {
    delete leaveEnabled[message.guild.id];
    delete leaveChannel[message.guild.id];
    _writeLeaveEnable();
    _writeLeaveChannel();
  }
  else message.reply("no guild id found.");
}

function setJoinChannel(message, channel) {
  if (message && message.guild && message.guild.id) {
    if (channel) {
      joinChannel[message.guild.id] = channel;
      _writeJoinChannel();
      enableJoin(message);
    }
    else message.reply(`Usage: \`${getPrefix()}welcome join set <channel>\``);
  }
  else message.reply("no guild id found.");
}

function setLeaveChannel(message, channel) {
  if (message && message.guild && message.guild.id) {
    if (channel) {
      leaveChannel[message.guild.id] = channel;
      _writeLeaveChannel();
      enableLeave(message);
    }
    else message.reply(`Usage: \`${getPrefix()}welcome leave set <channel>\``);
  }
  else message.reply("no guild id found.");
}

function getJoinEnable(guild) {
  if (guild && guild.id) {
    if (joinEnabled[guild.id]) return joinEnabled[guild.id];
    else return false;
  }
  else return false;
}

function getJoinChannel(guild) {
  if (guild && guild.id) {
    return joinChannel[guild.id];
  }
  else return;
}

function getLeaveEnable(guild) {
  if (guild && guild.id) {
    if (leaveEnabled[guild.id]) return leaveEnabled[guild.id];
    else return false;
  }
  else return false;
}

function getLeaveChannel(guild) {
  if (guild && guild.id) {
    return leaveChannel[guild.id];
  }
  else return;
}

function _writeJoinEnable() {
  fs.writeFile('./hydra_json/joinEnabled.json', JSON.stringify(joinEnabled), function(err) {
    if (err) console.error(err);
  });
}

function _writeLeaveEnable() {
  fs.writeFile('./hydra_json/leaveEnabled.json', JSON.stringify(leaveEnabled), function(err) {
    if (err) console.error(err);
  });
}

function _writeLeaveChannel() {
  fs.writeFile('./hydra_json/leaveChannel.json', JSON.stringify(leaveChannel), function(err) {
    if (err) console.error(err);
  });
}

function _writeJoinChannel() {
  fs.writeFile('./hydra_json/joinChannel.json', JSON.stringify(joinChannel), function(err) {
    if (err) console.error(err);
  });
}