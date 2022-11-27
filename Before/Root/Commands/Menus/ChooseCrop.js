const Discord = require('discord.js');
const fs = require("fs");
const AccountLoading = require("../Functions/AccountLoading.js")

module.exports = {
    name: "ChooseCrop-Menu",
    run: async (client, interaction, container) => {
        fs.readFile("./Settings.json", "utf8", function (err, data) {
            var s = JSON.parse(data);
            let loggedIn = AccountLoading.loggedIn;

            if (interaction.user.tag !== interaction.message.embeds[0].footer.text) return interaction.reply({
                content: "Please use `.farm` to do this.",
                ephemeral: true
            })

            if (!loggedIn.length) return interaction.reply({
                content: "No bots are currently loaded.",
                ephemeral: true
            })

            let bot;
            loggedIn.forEach((data) => {
                if (data.username == interaction.message.embeds[0].author.name.split(": ")[1]) {
                    bot = data;
                }
            })

            if (!bot) return interaction.reply({
                content: `Bot: **${interaction.message.embeds[0].author.name.split(": ")[1]}** is not online.`,
                ephemeral: true
            })


            if (interaction.values[0].toLowerCase() == "wheat") {
                bot.occupation.farming.crop = "wheat";
                bot.occupation.farming.cropSeed = "wheat_seeds"
            } else if (interaction.values[0].toLowerCase() == "carrots") {
                bot.occupation.farming.crop = "carrots";
                bot.occupation.farming.cropSeed = "carrot"
            } else if (interaction.values[0].toLowerCase() == "potatoes") {
                bot.occupation.farming.crop = "potatoes";
                bot.occupation.farming.cropSeed = "potato"
            } else if (interaction.values[0].toLowerCase() == "pumpkins") {
                bot.occupation.farming.crop = "pumpkin";
                bot.occupation.farming.cropSeed = ""
            } else if (interaction.values[0].toLowerCase() == "melons") {
                bot.occupation.farming.crop = "melon_block";
                bot.occupation.farming.cropSeed = ""
            }

            let farmEmbed = new Discord.MessageEmbed()
                .setColor(s.embedColor)
                .setAuthor({
                    name: "Farm using: " + bot.username,
                    iconURL: `http://cravatar.eu/head/${bot.username}/32.png`
                })
                .setDescription(`Select the crop type in the menu beneath and use the buttons to start farming. \n\n` +
                `🔸 \`Deposit Chest\`\n⤷  **Coords:** ${bot.occupation.farming.depositCoords}`
                )
                    //`Currently Farming: \`${bot.occupation.farming.currentlyFarming}\`\n` +
                    //`Current Crop: \`${bot.occupation.farming.crop}\`\n` +
                    //`Deposit Chest Coords: \`${bot.occupation.farming.depositCoords}\`\n`)
                .setFooter(`${interaction.user.tag}`)
                .setThumbnail(`https://mc-heads.net/player/${bot.username}`)


            let MenuItems = [{
                label: "Wheat",
                emoji: "🌾"
            }, {
                label: "Carrots",
                emoji: "🥕"
            }, {
                label: "Potatoes",
                emoji: "🥔"
            }, {
                label: "Pumpkins",
                emoji: "🎃"
            }, {
                label: "Melons",
                emoji: "🍉"
            }, ]

            const cropMenu = new Discord.MessageActionRow().addComponents(
                new Discord.MessageSelectMenu()
                .setCustomId('ChooseCrop-Menu')
                .setPlaceholder('Select the crop you wish to farm.')
            )

            MenuItems.forEach((data) => {
                if (data.label.toLowerCase().includes(bot.occupation.farming.crop.split("s")[0]) || data.label.toLowerCase().includes(bot.occupation.farming.crop.replace("_block", "s"))) {

                    cropMenu.components[0].addOptions([{
                        label: data.label,
                        value: data.label,
                        description: "Farm " + data.label,
                        emoji: data.emoji,
                        default: true
                    }])

                } else {

                    cropMenu.components[0].addOptions([{
                        label: data.label,
                        value: data.label,
                        description: "Farm " + data.label,
                        emoji: data.emoji,
                    }])
                }
            })



            interaction.update({
                embeds: [farmEmbed],
                components: [cropMenu, interaction.message.components[1]]
            })


        })
    }
}