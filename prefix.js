module.exports = {
  getPrefix: getPrefix,
  setPrefix: setPrefix,
  resetPrefix: resetPrefix
}

var fs = require('fs');

var defaultPrefix = require('./hydrauth.json').prefix;
var prefixes = require('./hydra_json/prefixes.json');

function getPrefix(message) {
  if (message && message.guild && prefixes[message.guild.id]) return prefixes[message.guild.id];
  else return defaultPrefix;
}

function setPrefix(message, prefix) {
  if (message && message.guild && message.guild.id) {
    prefixes[message.guild.id] = prefix;
    fs.writeFile('./hydra_json/prefixes.json', JSON.stringify(prefixes), function(err) {
      if (err) console.error(err);
    });
  }
  else message.reply('No guild id found');
}

function resetPrefix(message) {
  delete prefixes[message.guild.id];
  fs.writeFile('./hydra_json/prefixes.json', JSON.stringify(prefixes), function(err) {
    if (err) console.error(err);
  });
}