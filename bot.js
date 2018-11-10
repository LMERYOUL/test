const Discord = require('discord.js');
const { Client, Util } = require('discord.js');
const client = new Discord.Client();
const { PREFIX, GOOGLE_API_KEY } = require('./config');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');

const youtube = new YouTube(GOOGLE_API_KEY);

const queue = new Map();

// MUSIC-BOT BY LMERYOUL \\ 


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
client.user.setGame(`!!help`,"https://www.twitch.tv/lmeryoul")
  console.log('MUSIC-BOT BY LMERYOUL')
  console.log('')
  console.log('+[-----------------------------------------------------------------]+')
  console.log(`[Start] ${new Date()}`);
  console.log('+[-----------------------------------------------------------------]+')
  console.log('')
  console.log('+[------------------------------------]+');
  console.log(`Logged in as * [ " ${client.user.username} " ]`);
  console.log('')
  console.log('Informations :')
  console.log('')
  console.log(`servers! [ " ${client.guilds.size} " ]`);
  console.log(`Users! [ " ${client.users.size} " ]`);
  console.log(`channels! [ " ${client.channels.size} " ]`);
  console.log('+[------------------------------------]+')
  console.log('')
  console.log('+[------------]+')
  console.log(' Bot Is Online')
  console.log('+[------------]+')
  console.log('')
  console.log('')
});


const developers = ["317418087714390016",""]
const adminprefix = "!";
client.on('message', message => {
    var argresult = message.content.split(` `).slice(1).join(' ');
      if (!developers.includes(message.author.id)) return;
      
  if (message.content.startsWith(adminprefix + 'ply')) {
    client.user.setGame(argresult);
      message.channel.send(`**Changing The Playing To ..${argresult}** `)
  } else 
     if (message.content === (adminprefix + "leave")) {
    message.guild.leave();        
  } else  
  if (message.content.startsWith(adminprefix + 'wt')) {
  client.user.setActivity(argresult, {type:'WATCHING'});
      message.channel.send(`Changing The Watching To ..**${argresult}** `)
  } else 
  if (message.content.startsWith(adminprefix + 'ls')) {
  client.user.setActivity(argresult , {type:'LISTENING'});
      message.channel.send(`**Changing The Listening To ..**${argresult}** `)
  } else 
  if (message.content.startsWith(adminprefix + 'st')) {
    client.user.setGame(argresult, "https://www.twitch.tv/lmeryoul");
      message.channel.send(`**Changing The Streaming To ..**${argresult}** `)
  }
  if (message.content.startsWith(adminprefix + 'setname')) {
   client.user.setUsername(argresult).then
      message.channel.send(`Changing The Name To ..**${argresult}** `)
} else
if (message.content.startsWith(adminprefix + 'setavatar')) {
  client.user.setAvatar(argresult);
    message.channel.send(`Changing The Avatar To :**${argresult}** `);
}
});



client.on('warn', console.warn);

client.on('error', console.error);

client.on('ready', () => console.log('3iiw'));


client.on('message', async msg => { // eslint-disable-line
	if (msg.author.bot) return undefined;
	if (!msg.content.startsWith(PREFIX)) return undefined;

	const args = msg.content.split(' ');
	const searchString = args.slice(1).join(' ');
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = queue.get(msg.guild.id);

	let command = msg.content.toLowerCase().split(" ")[0];
	command = command.slice(PREFIX.length)

	if (command === `play`) {
		const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) return msg.channel.send('You need to join voice channel first :x:');
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			return msg.channel.send('I can not connect in this audio channel, make sure I have the roles !');
		}
		if (!permissions.has('SPEAK')) {
			return msg.channel.send('I can not speak in this audio channel, make sure I have the roles !');
		}
		if (!permissions.has('EMBED_LINKS')) {
			return msg.channel.sendMessage("**I dont have permission `EMBED LINKS`**")
		}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
			return msg.channel.send(` **${playlist.title}** Added to list!`);
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 5);
					let index = 0;
					const embed1 = new Discord.RichEmbed()
					.setAuthor("LMEJDOUB-BOT", "https://image.ibb.co/iVVW8A/photo.jpg")
		            .setColor('RANDOM')
					.setDescription(`**Choose number ** :
${videos.map(video2 => `[**${++index} **] \`${video2.title}\``).join('\n')}`)
					.setFooter('')
					msg.channel.sendEmbed(embed1).then(message =>{message.delete(20000)})
					
					// eslint-disable-next-line max-depth
					try {
						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
							maxMatches: 1,
							time: 10000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						return msg.channel.send(' The number is not specified to play the song.');
					}
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return msg.channel.send(':X: No result.');
				}
			}
			return handleVideo(video, msg, voiceChannel);
		}
	} else if (command === `skip`) {
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing that I could skip for you.');
		serverQueue.connection.dispatcher.end('Skip command has been used!');
		return undefined;
	} else if (command === `stfu`) {
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing that I could stop for you.');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Stop command has been used!');
		return undefined;
	} else if (command === `vol`) {
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
		if (!args[1]) return msg.channel.send(`:loud_sound: Current volume is **${serverQueue.volume}**`);
		serverQueue.volume = args[1];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
		return msg.channel.send(`:speaker: Sound changed to **${args[1]}**`);
	} else if (command === `np`) {
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
		const embedNP = new Discord.RichEmbed()
		.setAuthor("LMEJDOUB-BOT", "https://image.ibb.co/iVVW8A/photo.jpg")
		.setColor('RANDOM')
		.setDescription(`:notes: Now playing: **${serverQueue.songs[0].title}**`)
		return msg.channel.sendEmbed(embedNP);
	} else if (command === `queue`) {
		
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
		let index = 0;
		const embedqu = new Discord.RichEmbed()
        .setAuthor("LMEJDOUB-BOT", "https://image.ibb.co/iVVW8A/photo.jpg")
		.setColor('RANDOM')	
		.setDescription(`**Songs Queue**
${serverQueue.songs.map(song => `**${++index} -** ${song.title}`).join('\n')}
**Now playing** ${serverQueue.songs[0].title}`)
		return msg.channel.sendEmbed(embedqu);
	} else if (command === `pause`) {
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return msg.channel.send(':pause_button:Music paused!');
		}
		return msg.channel.send('There is nothing playing.');
	} else if (command === "resume") {
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return msg.channel.send('Music resumed !');
		}
		return msg.channel.send('There is nothing playing.');
	}

	return undefined;
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	console.log(video);
	
//	console.log('yao: ' + Util.escapeMarkdown(video.thumbnailUrl));
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(msg.guild.id);
			return msg.channel.send(`I could not join the voice channel: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return undefined;
		else return msg.channel.send(` **${song.title}** Added to list!`);
	}
	return undefined;
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

	serverQueue.textChannel.send(`:headphones: Now playing: **${song.title}**`);
}



client.on("message", message => {
	if (message.content === "!!help") {
	message.channel.send('`**Hi my commands in your DMs !**')
	 const embed = new Discord.RichEmbed()
	     .setColor('BLACK')
		 .setFooter('MusicBot By LMERYOUL', 'https://image.ibb.co/iVVW8A/photo.jpg')
		 .setThumbnail(message.author.avatarURL)
		 .setDescription(` 

┏╋━━━◥◣◆◢◤━━━╋┓
 **Prefix : !!** 
┗╋━━━◥◣◆◢◤━━━╋┛

**!!play**             |Play a song with the given name or url

**!!stfu**             |Disconnect the bot from the voice channel if is in

**!!pause**            |Pause the currently music playing 

**!!resume**           |Resume paused music

**!!skip**             |Skip the currently playing song

**!!vol**              |Change the current volume

**!!np**               |Shows what song the bot is currently playing

**!!queue**            |View the queue

**[FACEBOOK](https://www.facebook.com/LMERYOUL.29)** & **[INVITE ME](https://discordapp.com/oauth2/authorize?client_id=488507197278650369&scope=bot&permissions=2146958847)**
   `)
   message.author.send(embed);
  }  


//____________________________________________________send messages and reply__________________________________________
if (message.content.startsWith("!!stats")) {
    message.channel.send(`
	:regional_indicator_s: **Servers:** ${client.guilds.size}
	:regional_indicator_u: **Users:** ${client.users.size}
	:regional_indicator_c: **Channels:** ${client.channels.size}`);
}


if (message.content.startsWith("/jma3")) {
	message.channel.send(`**you do not have permission to use this ADMINISTRATOR**`)
}	 

if (message.content.startsWith("!!ping")) {
    message.channel.send('**Your ping is `' + Math.round(client.ping) + ' ms`**') 
}

//___________________________________________________________Your Avatar_______________________________________________

if (message.content.startsWith("!!avatar")) {
	 const embed = new Discord.RichEmbed()  
		  .setColor('RANDOM')
		  .addField(`The Avatar Of`, message.author.tag)
		  .setImage(message.author.avatarURL)
		  .setFooter("LMEJDOUB-BOT", "https://image.ibb.co/iVVW8A/photo.jpg")
		  
   message.channel.send(embed);
  }  


//____________________________________________________MEMBERS INFO _________________________________________________


  if (message.content.startsWith("!!info")) {
	    const embed = new Discord.RichEmbed()
		 .setColor('RANDOM')
		 .addField("Server Name", message.guild.name)
		 .addField("Created On", message.author.createdAt)
		 .addField("You Joined", message.member.joinedAt)
		 .setThumbnail(message.author.avatarURL)
		 
  message.channel.send(embed);
 }   


//_______________________________________________________________________________________________














//_________________________________________________________Message For All______________________________________________

// ADMBOT BY LMERYOUL \\

const prefix = "!"



// ADMBOT BY LMERYOUL \\

	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;
    if(message.content.startsWith('!!sm')) {
    if(!message.channel.guild) return message.channel.send('**This is only for management**').then(m => m.delete(5000));
    if(!message.member.hasPermission('ADMINISTRATOR')) return      message.channel.send('**Unfortunately you do not have permission to use this** `ADMINISTRATOR`' );
    let args = message.content.split(" ").join(" ").slice(2 + prefix.length);
    let copy = "S Bot";
    let request = `Requested By ${message.author.username}`;
    if (!args) return message.reply('**You must write something to send a broadcast**');message.channel.send(`**Are you sure you want to send? \Broadcast content:** \` ${args}\``).then(msg => {
    msg.react('✅')
    .then(() => msg.react('❌'))
    .then(() =>msg.react('✅'))
 
    let reaction1Filter = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id;
    let reaction2Filter = (reaction, user) => reaction.emoji.name === '❌' && user.id === message.author.id;
          let reaction1 = msg.createReactionCollector(reaction1Filter, { time: 12000 });
    let reaction2 = msg.createReactionCollector(reaction2Filter, { time: 12000 });
    reaction1.on("collect", r => {
    message.channel.send(`**☑ |   The message has been sent to ${message.guild.members.size} members**`).then(m => m.delete(5000));
    message.guild.members.forEach(m => {
    var bc = new
    Discord.RichEmbed()
        .setAuthor("LMEJDOUB-BOT", "https://image.ibb.co/iVVW8A/photo.jpg")
		.setColor('BLACK')
        .addField(':envelope: Message', args)
        .setImage("")
        .setThumbnail(message.author.avatarURL)
        .addBlankField(true)
		m.send({ embed: bc })
		msg.delete();
		})
		})
		reaction2.on("collect", r => {
		message.channel.send(`**Message Canceled.**`).then(m => m.delete(5000));
		msg.delete();
		})
		})
		}
//______________________________________________________Welcome Messages___________________________________________________________
client.on("ready", () => {
	console.log("I am ready!");
  });

  client.on('guildMemberAdd', member => {
  // hada kisfet message l nas li dkhlo jdad
  const embed = new Discord.RichEmbed()
	.setTitle("**Invite Your Friends**")
	.setAuthor("LMEJDOUB-BOT", "https://image.ibb.co/iVVW8A/photo.jpg")
	/*
	 * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
	 */
	.setColor('RANDOM')
	.setDescription("Mar7ba Bik F Gamers Familly")
	.setFooter("Gamers Familly", "https://image.ibb.co/iVVW8A/photo.jpg")
	.setImage("https://preview.ibb.co/cro4vq/welcome.png")
	.setThumbnail(message.author.avatarURL)
	/* https://preview.ibb.co/cro4vq/welcome.png
	 * Takes a Date object, defaults to current date.
	 */
	.setTimestamp()
	.setURL("https://discord.gg/Nf8RH2F")
	member.user.send({embed});
  
  });
  
  client.on('guildMemberAdd', member => {
   // Hada liko7 message f acceuil b smia dyal member li dkhel
	let embed = new Discord.RichEmbed()
	  .setColor('RANDOM')
	  .setTitle("WelcomeBot")
	  .setDescription(`**Hey** ${member}, **Mer7ba Bik M3ana F Gamers Familly**`)
	  .setImage('https://preview.ibb.co/cro4vq/welcome.png');
	  member.guild.channels.get('477216516547280910').send({embed});
  });
  
   
  client.on('guildMemberRemove', member => {
  member.guild.channels.get('477216516547280910').send('**' + member.user.username + '**, Good Bye') // The first part gets the channel, the seconds sends a messages in the respective channel.
  });
//______________________________________________________________________________________________________________



























});
client.login("NDg4NTA3MTk3Mjc4NjUwMzY5.Dse3Vw.gLIIrvlqgp8jidxYzt7GnPSgo9c");
