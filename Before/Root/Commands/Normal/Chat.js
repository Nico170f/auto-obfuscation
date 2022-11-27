const mineflayer = require('mineflayer');
const chalk = require("chalk");
const AccountLoading = require("../Functions/AccountLoading.js")
const fs = require("fs");

module.exports = {
    name : 'chat',
    aliases: ["c", "say", "speak"],
    run : async(client, message, args, Discord) => {
        fs.readFile("./Settings.json", "utf8", function (err, data) {
        var s = JSON.parse(data);
        let loggedIn = AccountLoading.loggedIn;

        
        let selected = [];
        loggedIn.forEach((data) => {
          if(data.selected){
            selected.push(data);
          }
        })


        let noAccounts = new Discord.MessageEmbed()
        .setColor(s.embedColor)
        .setDescription("No bots are currently selected! Use `.select` to select an account.")
        if(selected.length < 1) return message.channel.send({embeds: [noAccounts]});

        let noMessage = new Discord.MessageEmbed()
        .setColor(s.embedColor)
        .setDescription("Please write something to send in chat or set a timer!")
        if(!args[0]) return message.channel.send({embeds: [noMessage]});


        if(!isNaN(args[0])){

          let noMessageHere = new Discord.MessageEmbed()
          .setColor(s.embedColor)
          .setDescription("Please write something to send in chat!")
          if(!args[1]) return message.channel.send({embeds: [noMessageHere]});



          selected.forEach((data, i) => {
            let bot = data.botUser;

            setTimeout(async () => {
              await bot.chat(args.slice(1).join(' '));
            }, i * parseInt(args[0] + "000"))

        }) 


        } else {

          selected.forEach(async (data) => {
            await data.botUser.chat(args.slice(0).join(' '));

          }) 
        }

        let successEmbed = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setDescription(`Successfully sent message from ${selected.length} accounts!`)
        message.channel.send({embeds: [successEmbed]});
    })
    }
}