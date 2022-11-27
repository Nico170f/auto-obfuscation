const mineflayer = require('mineflayer');
const c = require("chalk");
const AccountLoading = require("../Functions/AccountLoading.js")
const fs = require("fs");
var Vec3 = require('vec3').Vec3;

module.exports = {
    name: 'load',
    aliases: ["l", ".join"],
    run: async (client, message, args, Discord) => {
        fs.readFile("./Settings.json", "utf8", function (err, data) {
            var s = JSON.parse(data);
            let loggedIn = AccountLoading.loggedIn;

            var credentials = null;
            try {
              credentials = JSON.parse(fs.readFileSync("./Accounts.json"));
            } catch(err){
              console.log(err)
            }
            if(credentials == null) credentials = {length: 0}

            let Buttons = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                .setCustomId('loadAllAccounts')
                .setLabel('Load All')
                .setStyle('PRIMARY')
                .setDisabled(false),
            ).addComponents(
                new Discord.MessageButton()
                .setCustomId('loadOneAccounts')
                .setLabel('Load One')
                .setStyle('PRIMARY')
                .setDisabled(false),
            ).addComponents(
                new Discord.MessageButton()
                .setCustomId('stopLoadingAccounts')
                .setLabel('Stop Loading')
                .setStyle('DANGER')
                .setDisabled(true),
            )

            const LoadEmbed = new Discord.MessageEmbed()
            .setColor(s.embedColor)
            .setTitle("Account Loading")
            .setDescription(`Currently loaded counts the total amount of bots currently online. Account errors occurs if an account is either banned or gets kicked while logging in. Invalid accounts have invalid credentials. Errors thrown while a bot is logging in will be logged in console.\n\n➜ Currently loaded: **${loggedIn.length}/${credentials.length}** `)
            .addField("Errors:", `\`\`\`-\`\`\``)
            .addField("Invalid:", `\`\`\`-\`\`\``)
            .setFooter(message.author.tag)
            .setThumbnail('https://myminecraftbot.com/images/Headshot.png');

            if(!args[0]){
                message.channel.send({embeds: [LoadEmbed], components: [Buttons]})
            } else {
                if(args[0]){
                    if(isNaN(args[0])){
                        message.channel.send({embeds: [LoadEmbed], components: [Buttons]})
                    } else {

                        let amountToLogin = parseInt(args[0])
                        if(amountToLogin > credentials.length) amountToLogin = credentials.length;

                        let reponseEmbed = new Discord.MessageEmbed()
                        .setColor(s.embedColor)
                        .setTitle("Account Loading")
                        .setDescription(`Do you want to load \`${amountToLogin}\` bots?`)
                        .setFooter(message.author.tag)

                        let Accept = new Discord.MessageActionRow()
                        .addComponents(
                            new Discord.MessageButton()
                            .setCustomId('AcceptLoadXBots')
                            .setLabel('Load')
                            .setStyle('PRIMARY')
                            .setDisabled(false),
                        )

                        message.channel.send({embeds: [reponseEmbed], components: [Accept]})
                    }
                }
            }
        })
    }
}