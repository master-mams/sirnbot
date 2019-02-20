const Discord = require('discord.js')!

module.exports.run = async(bot, message, args) => {
    if(!message.member.hasPermission('MANAGE_CHANNELS')){
        return message.channel.send(`:x: **${message.author.username}**, yo can't do.`)
     }
     message.channel.setName(message.content.substr(13) || "None");
     message.channel.send(`<:CheckMark:504768105101393940> The name of this channel has been edited by **${message.content.substr(13) || "none"}**!`)
}

module.exports.help ={
    name : 'name'
}
