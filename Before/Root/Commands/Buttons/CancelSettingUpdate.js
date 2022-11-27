const getEmbedFile = require('../Functions/GetEmbed.js');
const getEmbed = getEmbedFile.getSettingsEmbed;
const getMenu = getEmbedFile.getSettingsMenu;
const cancel = [];

module.exports = {
    name: "CancelSettingUpdate",
    run: async (client, interaction, Discord) => {
        if (interaction.user.tag !== interaction.message.embeds[0].footer.text) return interaction.reply({
            content: "Please use `.settings` to do this.",
            ephemeral: true
        })

        cancel.splice(0)

        await getEmbed(interaction.user.tag, async function () {
            await getMenu(interaction.message.embeds[0].title.split(" ")[0], async function () {

                let embed;
                switch(interaction.message.embeds[0].title.split(" ")[0]){

                    case "Connection": 
                        embed = getEmbedFile.Embeds.ConnectionEmbed;
                        break;

                    case "Proxies":
                        embed = getEmbedFile.Embeds.ProxiesEmbed;
                        break;

                    case "Discord": 
                        embed = getEmbedFile.Embeds.DiscordEmbed;
                        break;

                    case "Bot":
                        embed = getEmbedFile.Embeds.BotEmbed;
                        break;

                    case "Farming": 
                        embed = getEmbedFile.Embeds.FarmingEmbed;
                        break;
                }

                cancel[0] = {userID: interaction.user.id, time: Date.now()}

                interaction.update({
                    embeds: [embed],
                    components: [getEmbedFile.Menus.SettingsMenu, getEmbedFile.Buttons.UpdateCategory]
                })

            })
        })
    },
    cancel
}