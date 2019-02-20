const Discord = require('discord.js')

module.exports.run = async (bot,message,args)  =>{
  const cooldown = new Set();
  
    if (cooldown.has(message.author.id && message.guild.id)) {
        return message.channel.send(`Cette commande a un temps de recharge de 5 **Minutes**`);
    }

    cooldown.add(message.author.id && message.guild.id);
    setTimeout(() => {
        cooldown.delete(message.author.id && message.guild.id);
    }, 300000);

message.channel.send("Here My Invite : https://discordapp.com/oauth2/authorize?client_id=512209185581301760&scope=bot&permissions=1946545215")
}

module.exports.help = {
    name: "invite"
  }
