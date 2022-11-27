const AccountLoading = require("../Functions/AccountLoading.js")
const fs = require("fs");

module.exports = {
    name: "loadAllAccounts",
    run: async (client, interaction, Discord) => {
        fs.readFile("./Settings.json", "utf8", async function (err, data) {
            var s = JSON.parse(data);
            let loggedIn = AccountLoading.loggedIn;
            
            if (interaction.user.tag !== interaction.message.embeds[0].footer.text) return interaction.reply({
                content: "Please use `.load` to do this.",
                ephemeral: true
            })

            let OldComponent = interaction.message.components[0];
            OldComponent.components[0].disabled = true
            OldComponent.components[1].disabled = true
            OldComponent.components[2].disabled = false
            await interaction.message.edit({
                components: [OldComponent]
            })

            await interaction.deferReply();
            await AccountLoading.getLoadingStatus(async function (Loading) {
                if (Loading) {

                    await interaction.editReply({
                        content: `<@!${interaction.user.id}> -  Bots are already being loaded.`
                    });
                    return;

                } else {

                    try {
                        credentials = JSON.parse(fs.readFileSync("./Accounts.json"));
                    } catch (error) {
                        return console.log(error)
                    }

                    setTimeout(async function () {
                        await AccountLoading.startUp(interaction, {
                            multiple: true,
                            loaded: {
                                amount: credentials.length - loggedIn.length,
                                currentlyLoaded: 0
                            }
                        })
                    }, 100)
                }
            })
        })
    }
}