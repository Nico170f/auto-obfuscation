const AccountLoading = require('../Functions/AccountLoading.js');
const fs = require("fs");

module.exports = {
    name: "confirmSelectOrDeselectAllAccountsButton",
    run: async (client, interaction, Discord) => {
        fs.readFile("./Settings.json", "utf8", async function (err, data) {
        var s = JSON.parse(data);
        var loggedIn = AccountLoading.loggedIn;
        
        if(interaction.user.tag !== interaction.message.embeds[0].footer.text) return interaction.reply({content: "Please use `.select` to do this.", ephemeral: true})
        if(loggedIn.length < 1) return interaction.reply({content: "No bots are currently loaded.", ephemeral: true})


            if(interaction.message.embeds[0].description.toLowerCase() == "are you sure you wish to select all accounts?"){


                loggedIn.forEach((data) => {
                    
                    if(!data.selected) data.selected = true;

                })


            } else if(interaction.message.embeds[0].description.toLowerCase() == "are you sure you wish to deselect all accounts?"){

                loggedIn.forEach((data) => {
                    
                    if(data.selected) data.selected = false;

                })

            }

            let row1 = new Discord.MessageActionRow().addComponents(
                new Discord.MessageSelectMenu()
                .setCustomId('Select-Menu')
                .setPlaceholder('Select An Account')
            )
                    
            loggedIn.forEach((data) => {
                if(data.selected)
                {
    
                    row1.components[0].addOptions([{
                        label: data.username,
                        value: data.email,
                        description: data.email + " (Selected)",
                        emoji: "✅"
                    }])
    
                } else 
                {
    
                    row1.components[0].addOptions([{
                        label: data.username,
                        value: data.email,
                        description: data.email,
                        emoji: "🤖"
                    }])
    
                }
            })
    
            const row2 = new Discord.MessageActionRow().addComponents(
                new Discord.MessageButton()
                .setCustomId('selectAllAccountsButton')
                .setLabel('Select All')
                .setStyle('PRIMARY'),
                new Discord.MessageButton()
                .setCustomId('deselectAllAccountsButton')
                .setLabel('Deselect All')
                .setStyle('SECONDARY'),
            )
    
            
            let selectEmbed = new Discord.MessageEmbed()
            .setColor(s.embedColor)
            .setTitle("Select Menu")
            .setDescription("Select the account(s) you wish to manipulate.")
            .setThumbnail(interaction.guild.iconURL())
            .setFooter(interaction.user.tag)

            interaction.update({embeds: [selectEmbed], components: [row1, row2]})


        })
    }
}