const Discord = require('discord.js');
const fs = require("fs");
const AccountLoading = require("../Functions/AccountLoading.js")


module.exports = {
    name: "NearChest-Menu",
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


            const farmControlButton = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                    .setCustomId('farmingStartButton')
                    .setLabel('Start Farming')
                    .setStyle('SUCCESS'),
                ).addComponents(
                    new Discord.MessageButton()
                    .setCustomId('farmingStopButton')
                    .setLabel('Stop Farming')
                    .setStyle('DANGER')
                    .setDisabled(true),
                ).addComponents(
                    new Discord.MessageButton()
                    .setCustomId('farmingDepositChestButton')
                    .setLabel('Set Deposit Chest')
                    .setStyle('PRIMARY'),
                )


            if (interaction.values[0] == "auto") {
                bot.occupation.farming.depositCoords = "Auto";

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
                    .setFooter(interaction.user.tag)
                    .setThumbnail(`https://mc-heads.net/player/${bot.username}`)


                interaction.update({
                    embeds: [farmEmbed],
                    components: [cropMenu, farmControlButton]
                })



            } else if (interaction.values[0] == "manual") {


                const filter = i => i.author.id === interaction.user.id;

                interaction.reply({
                        content: `What should \`Deposit Chest Coords\` be updated to?`,
                        ephemeral: false
                    }, {
                        fetchReply: true
                    })
                    .then(() => {
                        interaction.channel.awaitMessages({
                                filter,
                                max: 1,
                                time: 30000,
                                errors: ['time']
                            })
                            .then(collected => {
                                let answer = collected.first().content.toLowerCase();


                                let args = answer.split(" ");

                                if (args[0])
                                    if (isNaN(args[0])) return interaction.followUp("This setting only allows numbers.")
                                if (args[1])
                                    if (isNaN(args[1])) return interaction.followUp("This setting only allows numbers.")
                                if (args[2])
                                    if (isNaN(args[2])) return interaction.followUp("This setting only allows numbers.")

                                if (!args[2]) {

                                    let notEnoughArgs = new Discord.MessageEmbed()
                                        .setColor("RED")
                                        .setDescription(`Invalid input. This setting requires 3 arguments. Example: \`10 -20 30\``)

                                    interaction.followUp({
                                        embeds: [notEnoughArgs]
                                    })

                                } else {

                                    if (args[3]) {

                                        let tooManyArgs = new Discord.MessageEmbed()
                                            .setColor("RED")
                                            .setDescription(`Invalid input. This setting requires 3 arguments. Example: \`10 -20 30\``)

                                        interaction.followUp({
                                            embeds: [tooManyArgs]
                                        })

                                    } else {

                                        bot.occupation.farming.depositCoords = `${args[0]}, ${args[1]}, ${args[2]}`;
                                        interaction.deleteReply();
                                        collected.first().delete();

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
                                            .setFooter(interaction.user.tag)
                                            .setThumbnail(`https://mc-heads.net/player/${bot.username}`)


                                        interaction.message.edit({
                                            embeds: [farmEmbed],
                                            components: [cropMenu, farmControlButton]
                                        })


                                    }
                                }

                            })
                            .catch(collected => {
                                interaction.followUp({
                                    content: 'Timed out.',
                                    ephemeral: true
                                });
                            });
                    });

            } else {

                bot.occupation.farming.depositCoords = interaction.values[0]
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
                    .setFooter(interaction.user.tag)
                    .setThumbnail(`https://mc-heads.net/player/${bot.username}`)


                interaction.update({
                    embeds: [farmEmbed],
                    components: [cropMenu, farmControlButton]
                })

            }




        })
    }
}