var config = require('./hydrauth.json');
var Discord = require('discord.js');
var client = new Discord.Client();
var commands = require('./slashCommands.js');

client.login(config.token);

client.on('ready', async function() {
  console.log('Ready');
  client.api.applications(client.user.id).commands.post({
    data: {
      name: "hmw",
      description: "Ask for help.",
      options: [
        {
          name: "help",
          description: "The help you need.",
          type: 3,
          required: true
        }
      ]
    }
  });
  client.api.applications(client.user.id).commands.post({
    data: {
      name: "policy",
      description: "Receive the privacy policy."
    }
  });
  client.api.applications(client.user.id).commands.post({
    data: {
      name: "prefix",
      description: "Receive the prefix for your server."
    }
  });
  
  // client.api.applications(client.user.id).guilds('788546880246251551').commands.post({
  //   data: {
  //     name: "prefix",
  //     description: "Receive the prefix for your server.",
  //   }
  // });
  
  // let asd = await client.api.applications(client.user.id)/*.guilds('788546880246251551')*/.commands.get();
  // for (let i in asd) {
  //   await client.api.applications(client.user.id)/*.guilds('788546880246251551')*/.commands(asd[i].id).delete();
  // }
  // console.log(await client.api.applications(client.user.id)/*.guilds('788546880246251551')*/.commands.get());
});

client.ws.on('INTERACTION_CREATE', _interaction);

async function _interaction(inter) {
  // console.log(inter);
  if (inter.type !== 2) return;
  if (!commands.hasOwnProperty(inter.data.name)) return;
  // console.log(inter.data.options);
  // inter is an Interaction object https://discord.dev/interactions/slash-commands#interaction
  // client.api.interactions(inter.id, inter.token).callback.post({data: {type: 4, data: {content: 'Pong!'}}});
  if (inter.data.name === "policy") {
    client.api.interactions(inter.id, inter.token).callback.post({
      data: {
        type: 4,
        data: {
          content: "",
          embeds: await commands[inter.data.name](inter.data.options, client, inter.member)
        }
      }
    });
  }
  else {
    client.api.interactions(inter.id, inter.token).callback.post({
      data: {
        type: 4,
        data: {
          content: await commands[inter.data.name](inter.data.options, client, inter.member, inter.guild_id)
        }
      }
    });
  }
}