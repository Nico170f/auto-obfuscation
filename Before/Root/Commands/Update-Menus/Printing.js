const Discord = require('discord.js');
const fs = require("fs");
const Updater = require('./Updater.js')
const updateConfig = Updater.updateFile;

const getEmbedFile = require('../Functions/GetEmbed.js');
const getEmbed = getEmbedFile.getSettingsEmbed;
const getMenu = getEmbedFile.getSettingsMenu;

const CancelFile = require('../Buttons/CancelSettingUpdate.js');
const Cancel = CancelFile.cancel;

async function resetEmbed(interaction, collected) {
    await getEmbed(interaction.user.tag, async function () {
        await getMenu("Printing", async function (){
            if(collected.first()) collected.first().delete();            
            interaction.message.edit({
                embeds: [getEmbedFile.Embeds.PrintingEmbed],
                components: [getEmbedFile.Menus.SettingsMenu, getEmbedFile.Buttons.UpdateCategory]
    
            })
        })
    })
}

async function followUP(interaction, content) {
    interaction.followUp({
        content: content,
        ephemeral: false
    }).then(message => {
        setTimeout(function () {
            message.delete()
        }, 3000)
    })
}

module.exports = {
    name: "Printing-Update",
    run: async (client, interaction, container) => {
        fs.readFile("./Settings.json", "utf8", function (err, data) {
            var s = JSON.parse(data);

            if (interaction.user.tag !== interaction.message.embeds[0].footer.text) return interaction.reply({
                content: "Please use `.settings` to do this.",
                ephemeral: true
            })

            let allowedResponse;
            let current = null;
            console.log(interaction.values[0])
            switch (interaction.values[0]) {

                case "Guider Block":
                    allowedResponse = ["String"]
                    current = s.guiderBlock;
                    break;

                case "Guider Block Range":
                    allowedResponse = ["Number"]
                    current = s.findGuiderBlockRange;
                    break;

                case "Max Guider Blocks":
                    allowedResponse = ["Number"]
                    current = s.maxGuiderBlocks;
                    break;

                case "Printing Gamemode":
                    allowedResponse = ["Survival", "Creative"]
                    current = s.printingGamemode;
                    break;

                case "Printing Speed":
                    allowedResponse = ["Number"]
                    current = s.farmCoords;
                    break;

                default:
                    return console.log("Error updating settings.")

            }

            let embed = interaction.message.embeds[0];
            embed.setDescription(`What should **${interaction.values[0]}** be changed to? It's currently set to: \`${current}\`\n*Allowed imputs: \`${allowedResponse.toString().replace(/[|]/gi, " ").replace(/,/gi, ", ")}\`*`)

            const filter = i => i.author.id === interaction.user.id;

            interaction.update({
                    embeds: [embed],
                    components: [interaction.message.components[1]]
                }, {
                    fecthReply: true
                })
                .then(async () => {
                    interaction.channel.awaitMessages({
                            filter,
                            max: 1,
                            time: 30000,
                            errors: ['time']
                        })
                        .then(async collected => {

                            if(Cancel[0]){
                                if (Cancel[0].userID == interaction.user.id ) {
                                    if(Math.floor(Date.now() - Cancel[0].time / 1000) > 30) {
                                        return Cancel.splice(0);
                                    } else {
                                        Cancel.splice(0);
                                    }
                                }
                            }

                            let response = collected.first().content;
                            let valid = false;

                            if (allowedResponse[0].toLowerCase() != "number") {

                                if(allowedResponse[0].toLowerCase() != "string"){

                                    allowedResponse.forEach((data) => {
                                        if (data.toLowerCase() == response.toLowerCase()) {
                                            valid = true;
                                        }
                                    })
    
                                    if (!valid) {
                                        resetEmbed(interaction, collected);
                                        return followUP(interaction, "Invalid imput.");
                                    }
    
                                    if (response.toLowerCase() == "true" || response.toLowerCase() == "false") response = (response === 'true');
    
                                }


                            } else {

                                if (isNaN(response)) {
                                    resetEmbed(interaction, collected);
                                    return followUP(interaction, "Invalid imput - Please enter a number.");
                                }

                                response = parseInt(response);

                            }


                            try {
                                updateConfig(interaction.values[0], response, function () {
                                    resetEmbed(interaction, collected);
                                    return followUP(interaction, `Successfully updated \`${interaction.values[0]}\` to: **${collected.first().content}**`);
                                })
                            } catch (error) {
                                return console.log(error)
                            }

                        })
                        .catch(collected => {
                            resetEmbed(interaction, collected);
                            return followUP(interaction, "Timed out.");
                        });
                });
        })
    }
}