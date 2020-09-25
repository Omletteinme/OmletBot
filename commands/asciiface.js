const Discord = require('discord.js');
var asciiFaces = require("cool-ascii-faces");
const { description } = require('./ping');
module.exports = {
    name: "asciiface",
    description:"Displays an ascii face!",
    execute(message, args){
        var randomSet = getRandomNumber(0, asciiFaces.faces.length - 11)
        var faces = asciiFaces.faces.slice(randomSet, randomSet + 10).join("     ")
        message.reply("Here are some copy-and-paste :clipboard: ascii faces :eyes:\n" + faces)
        function getRandomNumber(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        } 
    }
}