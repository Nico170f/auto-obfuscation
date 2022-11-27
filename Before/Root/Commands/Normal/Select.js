const mineflayer = require('mineflayer');
const chalk = require("chalk");
const AccountLoading = require("../Functions/AccountLoading.js")
const fs = require("fs");

module.exports = {
    name: 'select',
    aliases: ["use", "choose"],
    run: async (client, message, args, Discord) => {
        fs.readFile("./Settings.json", "utf8", function (err, data) {
        var s = JSON.parse(data);
        let loggedIn = AccountLoading.loggedIn;

        let noLoggedIn = new Discord.MessageEmbed()
        .setColor(s.embedColor)
        .setDescription("No bots are currently loaded.");
        if(loggedIn.length < 1) return message.channel.send({embeds: [noLoggedIn]});

        let row1 = new Discord.MessageActionRow().addComponents(
            new Discord.MessageSelectMenu()
            .setCustomId('Select-Menu')
            .setPlaceholder('Select An Account')
        )
                
        loggedIn.forEach((data) => {
            if(data.selected)
            {

                row1.components[0].addOptions([{
                    label: data.username,
                    value: data.email,
                    description: data.email + " (Selected)",
                    emoji: "✅"
                }])

            } else 
            {

                row1.components[0].addOptions([{
                    label: data.username,
                    value: data.email,
                    description: data.email,
                    emoji: "🤖"
                }])

            }
        })

        const row2 = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
            .setCustomId('selectAllAccountsButton')
            .setLabel('Select All')
            .setStyle('PRIMARY'),
            new Discord.MessageButton()
            .setCustomId('deselectAllAccountsButton')
            .setLabel('Deselect All')
            .setStyle('SECONDARY'),
        )

        
        let selectEmbed = new Discord.MessageEmbed()
        .setColor(s.embedColor)
        .setTitle("Select Menu")
        .setDescription("Select the account(s) you wish to manipulate.")
        .setThumbnail('https://myminecraftbot.com/images/Headshot.png')
        .setFooter(message.author.tag)

        message.channel.send({embeds: [selectEmbed], components: [row1, row2]})

    })
    }
}