const AccountLoading = require('../Functions/AccountLoading.js');
const fs = require("fs");

module.exports = {
    name: "farmingDepositChestButton",
    run: async (client, interaction, Discord) => {
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



            //interaction.deferReply();


            let chests = bot.botUser.findBlocks({
                matching: [mcdata.blocksByName["trapped_chest"].id, mcdata.blocksByName["chest"].id],
                maxDistance: 30,
                count: 10
            })

            let row1 = new Discord.MessageActionRow().addComponents(
                new Discord.MessageSelectMenu()
                .setCustomId('NearChest-Menu')
                .setPlaceholder('Chests nearby. Sorted by nearest.')
                .addOptions([{
                    label: `Manual`,
                    value: "manual",
                    description: `Example: -1 2 -1`,
                    emoji: "🔹"
                }])
            )

            if (bot.occupation.farming.depositCoords.toLowerCase() !== "auto") {
                row1.components[0].addOptions([{
                    label: `Auto`,
                    value: "auto",
                    description: `Automatically find the nearest chest.`,
                    emoji: "🔹"
                }])
            }


            chests.forEach((data, i) => {

                row1.components[0].addOptions([{
                    label: `${data.x}, ${data.y}, ${data.z}`,
                    value: `${data.x}, ${data.y}, ${data.z}`,
                    emoji: "📦"
                }])

            })


            let selectChestEmbed = new Discord.MessageEmbed()
                .setColor(s.embedColor)
                .setAuthor({
                    name:  "Select Chest Using: " + bot.username,
                    iconUrl: `http://cravatar.eu/head/${bot.username}/32.png`
                })
                .setDescription(`Please either select the chest you want to deposit to. Select "Manual" to set the coords youself.`)
                .setFooter(`${interaction.user.tag}`)

            interaction.update({
                embeds: [selectChestEmbed],
                components: [row1]
            })


        })
    }
}