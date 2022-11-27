const AccountLoading = require("../Functions/AccountLoading.js")
const fs = require("fs");

module.exports = {
    name: "loadOneAccounts",
    run: async(client, interaction, Discord) => {
        fs.readFile("./Settings.json", "utf8", async function (err, data) {
            var s = JSON.parse(data);
            let loggedIn = AccountLoading.loggedIn;

            if(interaction.user.tag !== interaction.message.embeds[0].footer.text) return interaction.reply({content: "Please use `.load` to do this.", ephemeral: true})

            let OldComponent = interaction.message.components[0];
            OldComponent.components[0].disabled = true
            OldComponent.components[1].disabled = true
            OldComponent.components[2].disabled = true
            await interaction.message.edit({
                components: [OldComponent]
            })

            await interaction.deferReply();
            await AccountLoading.getLoadingStatus(async function(Loading){
                if(Loading){

                    await interaction.editReply({content: `<@!${interaction.user.id}> -  Bots are already being loaded.`});
                    return;

                } else {

                    setTimeout(async function(){
                        await AccountLoading.startUp(interaction, {multiple: false, loaded: {amount: 0, currentlyLoaded: 0}})
                    }, 100)
                }
            })
        })
    }
}