const AccountLoading = require("../Functions/AccountLoading.js")
const fs = require("fs");

module.exports = {
    name: "selectAllAccountsButton",
    run: async (client, interaction, Discord) => {
        fs.readFile("./Settings.json", "utf8", async function (err, data) {
        var s = JSON.parse(data);
        let loggedIn = AccountLoading.loggedIn;

        if(interaction.user.tag !== interaction.message.embeds[0].footer.text) return interaction.reply({content: "Please use `.select` to do this.", ephemeral: true})

        if(loggedIn.length < 1) return interaction.reply({content: "No bots are currently loaded.", ephemeral: true})


        const row = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
            .setCustomId('confirmSelectOrDeselectAllAccountsButton')
            .setLabel('Confirm')
            .setStyle('DANGER'),
        )

        let confirmSelectedAll = new Discord.MessageEmbed()
        .setColor("RED")
        .setDescription("Are you sure you wish to select all accounts?")
        .setFooter(interaction.user.tag)
        interaction.update({embeds: [confirmSelectedAll], components: [row]})

        })
    }
}