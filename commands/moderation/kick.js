const Discord = require('discord.js')
module.exports.run = async (bot,message,args)  =>{
const member = message.mentions.members.first();
const raison = !args[1] ? "Aucune raison" : args[1]
if(!message.member.hasPermission("KICK_MEMBERS")) {
    return message.channel.send(`<:WrongMark:504768105130622986> **${message.author.username}**, tu n'as pas les bonnes permissions.`)
}
if(!member) {
    let embed = new Discord.RichEmbed()
    .setDescription(`**Description :** Kick a user with an optional reason.
    **Reminder: ** Hooks such as [] or <> are not to be used when using commands.`)
    .addField('Use', '_kick @user [raison]', true)
    .addField('Example','_kick @user T\'es inutile frère.', true)
    .setThumbnail(bot.user.avatarURL)
    .setColor('GREEN')
    .setFooter(`${message.author.username} • _kick @user`, message.author.displayAvatarURL)
    .setTimestamp()
    return message.channel.send(embed);
}

if(member.hasPermission('KICK_MEMBERS')) return message.channel.send(`**${message.author.username}**, i can't kick this user.`)
if(!raison) {
    var r= "Aucune raison"
}else if(raison) {
    var r = raison
}
member.kick(r)
message.channel.send("<:CheckMark:504768105101393940> "+member+" kick for : "+r+".")
}

module.exports.help = {
    name :'kick'
}
