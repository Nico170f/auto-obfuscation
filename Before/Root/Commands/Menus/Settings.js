const getEmbedFile = require('../Functions/GetEmbed.js');
const getEmbed = getEmbedFile.getSettingsEmbed;
const getMenu = getEmbedFile.getSettingsMenu;

module.exports = {
    name: "Settings_Menu",
    run: async (client, interaction, container) => {

        if (interaction.user.tag !== interaction.message.embeds[0].footer.text) return interaction.reply({
            content: "Please use `.settings` to do this.",
            ephemeral: true
        })

        await getEmbed(interaction.user.tag, async function () {
            await getMenu(interaction.values[0], async function () {

                let UpdateEmbed;
                switch (interaction.values[0]) {

                    case "Connection":
                        UpdateEmbed = getEmbedFile.Embeds.ConnectionEmbed
                        break;

                    case "Proxies":
                        UpdateEmbed = getEmbedFile.Embeds.ProxiesEmbed
                        break;

                    case "Discord":
                        UpdateEmbed = getEmbedFile.Embeds.DiscordEmbed
                        break;

                    case "Bot":
                        UpdateEmbed = getEmbedFile.Embeds.BotEmbed
                        break;

                    case "Farming":
                        UpdateEmbed = getEmbedFile.Embeds.FarmingEmbed
                        break;

                    case "Printing":
                        UpdateEmbed = getEmbedFile.Embeds.PrintingEmbed
                        break;

                    default:
                        return console.log("Error getting settings menu.")
                }

                interaction.update({
                    embeds: [UpdateEmbed],
                    components: [getEmbedFile.Menus.SettingsMenu, getEmbedFile.Buttons.UpdateCategory]
                })

            })
        })
    }
}