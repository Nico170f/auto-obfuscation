const fs = require("fs");

module.exports = {
    name: "deselectAllAccountsButton",
    run: async (client, interaction, Discord) => {
        fs.readFile("./Settings.json", "utf8", async function (err, data) {
        var s = JSON.parse(data);

        if(interaction.user.tag !== interaction.message.embeds[0].footer.text) return interaction.reply({content: "Please use `.select` to do this.", ephemeral: true})


        const row = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
            .setCustomId('confirmSelectOrDeselectAllAccountsButton')
            .setLabel('Confirm')
            .setStyle('DANGER'),
        )

        let confirmSelectedAll = new Discord.MessageEmbed()
        .setColor("RED")
        .setDescription("Are you sure you wish to deselect all accounts?")
        .setFooter(interaction.user.tag)
        interaction.update({embeds: [confirmSelectedAll], components: [row]})
        })
    }
}