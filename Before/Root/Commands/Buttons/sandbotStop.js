const sandBots = require("../Functions/SandBots")

module.exports = {
    name: "sandbotStop",
    run: async(client, interaction, Discord) => {

        if(interaction.user.tag !== interaction.message.embeds[0].footer.text) return interaction.reply({content: "Please use `.sandbot` to do this.", ephemeral: true})

        let OldComponent = interaction.message.components[0];
        OldComponent.components[0].disabled = false
        OldComponent.components[1].disabled = true
        OldComponent.components[2].disabled = false
        
        await interaction.message.edit({
            components: [OldComponent]
        })

        await interaction.deferReply();
        sandBots.startUp(interaction, "Stop")
    }
}