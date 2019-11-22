module.exports = {
  getChannel: getChannel,
  setChannel: setChannel,
  removeChannel: removeChannel,
  disableChannel: disableChannel,
  getEnable: getEnable
}

var fs = require('fs');

var defaultChannel = require('./hydrauth.json').welcome_channel;
var channels = require('./hydra_json/welcomes.json');
var enabled = require('./hydra_json/enabled.json')

function getChannel(guild) {
  if (guild) {
    if (channels[guild.id]) return channels[guild.id];
    else return defaultChannel;
  }
  else return defaultChannel;
}

function setChannel(message, channel) {
  if (message && message.guild && message.guild.id) {
    enabled[message.guild.id] = true;
    channels[message.guild.id] = channel;
    fs.writeFile('./hydra_json/enabled.json', JSON.stringify(enabled), function(err) {
      if (err) console.error(err);
    });
    fs.writeFile('./hydra_json/welcomes.json', JSON.stringify(channels), function(err) {
      if (err) console.error(err);
    });
  }
  else message.reply("No guild id found");
}

function disableChannel(message) {
  if (message && message.guild && message.guild.id) {
    enabled[message.guild.id] = "false";
    fs.writeFile('./hydra_json/enabled.json', JSON.stringify(enabled), function(err) {
      if (err) console.error(err);
    });
    message.reply("welcome messages have now been disabled for this guild.");
  }
  else message.reply("No guild id found.");
}

function removeChannel(message) {
  delete channels[message.guild.id];
  delete enabled[message.guild.id];
  fs.writeFile('./hydra_json/welcomes.json', JSON.stringify(channels), function(err) {
    if (err) console.error(err);
  });
  fs.writeFile('./hydra_json/enabled.json', JSON.stringify(enabled), function(err) {
    if (err) console.error(err);
  });
  message.reply(`Welcome Message Enabled: \`${getEnable(message.guild)}\`\nWelcome Channel: \`${getChannel(message.guild)}\``);
}

function getEnable(guild) {
  if (guild && enabled[guild.id]) return enabled[guild.id];
  else return "true";
}