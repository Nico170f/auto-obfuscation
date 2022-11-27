const sandBots = require("../Functions/SandBots")

module.exports = {
    name: "sandbotFindBlocks",
    run: async(client, interaction, Discord) => {

        if(interaction.user.tag !== interaction.message.embeds[0].footer.text) return interaction.reply({content: "Please use `.sandbot` to do this.", ephemeral: true})

        let OldComponent = interaction.message.components[0];
        OldComponent.components[0].disabled = true
        OldComponent.components[1].disabled = true
        OldComponent.components[2].disabled = true
        
        await interaction.message.edit({
            components: [OldComponent]
        })

        await interaction.deferReply();
        sandBots.startUp(interaction, "FindBlocks")
    }
}