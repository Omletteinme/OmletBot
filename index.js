const Discord = require('discord.js');
const randomPuppy = require('random-puppy');
const ms = require("ms");
const arcadiaapi = require('arcadia-module');
const Canvas = require('canvas');
figlet = require("figlet"),
	util = require("util"),
	figletAsync = util.promisify(figlet);
const path = require('path');
const snekfetch = require("snekfetch");
const fs = require("fs");
const joke = require('one-liner-joke').getRandomJoke
const fsn = require('fs-nextra');
const { Command } = require('discord.js-commando');
const weather = require('weather-js');
const got = require('got');
const giveMeAJoke = require('discord-jokes');
const superagent = require('superagent');
var YQL = require('yql');
const fetch = require("node-fetch");
const Canvacord = require("canvacord");
var asciiFaces = require("cool-ascii-faces");
const { fonts } = require('figlet');
const oneLine = require('common-tags').oneLine;







const client = new Discord.Client();

const prefix = 'o!'

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync(`./commands/`).filter(file => file.endsWith('.js'));
for (const file of commandFiles){
  const command = require(`./commands/${file}`);

  client.commands.set(command.name, command);
}


client.once('ready', () => {
    console.log('This bot is online!!');
    client.user.setActivity('playing o!help');

    
});

client.on ('message', async message =>{
    if(!message.content.startsWith(prefix) || message.author.bot) return;


    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    



    if(command === `asciiface`){
      client.commands.get('asciiface').execute(message, args);
    }
  
    



    if(command === `ping`) {
  
      client.commands.get('ping').execute(message, args);
  
    }



    if(command === 'weather'){
      const query = args.join(" ");
      const { body } = await snekfetch
          .get('https://query.yahooapis.com/v1/public/yql')
          .query({
              q: `select * from weather.forecast where u='f' AND woeid in (select woeid from geo.places(1) where text="${query}")`, // eslint-disable-line max-len
              format: 'json'
          });
      if (!body.query.count) return message.say('Location Not Found.');
      const embed = new Discord.MessageEmbed()
          .setColor(0x00A2E8)
          .setAuthor(body.query.results.channel.title, 'https://i.imgur.com/2MT0ViC.png')
          .setURL(body.query.results.channel.link)
          .setTimestamp()
          .addField('City',
              body.query.results.channel.location.city, true)
          .addField('Country',
              body.query.results.channel.location.country, true)
          .addField('Region',
              body.query.results.channel.location.region, true)
          .addField('Condition',
              body.query.results.channel.item.condition.text, true)
          .addField('Temperature',
              `${body.query.results.channel.item.condition.temp}°F`, true)
          .addField('Humidity',
              body.query.results.channel.atmosphere.humidity, true)
          .addField('Pressure',
              body.query.results.channel.atmosphere.pressure, true)
          .addField('Rising',
              body.query.results.channel.atmosphere.rising, true)
          .addField('Visibility',
              body.query.results.channel.atmosphere.visibility, true)
          .addField('Wind Chill',
              body.query.results.channel.wind.chill, true)
          .addField('Wind Direction',
              body.query.results.channel.wind.direction, true)
          .addField('Wind Speed',
              body.query.results.channel.wind.speed, true);
      return message.channel.send(embed).catch(console.error);
    }
    

    

    if(command === 'kick'){
      let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if(!message.member.hasPermission("KICK_MEMBERS")){
        message.channel.send("You don't have the permissions to use this command!");
    }
    else{
        
        if(!member)
            //you have to type !kick then @username#1234 as an example
            return message.channel.send("Please mention a valid member of this server");
        if(!member.kickable) 
            return message.channel.send("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");

        // slice(1) removes the first part, which here should be the user mention or ID
        // join(' ') takes all the various parts to make it a single string.
        let reason = args.slice(1).join(' ');
        if(!reason) 
            reason = "No reason provided";
        member.kick(reason)
            .catch(error => message.channel.send(`Sorry ${message.author} I couldn't kick because of : ${error}`));
            message.channel.send(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
    }
    }

    if(command === 'mute'){
      if (!message.member.hasPermission("MANAGE_ROLES")) {
        return message.channel.send(
          "Sorry but you do not have permission to mute anyone");
      }
  
      if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
        return message.channel.send("I do not have permission to manage roles.");
      }
  
      const user = message.mentions.members.first();
      
      if(!user) {
        return message.channel.send("Please mention the member to who you want to mute")
      }
      
      if(user.id === message.author.id) {
        return message.channel.send("I won't mute you -_-");
      }
      
      
      let reason = args.slice(1).join(" ")
      
      
      if(!reason) {
        return message.channel.send("Please Give the reason to mute the member")
      }
      
    //TIME TO LET MUTED ROLE
      
      let muterole = message.guild.roles.cache.find(x => x.name === "Muted")
      
      
        if(!muterole) {
        return message.channel.send("This server do not have role with name `Muted`")
      }
      
      
     if(user.roles.cache.has(muterole)) {
        return message.channel.send("Given User is already muted")
      }
    
      
      
    
      
      
      user.roles.add(muterole)
      
  await message.channel.send(`You muted **${message.mentions.users.first().username}** For \`${reason}\``)
      
      user.send(`You are muted in **${message.guild.name}** For \`${reason}\``)
      
      
  //WE ARE DONE HERE 
    }
    if(command === 'unmute'){
      if (!message.member.hasPermission("MANAGE_ROLES")) {
        return message.channel.send(
          "Sorry but you do not have permission to unmute anyone"
        );
      }
  
      if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
        return message.channel.send("I do not have permission to manage roles.");
      }
  
      const user = message.mentions.members.first();
  
      if (!user) {
        return message.channel.send(
          "Please mention the member to who you want to unmute"
        );
      }
      
      let muterole = message.guild.roles.cache.find(x => x.name === "Muted")
      
      
   if(user.roles.cache.has(muterole)) {
        return message.channel.send("Given User do not have mute role so what i am suppose to take")
      }
      
      
      user.roles.remove(muterole)
      
      await message.channel.send(`**${message.mentions.users.first().username}** is unmuted`)
      
      user.send(`You are now unmuted from **${message.guild.name}**`)
  
    }

   if(command === 'nuke'){
    const deleteCount = parseInt(args[0], 10);

    // get the delete count, as an actual number.
    if(!message.member.hasPermission("MANAGE_MESSAGES")){
      message.channel.send("You don't have the permissions to use this command!");
    }
    
    else{        
      // Ooooh nice, combined conditions. <3
      if(!deleteCount || deleteCount < 2 || deleteCount > 100){
        return message.channel.send("Please provide a number between 2 and 100 for the number of messages to delete");
      }
      
      await message.channel.bulkDelete(deleteCount).catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
    }   
   }
    
   
   
  

 
   
    
      
    

    if(command === 'rick'){
      const rick = new Discord.MessageEmbed()
      message.channel.send(`https://media1.tenor.com/images/23aeaaa34afd591deee6c163c96cb0ee/tenor.gif?itemid=7220603`)
    }

   


    if(command == 'coinflip'){
      let random = (Math.floor(Math.random() * Math.floor(2)));

        if(random === 0) {
          message.channel.send('I flipped heads!');
        }
        else {
          message.channel.send('I flipped tails!');
        }
    }
    if(command == '8ball'){
              if(!args[0]) {
            message.reply('Please ask me a question.');
          }
          else {
            let eightball = [
            'It is certain.',
            'It is decidedly so.',
            'Without a doubt.',
            'Yes definitely.',
            'You may rely on it.',
            'As I see it, yes.',
            'Most likely.',
            'Outlook good.',
            'Yes.',
            'Signs point to yes.',
            'Reply hazy try again.',
            'Ask again later.',
            'Better not tell you now.',
            'Cannot predict now.',
            'Concentrate and ask again.',
            'Don\'t count on it.',
            'My reply is no.',
            'My sources say no.',
            'Outlook not so good.',
            'Very doubtful.',
            'No way.',
            'Maybe',
            'The answer is hiding inside you',
            'No.',
            'Depends on the mood of the CS god',
            'Hang on',
            'It\'s over',
            'It\'s just the beginning',
            'Good Luck',
            ];
            let index = (Math.floor(Math.random() * Math.floor(eightball.length)));
            message.reply(eightball[index]);
          }
    }



    if(command == 'test'){
      const canvas = Canvas.createCanvas(700, 250);
	// ctx (context) will be used to modify a lot of the canvas

	    const ctx = canvas.getContext('2d');
      canvas
    }







   
    if(command == 'pong'){
      message.reply('Ping!');
    }
    if (command === "meme") {

let reddit = [
        "memes",
        "dankmemes",
        "dankmeme",
        "minecraftmemes"
    ]

    let subreddit = reddit[Math.floor(Math.random() * reddit.length)];

    message.channel.startTyping();

    randomPuppy(subreddit).then(async url => {
            await message.channel.send({
                files: [{
                    attachment: url,
                    name: 'meme.png'
                }]
            }).then(() => message.channel.stopTyping());
    }).catch(err => console.error(err));
  }
    if(command === 'sword'){
      
       message.channel.send('▬▬ι═══════ﺤ'+'HYAAAHHH!!')
      
      
    }
    if(command === 'info'){
      const ava = new Discord.MessageEmbed()
      .addField(message.author.info);
      message.channel.send(ava);
      
      
      
    }
    if(command === 'server'){
      const embed = new Discord.MessageEmbed()

      .setTitle("Server Info:")
      .setColor("#08f26e")
      .setThumbnail(message.guild.iconURL())
      .addFields(
        { name: "Server Name", value: message.guild.name, inline: true},
        { name: "Server Owner", value: message.guild.owner, inline: true},
        { name: "Server Description", value: message.guild.description, inline: true},
        { name: "Server Region", value: message.guild.region, inline: true},
        { name: "Server Language", value: message.guild.preferredLocale, inline: true},
        { name: "MFA-Level", value: message.guild.mfalevel, inline: true},
        { name: "Creation Date", value: message.guild.createdAt},
        { name: "Member Count", value: message.guild.memberCount, inline: true},
        { name: "Channel Count", value: message.guild.channels.cache.size, inline: true},
        { name: "Roles Count", value: message.guild.roles.cache.size, inline: true},
        { name: "No. of Boosts", value: message.guild.premiumSubscriptionCount, inline: true},
        { name: "Boost Level", value: message.guild.premiumTier, inline: true},
        { name: "Vanity-URL", value: message.guild.vanityURLCode, inline: true},

      )
      
      
      
      
      


      message.channel.send(embed)
    }
    
    if(command === 'gnome'){
      const gnome = new Discord.MessageEmbed()
      .setTitle('Gnome')
      .setDescription(`⣿⣿⣿⣿⣿⣿⣿⠿⠋⠉⠄⠄⠄⠄⠄⠉⠙⢻⣿
                      ⣿⣿⣿⣿⣿⣿⢋⠄⠐⠄⠐⠄⠠⠈⠄⠂⠠⠄⠈⣿
                      ⣿⣿⣿⣿⣿⡟⠄⠄⠄⠁⢀⠈⠄⠐⠈⠄⠠⠄⠁⠈⠹
                      ⣿⣿⣿⣿⣿⣀⡀⡖⣖⢯⢮⢯⡫⡯⢯⡫⡧⣳⡣⣗⣼
                      ⣿⣿⣿⣿⣷⣕⢱⢻⢮⢯⢯⡣⣃⣉⢪⡪⣊⣀⢯⣺⣺
                      ⣿⣿⣿⣿⣿⣷⡝⣜⣗⢽⢜⢎⢧⡳⡕⡵⡱⣕⡕⡮⣾
                      ⣿⣿⣿⣿⣿⡿⠓⣕⢯⢮⡳⣝⣕⢗⡭⣎⢭⠮⣞⣽⡺
                      ⣿⣿⣿⡿⠋⠄⠄⠸⣝⣗⢯⣳⢕⣗⡲⣰⡢⡯⣳⣳⣫
                      ⣿⣿⠋⠄⠄⠄⠄⠄⠘⢮⣻⣺⢽⣺⣺⣳⡽⣽⣳⣳⠏⠛⠛⠛⢿
                      ⣿⠇⠄⢁⠄⠄⠄⠁⠄⠈⠳⢽⢽⣺⢞⡾⣽⣺⣞⠞⠄⠄⠈⢄⢎⡟⣏⢯⢝⢛⠿
                      ⡇⠄⡧⣣⢢⢔⢤⢢⢄⠂⠄⠄⠁⠉⠙⠙⠓⠉⠈⢀⠄⠄⠄⠑⢃⣗⢕⣕⢥⡣⣫⢽
                      ⣯⠄⢽⢸⡪⡪⡣⠲⢤⠄⠄⠂⠄⠄⠄⡀⠄⠠⠐⠄⣶⣤⣬⣴⣿⣿⣷⡹⣿⣿⣾⣿
                      ⣿⣶⣾⣵⢱⠕⡕⡱⠔⠄⠁⢀⠠⠄⠄⢀⠄⠄⢀⣾
                      ⣿⣿⣿⣿⡷⡗⠬⡘⠂⠄⠈⠄⠄⠄⠈⠄⠄⠄⢸
                      ⣿⣿⣿⣿⣿⣿⣇⠄⢀⠄⡀⢁⠄⠐⠈⢀⠠⠐⡀⣶
                      ⣿⣿⣿⣿⣿⣿⣇⠄⢀⠄⡀⢁⠄⠐⠈⢀⠠⠐⡀⣶
                      ⣿⣿⣿⣿⣿⣿⣧⢁⠂⠔⠠⠈⣾⠄⠂⠄⡁⢲
                      ⣿⣿⣿⣿⣿⣿⠿⠠⠈⠌⠨⢐⡉⠄⠁⡂⠔⠼
                      ⣿⣿⣿⣿⣿⣿⡆⠈⠈⠈⠄⠂⣆⠄⠄⠄⠄⣼
                      ⣿⣿⣿⣿⣿⣿⣿⠄⠁⠈⠄⣾⡿⠄⠄⠂⢸
                      ⣿⣿⣿⣿⣿⣿⡟⠄⠄⠁⠄⠻⠇⠄⠐⠄⠄⠈⠙⢻
                      ⣿⣿⣿⣿⣿⣿⡇⡀⠄⠂⠁⢀⠐⠄⣥⡀⠁⢀⠄⣿
Ho ho ho ha ha, ho ho ho he ha. Hello there me old chum. I’m gnot a gnelf. I’m gnot a gnoblin. I’m a gnome. And you’ve been, GNOMED`)
.setColor('#363942')
message.channel.send(gnome);
    }

    if(command === 'ascii'){
      const text = args.join(" ");
		if (!text || text.length > 20) {
			return message.channel.send("TEXT MISSING");
    client.commands.get('ascii').execute(message, args);
		}

		const rendered = await figletAsync(text);
		message.channel.send("```" + rendered + "```");
    }
    
    if(command === 'poke'){
      if (message.mentions.users.size < 1) return message.channel.send("you can't poke nobody")
      let user = message.guild.member(message.mentions.users.first());
            message.channel.send(`${user} You got a poke from ${message.author.username} ❤`,{
                embed: {
                    image: {
                        url: "https://i.imgur.com/XMuJ7K8.gif"
                    }
                }
            })
    }
    
    if(command === 'roast'){
      let user = message.mentions.users.first();
    if (message.mentions.users === message.author.username) return message.reply('You can not roast yourself');
    if (message.mentions.users.size < 1) return message.reply('You must mention someone to roast them.')
    var roast = [
    "were you born on the highway? That is where most accidents happen.",
    "i was going to give you a nasty look... but I see you already have one.",
    "remember when I asked for your opinion? Me neither.",
    "everyone's entitled to act stupid once in awhile, but you really abuse the privilege.",
    "i'm trying to see things from your point of view, but I can't get my head that far up my ass.",
    "i haven't seen a fatty like you run that fast since twinkies went on sale for the first time.",
    "two wrongs don't make a right, take your parents as an example.",
    "just looking at you, I now understand why some animals eat their young offspring.",
    "does time actually fly when you're having sex, or was it just one minute after all?",
    "you should go do that tomorrow. Oh wait, nevermind, you've made enough mistakes already for today.",
    "this is why you dont have nice things",
    "my teacher told me to erase mistakes, i'm going to need a bigger eraser.",
    "you're IQ's lower than your dick size.",
    "are you always such an idiot, or do you just show off when I'm around?",
    "there are some remarkably dumb people in this world. Thanks for helping me understand that.",
    "i could eat a bowl of alphabet soup and shit out a smarter statement than whatever you just said.",
    "you're about as useful as a screen door on a submarine.",
    "you always bring me so much joy'as soon as you leave the room.",
    "stupidity's not a crime, so feel free to go.",
    "if laughter is the best medicine, your face must be curing the world.",
    "the only way you'll ever get laid is if you crawl up a chicken's ass and wait.",
    "it looks like your face caught fire and someone tried to put it out with a hammer.",
    "scientists say the universe is made up of neutrons, protons and electrons. They forgot to mention morons like you.",
    "why is it acceptable for you to be an idiot but not for me to point it out?",
    "you're so fat you could sell shade.",
    "your family tree must be a cactus because everyone on it is a prick.",
    "you'll never be the man your mother is.",
    "just because you have an ass doesn't mean you need to act like one.",
    "which sexual position produces the ugliest children? Ask your mother she knows.",
    "if I had a face like yours I'd sue my parents.",
    "the zoo called. They're wondering how you got out of your cage?",
    "hey, you have something on your chin... no, the 3rd one down.",
    "aww, it's so cute when you try to talk about things you don't understand.",
    "you are proof that evolution can go in reverse.",
    "brains aren't everything. In your case they're nothing.",
    "you're so ugly when you look in the mirror, your reflection looks away.",
    "i'm sorry I didn't get that - I don't speak idiot.",
    "it's better to let someone think you're stupid than opening your mouth and prove it.",
    "were you born this stupid or did you take lessons?",
    "you're such a beautiful, intelligent, wonderful person. Oh I'm sorry, I thought we were having a lying competition.",
    "don't you get tired of putting make up on two faces every morning?",
    "hey, I'm straighter than the pole your mom dances on.",
    "if ugliness were measured in bricks, you would be the Great Wall of China.",
    "i thought I said goodbye to you this morning when I flushed the toilet",
    "if you're trying to improve the world, you should start with yourself. Nothing needs more help than you do",
    "zombies are looking for brains. Don't worry. You're safe.",
    "spreading rumors? At least you found a hobby spreading something other than your legs.",
    "i would tell you to eat trash but that's cannibalism",
    "if you spoke your mind, you would be speechless",
    "i can fix my ugliness with plastic surgery but you on the other hand will stay stupid forever",
    "acting like a dick won't make yours any bigger",
    "if I wanted to hear from an asshole, I would have farted",
    "roses are red. Violets are blue. God made us beautiful. What the hell happened to you?",
    "you remind me of a penny, two faced and worthless!",
    "i've met some pricks in my time but you my friend, are the f*cking cactus",
    "i'd slap you, but that would be animal abuse",
    "if you're gonna be a smartass, first you have to be smart. Otherwise you're just an ass. ",
    "i know I�m talking like an idiot. I have to, other wise you wouldn't understand me.",
    "you're so dumb, your brain cell died of loneliness",
    "you shouldn't let your mind wander..its way to small to be out on its own",
    "i don't know what makes you so dumb, but its working",
    "you should put the diaper on your mouth, that's where the craps comin' out.",
    "you would be much more likable if it wasn't for that hole in your mouth that stupid stuff comes out of. ",
    "could you go away please, I'm allergic to douchebags",
    "if you had any intelligence to question I would have questioned it already.",
    "i wish I had a lower I.Q,  maybe then I could enjoy your company.",
    "i would answer you back but life is too short, just like your d*ck",
    "mirrors don't lie. Lucky for you, they can't laugh either.",
    "i was right there are no humans in this channel",
    "you have a face not even a mother could love....",
    "you know what I would find if I looked up idiot in the dictionary a picture of you?",
    "you make the guys on Jackass look like Einstein.....",
    "i would slap you but I don't want to make your face look any better",
    "sorry, I can't put small objects in my mouth or Ill choke",
    "you should wear a condom on your head, if you're going to be a dick you might as well dress like one",
    "have you been shopping lately? They're selling lives at the mall, you should get one"
]
    const roasts = roast[Math.floor(Math.random() * roast.length)];
    const embed = new Discord.MessageEmbed()
        .setColor(0x00A2E8)
        .setDescription(user.username + ", " + roasts);
    message.channel.send({embed})
    }
    else if(command === 'fistbump'){
      if (message.mentions.users.size < 1) return message.channel.send("you can't fist-bump nobody")
      let user = message.guild.member(message.mentions.users.first());
            message.channel.send(`${user} You got a fist-bump from ${message.author.username} 🤜🤛`,{
                embed: {
                    image: {
                        url: "https://i.imgur.com/lO2xZHC.gif"
                    }
                }
            })
    }
    

    if(command === 'doggo'){
      const superagent = require("superagent");
      const { body } = await superagent
      .get('https://random.dog/woof.json');
      const embed  = new Discord.MessageEmbed()
      .setColor(0x00A2E8)
      .setImage(body.url)
      if (body.url.includes(".mp4")) return; // As mp4s cant really be set as a image for a embed and will cause a error in the console
      message.channel.send({embed})
    }

    


    if(command === 'slap'){
       if (message.mentions.users.first() == message.author) {
        message.reply("You slapped yourself. Wait, you can't!");
      } else {
        const Embed = new Discord.MessageEmbed()
          .setTitle(
            `${message.author.tag} slapped ${
              message.mentions.users.first().tag
            }.`
          )
          .setImage('https://static1.srcdn.com/wordpress/wp-content/uploads/2020/05/Batman-Slapping-Robin-Meme-Explained.jpg?q=50&fit=crop&w=960&h=500');

        message.channel.send(Embed);
      }
    }

    
    


    if(command === 'sexyrate'){
      const sexyrate = Math.floor(Math.random() * 100)
       const embed = new Discord.MessageEmbed()
            .addField(":heart_decoration: Sexy Rate :heart_decoration: ", "I rate you a " + sexyrate + " out of 100 on the sexy scale")
            .setThumbnail(message.author.displayAvatarURL)
       message.channel.send({embed})
    }

    if(command === 'joke'){
        giveMeAJoke.getRandomDadJoke (function(joke) {
          message.channel.send(joke);
        })
      }

    if(command === 'dice'){
       var dice = [1, 2, 3, 4, 5, 6];

    const embed = new Discord.MessageEmbed()
        .setColor("#15f153")
        .addField("First dice", dice[Math.floor(Math.random()*dice.length)], true)
        .addField("Second dice", dice[Math.floor(Math.random()*dice.length)], true)
        .setTimestamp();

    return message.channel.send(embed);    
    }
    else if(command == 'invite'){
      message.channel.send('See you there :) https://discord.com/api/oauth2/authorize?client_id=724537276046245948&permissions=0&scope=bot')
    }
    
   

    if(command === 'help'){
      const help = new Discord.MessageEmbed()
      .setColor('#fff700')
      .setTitle('All the Compatible Commands!')
      .addFields(
        { name: 'Images/Gifs Commands 📸 ', value: 'o!helpimg', inline: true },
        { name: 'Text Commands 📃 ', value: 'o!helptext', inline: true },
        { name: 'Troll Commands 🤣 ', value: 'o!helptroll', inline: true },
        { name: 'Invite the bot! ', value: 'o!invite', inline: true },
        { name: 'New Commands to be added soon!!', value: 'COMING SOON', inline: true },
        
      )
      const helpp = new Discord.MessageEmbed()
      .setColor('#fff700')
      .setTitle('All the Compatible Commands!')
      .addFields(
        { name: 'Images/Gifs Commands 📸 ', value: 'o!helpimg', inline: true },
        { name: 'Text Commands 📃 ', value: 'o!helptext', inline: true },
       { name: 'Troll Commands 🤣 ', value: 'o!helptroll', inline: true },
       { name: 'Invite the bot! ', value: 'o!invite', inline: true },
        { name: 'New Commands to be added soon!!', value: 'COMING SOON', inline: true },
        
        { name: 'Nice Guy', value: 'Thanks Multi for the help', inline: true})

      let replies = [help, helpp];
      let random = Math.floor(Math.random() * 2)
      message.channel.send(replies[random]);
    }
    
    
    if(command === 'helpimg'){
      const img = new Discord.MessageEmbed()
      .setColor('#fff700')
      .addFields(
      { name: 'o!meme ', value: 'Shows a meme', inline: true },
      { name: 'o!doggo ', value: 'Shows a picture of a dog', inline: true },
      { name: 'o!poke ', value: 'Pokes a user uwu', inline: true },
      { name: 'o!fistbump ', value: 'Fist-bumps a user', inline: true },)
      message.channel.send(img)
    }
    if(command === 'helptext'){
      const text = new Discord.MessageEmbed()
      .setColor('#fff700')
      .addFields(
      { name: 'o!ping ', value: 'Displays your Ping', inline: true },
      { name: 'o!pong  ', value: 'Displays the text: Ping!', inline: true },
      { name: 'o!ascii ', value: 'Displays an ASCII sword', inline: true },
      { name: 'o!8ball ', value: 'Displays your fortune/future', inline: true },
      { name: 'o!server ', value: 'Displays the current server info', inline: true },
      { name: 'o!av ', value: 'Displays basic user info', inline: true },
      { name: 'o!ascii ', value: 'Displays your text in ASCII', inline: true },
      { name: 'o!roast ', value: 'Roasts another user', inline: true },
      { name: 'o!coinflip ', value: 'Flips a coin', inline: true },
      { name: 'o!joke ', value: 'Displays a dad joke', inline: true },
      { name: 'o!sexyrate', value: 'Checks the sexy rate of a user ', inline: true },)

      message.channel.send(text)
    }
    if(command === 'helptroll'){
      const troll = new Discord.MessageEmbed()
      .setColor('#fff700')
      .addFields(
      { name: 'o!rick ', value: 'Wonder what that is?', inline: true },
      { name: 'o!gnome ', value: 'I think the command says it...', inline: true },)
      message.channel.send(troll)
    }

    


    
    
    
  
    



});


client.login('token here')
