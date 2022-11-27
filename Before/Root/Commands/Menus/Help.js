const Discord = require('discord.js');
const fs = require("fs");

module.exports = {
    name: "Help_Menu",
    run: async (client, interaction, container) => {
        fs.readFile("./Settings.json", "utf8", function (err, data) {
            var s = JSON.parse(data);

            if (interaction.user.tag !== interaction.message.embeds[0].footer.text) return interaction.reply({
                content: "Please use `.help` to do this.",
                ephemeral: true
            })


            const mainCommands = new Discord.MessageEmbed()
                .setColor(s.embedColor)
                .setTitle('Main Commands')
                .setDescription(`*Arguments surrounded by \`[ ]\` are required, whereas \`< >\` are optional.*\n\n` +
                    `🔹 \`.help\`\n⤷  **Usage:** .help\n⤷  **Desc:** Opens the main help menu.\n\n` +

                    `🔹 \`.settings\`\n⤷  **Usage:** .settings\n⤷  **Desc:** Open setting to customize the bot to your liking.\n\n` +                    

                    `🔹 \`.Load\`\n⤷  **Usage:** .load <amount>\n⤷  **Desc:** Loads accounts listed within ".accounts". If no amount is set, all accounts will attempt to login.\n\n` +

                    `🔹 \`.Accounts\`\n⤷  **Usage:** .accounts\n⤷  **Desc:** Displays account list. Accounts marked with green are currently logged in.\n\n` +

                    `🔹 \`.List\`\n⤷  **Usage:** .list\n⤷  **Desc:** Displays accounts that are currently logged in. Beneath is an image with the accounts' heads.\n\n` +

                    `🔹 \`.Select\`\n⤷  **Usage:** .select [number]\n⤷  **Desc:** Selects an account. An accounts number is seen using the ".list" command.\n\n`)
                .setFooter(interaction.message.embeds[0].footer.text, interaction.user.displayAvatarURL({
                    dynamic: true
                }))

            const botCommands = new Discord.MessageEmbed()
                .setColor(s.embedColor)
                .setTitle('Bot Commands')
                .setDescription(`*Arguments surrounded by \`[ ]\` are required, whereas \`< >\` are optional.*\n\n` +
                    `🔹 \`.Chat\`\n⤷  **Usage:** .chat [message]\n⤷  **Desc:** Have your selected bot(s) write a specific message in chat.\n\n` +

                    `🔹 \`.Leave\`\n⤷  **Usage:** .leave\n⤷  **Desc:** Have your selected bot(s) leave.\n\n` +

                    `🔹 \`.Move\`\n⤷  **Usage:** .move\n⤷  **Desc:** Have your selected bot(s) move block by block using buttons.\n\n` +

                    `🔹 \`.Sandbot\`\n⤷  **Usage:** .sandbot\n⤷  **Desc:** Have your selected bot(s) print sand.\n\n` +

                    `🔹 \`.Follow\`\n⤷  **Usage:** .follow [player]\n⤷  **Desc:** Make your selected bot(s) follow the specified player around.\n\n` +

                    `🔹 \`.Unfollow\`\n⤷  **Usage:** .unfollow\n⤷  **Desc:** Make your selected bot(s) stop following.\n\n` +

                    `🔹 \`.Farm\`\n⤷  **Usage:** .farm\n⤷  **Desc:** Have one bot farm a specific crop and deposit in a specific chest.\n\n` +

                    `🔹 \`.View\`\n⤷  **Usage:** .view [N, E, S, W]\n⤷  **Desc:** Have one bot send a screenshot of their view in a specific direction.`)
                .setFooter(interaction.message.embeds[0].footer.text, interaction.user.displayAvatarURL({
                    dynamic: true
                }))

            const Plugins = new Discord.MessageEmbed()
                .setColor(s.embedColor)
                .setTitle('Plugins')
                .setDescription(`` +
                    `🔹 \`.Link\`\n⤷ Coming soon!\n\n` +

                    `🔹 \`.Purchase\`\n⤷ Coming soon!\n\n`)
                .setFooter(interaction.message.embeds[0].footer.text, interaction.user.displayAvatarURL({
                    dynamic: true
                }))


            let menuComponent = interaction.message.components[0]
            menuComponent.components[0].options.forEach((data) => {
                data.default = false;
            })

            if (interaction.values[0] == 'main') {

                menuComponent.components[0].options[0].default = true;
                interaction.update({
                    embeds: [mainCommands],
                    components: [menuComponent, interaction.message.components[1]]
                })

            } else if (interaction.values[0] == 'bot') {

                menuComponent.components[0].options[1].default = true;
                interaction.update({
                    embeds: [botCommands],
                    components: [menuComponent, interaction.message.components[1]]
                })

            } else if (interaction.values[0] == 'plugins') {

                menuComponent.components[0].options[2].default = true;
                interaction.update({
                    embeds: [Plugins],
                    components: [menuComponent, interaction.message.components[1]]
                })
            }
        })
    }
}