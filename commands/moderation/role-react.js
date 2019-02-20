const Discord = require('discord.js')

let initialMessage = `**Cliquez sur les réactions pour obtenir ou supprimer un rôle.**`;
var roles = [];
var reactions = [];
//const roles = ["role1", "role2", "role3", "role4"];
//const reactions = ["1⃣", "2⃣", "3⃣", "4⃣"];

function generateMessages(){
  var messages = [];
  messages.push(initialMessage);
  for (let role of roles) messages.push(`Cliquez sur la réaction pour récupérer le rôle **"${role}"**.`);
  return messages;
}

module.exports.run = async (bot, message, args, config) => {
  if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('Désolé, vous n\'avez pas la permission d\'effectuer cette commande');

  roles = [];
  reactions = [];
  if(args[0]) {if(message.guild.roles.find(x => x.name === args[0])) {roles.push(args[0]);reactions.push("1⃣")} else {message.channel.send(`Le rôle ${args[0]} n'existe pas.`);return}} else {message.channel.send("Veuillez spécifier au moins un rôle."); return}
  if(args[1]) {if(message.guild.roles.find(x => x.name === args[1])) {roles.push(args[1]);reactions.push("2⃣")} else {message.channel.send(`Le rôle ${args[1]} n'existe pas.`);return}}
  if(args[2]) {if(message.guild.roles.find(x => x.name === args[2])) {roles.push(args[2]);reactions.push("3⃣")} else {message.channel.send(`Le rôle ${args[2]} n'existe pas.`);return}}
  if(args[3]) {if(message.guild.roles.find(x => x.name === args[3])) {roles.push(args[3]);reactions.push("4⃣")} else {message.channel.send(`Le rôle ${args[3]} n'existe pas.`);return}}
  if(args[4]) {if(message.guild.roles.find(x => x.name === args[4])) {roles.push(args[4]);reactions.push("5⃣")} else {message.channel.send(`Le rôle ${args[4]} n'existe pas.`);return}}
  if(args[5]) {if(message.guild.roles.find(x => x.name === args[5])) {roles.push(args[5]);reactions.push("6⃣")} else {message.channel.send(`Le rôle ${args[5]} n'existe pas.`);return}}
  if(args[6]) {if(message.guild.roles.find(x => x.name === args[6])) {roles.push(args[6]);reactions.push("7⃣")} else {message.channel.send(`Le rôle ${args[6]} n'existe pas.`);return}}
  if(args[7]) {if(message.guild.roles.find(x => x.name === args[7])) {roles.push(args[7]);reactions.push("8⃣")} else {message.channel.send(`Le rôle ${args[7]} n'existe pas.`);return}}
  if(args[8]) {message.channel.send("Vous ne pouvez pas ajouter plus de 8 rôles."); return}


  if (roles.length !== reactions.length) message.channel.send("[ERREUR] - Il n'y a pas autant de rôles que de réactions disponibles.");
    var toSend = generateMessages();
    let mappedArray = [[toSend[0], false], ...toSend.slice(1).map( (message, idx) => [message, reactions[idx]])];
    for (let mapObj of mappedArray){
        message.channel.send(mapObj[0]).then( sent => {
            if (mapObj[1]){
              sent.react(mapObj[1]);  
            }
        });
    
}}

module.exports.help = {
  name: "role_react",
}
