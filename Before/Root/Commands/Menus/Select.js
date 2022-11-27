const Discord = require('discord.js');
const fs = require("fs");
const AccountLoading = require("../Functions/AccountLoading.js")

module.exports = {
    name: "Select-Menu",
    run: async (client, interaction, container) => {
        fs.readFile("./Settings.json", "utf8", function (err, data) {
            var s = JSON.parse(data);
            let loggedIn = AccountLoading.loggedIn;

            if (interaction.user.tag !== interaction.message.embeds[0].footer.text) return interaction.reply({
                content: "Please use `.select` to do this.",
                ephemeral: true
            })

            let accountEmail = interaction.values[0]
            let newRow1 = new Discord.MessageActionRow()
            let newRow2 = new Discord.MessageActionRow()
            let newMenu = new Discord.MessageSelectMenu()
                .setCustomId('Select-Menu')
                .setPlaceholder('Select An Account')

            loggedIn.forEach((data) => {
                if (data.email == accountEmail) {
                    if (data.selected) {
                        data.selected = false
                    } else {
                        data.selected = true
                    }
                }
            })

            loggedIn.forEach((data, i) => {
                if (data.selected) {

                    newMenu.addOptions([{
                        label: data.username,
                        value: data.email,
                        description: data.email + " (Selected)",
                        emoji: "✅"
                    }])

                } else {

                    newMenu.addOptions([{
                        label: data.username,
                        value: data.email,
                        description: data.email,
                        emoji: "🤖"
                    }])

                }
            })

            newRow1.addComponents(newMenu)
            newRow2.addComponents(interaction.message.components[1].components[0], interaction.message.components[1].components[1])
            interaction.update({
                components: [newRow1, newRow2]
            })


        })
    }
}