module.exports = {
    name: "configResetButton",
    ownerOnly: true,
    run: async(client, interaction, Discord) => {

        if(interaction.user.tag !== interaction.message.embeds[0].footer.text) return interaction.reply({content: "Please use `.settings` to do this.", ephemeral: true})

        const row = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
            .setCustomId('confirmResetButton')
            .setLabel('Confirm Reset')
            .setStyle('DANGER'),
        )

        let resetEmbed = new Discord.MessageEmbed()
        .setColor("RED")
        .setDescription("Are you sure you wish to reset all settings?")
        .setFooter(interaction.user.tag)

        interaction.update({embeds: [resetEmbed], components: [row]})
    }
}