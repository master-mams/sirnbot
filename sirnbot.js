process.setMaxListeners(Infinity)
const Discord = require('discord.js')
const commands  = new Discord.Collection()
const bot = new Discord.Client()

const fs = require('fs')
const config = require("./config.json")

const Youtube = require("simple-youtube-api");
const ytdl = require("ytdl-core");
const youtube = new Youtube("AIzaSyAN-kK9twI3PvjnPrxvpHoZvgqIsn2Aq9A")
const queue = new Map();

const prefix = config.prefix

bot.on('ready', () => {
    console.log(`ℂ𝕠𝕟𝕟𝕖𝕔𝕥 𝕋𝕠 𝕊𝕚𝕣𝕟𝔹𝕠𝕥`)
    bot.user.setActivity('=help', { type: 'WATCHING' })
})

  bot.on('message',async message=> {
    if(message.author.bot) return;
    if(message.channel.type == "dm")return;
    if(message.author.bot) return;
    if(!message.guild.member(bot.user).hasPermission("SEND_MESSAGES"))return
    
    var args   = message.content.split(" ").slice(1)   

    if(message.content.startsWith(prefix)){ 
        var commandfile = commands.get(message.content.split(" ")[0].slice(prefix.length))
    if(commandfile) commandfile.run(bot,message,args).catch(er=>console.error(er))
    }

    })

  fs.readdir("./commands/",(err, folders) => {
    const color = require('chalk')
    let number = 0
    if(err) console.log(err) ;
    folders.forEach(folder=>{
      fs.readdir(`./commands/${folder}`,(err, files) => {
        console.log(color.blue(`~~ ${folder} ~~`))
        const jsfile = files.filter(f => f.split(".").pop() == "js"||"")
        jsfile.forEach(file=>{
          console.log(color.green(color.magenta(`[${++number}]`)+`${file} a bien été chargée ! `))
          const props = require(`./commands/${folder}/${file}`)
          commands.set(props.help.name , props);
          commands.set(props.help.alias, props)
        })
      })
    })
  })


 bot.on("message", async message => {

      var args = message.content.substring(prefix.length).split(" ");
      if (!message.content.startsWith(prefix)) return;
    var searchString = args.slice(1).join(' ');
      var url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
      var serverQueue = queue.get(message.guild.id);
      switch (args[0].toLowerCase()) {
        case "play" || "p":
      var voiceChannel = message.member.voiceChannel;
          if (!voiceChannel) return message.channel.send('Vous devez être dans un salon vocal pour écouter de la musique.');
          var permissions = voiceChannel.permissionsFor(message.client.user);
          if (!permissions.has('CONNECT')) {
              return message.channel.send('Je ne peut pas me connecter au salon vocal.');
          }
          if (!permissions.has('SPEAK')) {
              return message.channel.send('Je n\'ai pas les permissions de parler dans ce salon vocal.');
          }
        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
              var playlist = await youtube.getPlaylist(url);
              var videos = await playlist.getVideos();
              for (const video of Object.values(videos)) {
                  var video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
                  await handleVideo(video2, message, voiceChannel, true); // eslint-disable-line no-await-in-loop
              }
              return message.channel.send(`✅ Playlist: **${playlist.title}** a été ajoutée à la queue.`);
          } else {
              try {
                  var video = await youtube.getVideo(url);
              } catch (error) {
                  try {
                      var videos = await youtube.searchVideos(searchString, 10);
                      var index = 0;
                      message.channel.send(`
  __**Sélection de la musique:**__
  ${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
  Veuillez fournir un nombre de 1 à 10 pour sélectionner votre musique.
                      `);
                      // eslint-disable-next-line max-depth
                      try {
                          var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, {
                              maxMatches: 1,
                              time: 10000,
                              errors: ['time']
                          });
                      } catch (err) {
                          console.error(err);
                          return message.channel.send('Valeur entrée invalide ou inexistante, arrêt du processus de recherche.');
                      }
                      var videoIndex = parseInt(response.first().content);
                      var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                  } catch (err) {
                      console.error(err);
                      return message.channel.send('🆘 Je n\'ai pas de résultats pour cette recherche.');
                  }
              }
              return handleVideo(video, message, voiceChannel);
          }
          break;
        case "skip":
          if (!message.member.voiceChannel) return message.channel.send('Vous devez être dans un salon vocal pour écouter de la musique.');
          if (!serverQueue) return message.channel.send('Il n\'y a pas de musique que je peut passer pour vous.');
          serverQueue.connection.dispatcher.end('La commande skip a été utilisée.');
          return undefined;
          break;
        case "stop":
          if (!message.member.voiceChannel) return message.channel.send('Vous devez être dans un salon vocal pour écouter de la musique.');
          if (!serverQueue) return message.channel.send('Il n\'y a pas de musique que je peut stopper pour vous.');
          serverQueue.songs = [];
          serverQueue.connection.dispatcher.end('La commande stop a été utilisée.');
          return undefined;
  break;      
        case "volume":
if(!message.member.hasPermission("MANAGE_CHANNELS")){ return message.channel.send(`<:WrongMark:504768105130622986> **${message.author.username}**, tu n'as pas les bonnes permissions.`);}
          if (!message.member.voiceChannel) return message.channel.send('Vous devez être dans un salon vocal pour écouter de la musique.');
          if (!serverQueue) return message.channel.send('Il n\'y a pas de musique jouée actuellement.');
          if (!args[1]) return message.channel.send(`Le volume actuel est : **${serverQueue.volume}**`);
          serverQueue.volume = args[1];
          serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
          return message.channel.send(`Le volume a été réglé à : **${args[1]}**`);
  break;
        case "music":
          if (!serverQueue) return message.channel.send('Il n\'y a pas de musique jouée actuellement.');
      
          var volval;
          if (serverQueue.volume == 1) {
              volval = `○──── :mute:⠀`
          }if (serverQueue.volume == 2) {
              volval = `─○─── :speaker:⠀`
          }if (serverQueue.volume == 3) {
              volval = `──○── :sound:⠀`
          }if (serverQueue.volume == 4) {
              volval = `───○─ :sound:⠀`
          }if (serverQueue.volume == 5) {
              volval = `────○ :loud_sound:⠀`
          }
  var NowEmbed = new Discord.RichEmbed().setColor('#ffffff')
  .addField(`==========================================================`,`
  ɴᴏᴡ ᴘʟᴀʏɪɴɢ: **${serverQueue.songs[0].title}**
  :white_circle:─────────────────────────────────────────── 
  ◄◄⠀▐▐ ⠀►►⠀⠀${serverQueue.volume}　${volval}    　　 :gear: ❐ ⊏⊐ 
  ========================================================= `)
  .setFooter(message.author.tag, message.author.displayAvatarURL)
  .addField("Invite moi sur ton serveur !","La commande est b!invite", true)
  .addField("Invite du serveur support","https://discord.gg/zBMJEA6", true);
  message.channel.send(NowEmbed);return
  break;
  
        case "queue":
          if (!serverQueue) return message.channel.send('Il n\'y a pas de musique jouée actuellement.');
      let queueembed = new Discord.RichEmbed()
      .setAuthor("Queue :")
      .setDescription(serverQueue.songs.map(song => `**-** ${song.title}`).join('\n'))
      .setFooter(`Joué actuellement : ${serverQueue.songs[0].title}`)
      return message.channel.send(queueembed);
  break;
        case "pause":
          if (serverQueue && serverQueue.playing) {
              serverQueue.playing = false;
              serverQueue.connection.dispatcher.pause();
              return message.channel.send('⏸ La musique a été mise en pause.');
          }
          return message.channel.send('Il n\'y a pas de musique jouée actuellement.');
  break;
        case "resume":
          if (serverQueue && !serverQueue.playing) {
              serverQueue.playing = true;
              serverQueue.connection.dispatcher.resume();
              return message.channel.send('▶ La musique a été relancée.');
          }
          return message.channel.send('Il n\'y a pas de musique jouée actuellement.');
      
  
      return undefined;
  break;
  
  }
  async function handleVideo(video, message, voiceChannel, playlist = false) {
      var serverQueue = queue.get(message.guild.id);
      console.log(video);
      var song = {
          id: video.id,
          title: video.title,
          url: `https://www.youtube.com/watch?v=${video.id}`
      };
      if (!serverQueue) {
          var queueConstruct = {
              textChannel: message.channel,
              voiceChannel: voiceChannel,
              connection: null,
              songs: [],
              volume: 5,
              playing: true
          };
          queue.set(message.guild.id, queueConstruct);
  
          queueConstruct.songs.push(song);
  
          try {
              var connection = await voiceChannel.join();
              queueConstruct.connection = connection;
              play(message.guild, queueConstruct.songs[0]);
          } catch (error) {
              console.error(`Je ne peut pas rejoindre le channel vocal : ${error}`);
              queue.delete(message.guild.id);
              return message.channel.send(`Je ne peut pas rejoindre le channel vocal : ${error}`);
          }
      } else {
          serverQueue.songs.push(song);
          console.log(serverQueue.songs);
          if (playlist) return undefined;
          else return message.channel.send(`✅ **${song.title}** a été ajouté à la queue.`);
      }
      return undefined;
  }
    function play(guild, song) {
      var serverQueue = queue.get(guild.id);
  
      if (!song) {
          serverQueue.voiceChannel.leave();
          queue.delete(guild.id);
          return;
      }
      console.log(serverQueue.songs);
  
      const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
          .on('end', reason => {
        message.channel.send('``La musique est terminée.``');
              if (reason === 'Stream is not generating quickly enough.') console.log('Fin de la musique.');
              else console.log(reason);
              serverQueue.songs.shift();
              play(guild, serverQueue.songs[0]);
          })
          .on('error', error => console.error(error));
      dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  
      serverQueue.textChannel.send(`🎶 Début de la musique : **${song.title}**`);
  }
  
  });


bot.on('raw', event => {
  if (event.t === 'MESSAGE_REACTION_ADD' || event.t == "MESSAGE_REACTION_REMOVE"){
      
      let initialMessage = `**Cliquez sur les réactions pour obtenir ou supprimer un rôle.**`;
      let channel = bot.channels.get(event.d.channel_id);
      let message = channel.fetchMessage(event.d.message_id).then(msg=> {
      let user = msg.guild.members.get(event.d.user_id);
      
      if (msg.author.id == bot.user.id && msg.content != initialMessage){
     
          var re = `\\*\\*"(.+)?(?="\\*\\*)`;
          var role = msg.content.match(re)[1];
      
          if (user.id != bot.user.id){
              var roleObj = msg.guild.roles.find(r => r.name === role);
              var memberObj = msg.guild.members.get(user.id);
              
              if (event.t === "MESSAGE_REACTION_ADD"){
                  memberObj.addRole(roleObj)
              } else {
                  memberObj.removeRole(roleObj);
}}}})}   
});

bot.login("NTQ3Mzk2MzA0NTc4MjgxNTAy.D09BrA.esV2f1D9tudtEPukhJ3niAFhuQw")
