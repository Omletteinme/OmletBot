const Discord = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Shows your ping!',




    execute(message, args){

        // It sends the user "Pinging"
        message.channel.send("Pinging...").then(m =>{
            // The math thingy to calculate the user's ping
              var ping = m.createdTimestamp - message.createdTimestamp;
  
            // Basic embed
              var embed = new Discord.MessageEmbed()
              .setAuthor(`This doesn't mean anything: Your ping is ${ping}`)
              .setColor("Your Color")
              
              // Then It Edits the message with the ping variable embed that you created
              m.edit(embed)
          });



    }
}