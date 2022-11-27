module.exports = {
    name: "configUpdate",
    run: async (client, interaction, Discord) => {

        if(interaction.user.tag !== interaction.message.embeds[0].footer.text) return interaction.reply({content: "Please use `.settings` to do this.", ephemeral: true})

        const buttons = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
            .setCustomId('CancelSettingUpdate')
            .setLabel('Cancel')
            .setStyle('SECONDARY'),
        )

        if(interaction.message.embeds[0].title.toLowerCase().includes("proxy")){

            const row = new Discord.MessageActionRow().addComponents(
                new Discord.MessageSelectMenu()
                .setCustomId('Proxy-Update')
                .setPlaceholder('Select the setting you want to update.')
                .addOptions([
                    {
                        label: 'Use Proxies',
                        value: 'Use Proxies',
                        description: 'Choose whether bots should login using proxies or not.',
                        emoji: '🔹',

                    },
                    {
                        label: "Randomize Order",
                        value: "Randomize Order",
                        description: 'Choose whether proxies should be randomized or not.',
                        emoji: '🔹'
                    },
                    {
                        label: "Accounts Per Proxy",
                        value: "Accounts Per Proxy",
                        description: 'Choose the accounts used per proxy. Ignored if "Randomize Order" is true.',
                        emoji: '🔹'
                    }
                ])
                )

            let nextUpdateEmbed2 = interaction.message.embeds[0];

            nextUpdateEmbed2.setDescription(interaction.message.embeds[0].description + `\n\n⬇️⬇️⬇️\n**UPDATE**\nPlease choose the module you want to update from the dropdown menu.`)

            interaction.update({embeds: [nextUpdateEmbed2], components: [row, buttons]})

        } else if(interaction.message.embeds[0].title.toLowerCase().includes("connection")){

            const row = new Discord.MessageActionRow().addComponents(
                new Discord.MessageSelectMenu()
                .setCustomId('Connection-Update')
                .setPlaceholder('Select the setting you want to update.')
                .addOptions([
                    {
                        label: 'Server IP',
                        value: 'Server IP',
                        description: 'Choose the IP of which all accounts will connect to.',
                        emoji: '🔹',

                    },
                    {
                        label: "Port",
                        value: "Port",
                        description: 'Choose the port of the server. Defaults to "25565"',
                        emoji: '🔹'
                    },
                    {
                        label: "Version",
                        value: "Version",
                        description: 'Choose the Minecraft version of the server.',
                        emoji: '🔹'
                    },
                    {
                        label: "Join Command",
                        value: "Join Command",
                        description: 'Choose an optional join command. Eg. "/spawn". If set to "none", no join command will be used.',
                        emoji: '🔹'
                    },
                    {
                        label: "Join Speed",
                        value: "Join Speed",
                        description: 'Choose the join speed between accounts.',
                        emoji: '🔹'
                    },
                    {
                        label: "Max Accounts",
                        value: "Max Accounts",
                        description: 'Choose the max amount of accounts. Use "-1" for unlimited.',
                        emoji: '🔹'
                    },
                    {
                        label: "Throttling Delay",
                        value: "Throttling Delay",
                        description: 'Choose a delay to use if accounts are throttled.',
                        emoji: '🔹'
                    }
                ])
                )

            let nextUpdateEmbed2 = interaction.message.embeds[0];

            nextUpdateEmbed2.setDescription(interaction.message.embeds[0].description + `\n\n⬇️⬇️⬇️\n**UPDATE**\nPlease choose the module you want to update from the dropdown menu.`)

            interaction.update({embeds: [nextUpdateEmbed2], components: [row, buttons]})

        } else if(interaction.message.embeds[0].title.toLowerCase().includes("discord")){


            const row = new Discord.MessageActionRow().addComponents(
                new Discord.MessageSelectMenu()
                .setCustomId('Discord-Update')
                .setPlaceholder('Select the setting you want to update.')
                .addOptions([
                    {
                        label: 'Embed Color',
                        value: 'Embed Color',
                        description: 'Choose the embed color of all messages.',
                        emoji: '🔹',
                    },
                    {
                        label: "Permissions Role",
                        value: "Permissions Role",
                        description: 'Choose the role with permissions to use the bot.',
                        emoji: '🔹'
                    },
                    {
                        label: "Ingame Chat Logging",
                        value: "Ingame Chat Logging",
                        description: 'Choose weather or not to log the ingame chat.',
                        emoji: '🔹'
                    },
                    {
                        label: "Ingame Chat Logging Channel",
                        value: "Ingame Chat Logging Channel",
                        description: 'Choose a channel to log the ingame chat. Ignored if "Ingame Chat Logging" is false.',
                        emoji: '🔹'
                    },
                    {
                        label: "Error Logging",
                        value: "Error Logging",
                        description: 'Choose weather or not to log bot errors.',
                        emoji: '🔹'
                    },
                    {
                        label: "Error Logging Channel",
                        value: "Error Logging Channel",
                        description: 'Choose a channel post bot errors in. Ignored if "Error Logging" is false.',
                        emoji: '🔹'
                    }
                ])
                )

            let nextUpdateEmbed2 = interaction.message.embeds[0];

            nextUpdateEmbed2.setDescription(interaction.message.embeds[0].description + `\n\n⬇️⬇️⬇️\n**UPDATE**\nPlease choose the module you want to update from the dropdown menu.`)

            interaction.update({embeds: [nextUpdateEmbed2], components: [row, buttons]})

        }  else if(interaction.message.embeds[0].title.toLowerCase().includes("farming")){


            const row = new Discord.MessageActionRow().addComponents(
                new Discord.MessageSelectMenu()
                .setCustomId('Farming-Update')
                .setPlaceholder('Select the setting you want to update.')
                .addOptions([
                    {
                        label: 'Farming Speed',
                        value: 'Farming Speed',
                        description: 'Speed of which the bot checks for grown crops. Default: 50.',
                        emoji: '🔹',
                    },
                    {
                        label: 'Farming Radius',
                        value: 'Farming Radius',
                        description: 'Radius of which the bot will search for crops. Default: 50.',
                        emoji: '🔹',
                    },
                    {
                        label: 'Deposit Chest Coords',
                        value: 'Deposit Chest Coords',
                        description: 'Coords of chest for depositing. Default: Auto',
                        emoji: '🔹',
                    },
                    {
                        label: 'Crops Till Deposit',
                        value: 'Crops Till Deposit',
                        description: 'Amount of crops the bot will hold before depositing them. Default: 16',
                        emoji: '🔹',
                    },
                    {
                        label: 'Farm Coords',
                        value: 'Farm Coords',
                        description: 'Two coordinates, defining the farm borders. Default: Null',
                        emoji: '🔹',
                    },

                ])
                )

            let nextUpdateEmbed2 = interaction.message.embeds[0];

            nextUpdateEmbed2.setDescription(interaction.message.embeds[0].description + `\n\n⬇️⬇️⬇️\n**UPDATE**\nPlease choose the module you want to update from the dropdown menu.`)

            interaction.update({embeds: [nextUpdateEmbed2], components: [row, buttons]})

        }   else if(interaction.message.embeds[0].title.toLowerCase().includes("bot")){


            const row = new Discord.MessageActionRow().addComponents(
                new Discord.MessageSelectMenu()
                .setCustomId('Bot-Update')
                .setPlaceholder('Select the setting you want to update.')
                .addOptions([
                    {
                        label: 'Render Distance',
                        value: 'Render Distance',
                        description: 'Bot\'s render distance. Lower is better performance. Default: normal',
                        emoji: '🔹',
                    },
                    {
                        label: 'Auto Select Bots',
                        value: 'Auto Select Bots',
                        description: 'Automatically select all bots. Default: false',
                        emoji: '🔹',
                    },
                    {
                        label: 'Auto Eat',
                        value: 'Auto Eat',
                        description: 'Automatically eat food. Default: false',
                        emoji: '🔹',
                    },
                    {
                        label: 'Follow Speed',
                        value: 'Follow Speed',
                        description: 'The speed of which the bot(s) update player position. Default: 300',
                        emoji: '🔹',
                    }

                ])
                )

            let nextUpdateEmbed2 = interaction.message.embeds[0];

            nextUpdateEmbed2.setDescription(interaction.message.embeds[0].description + `\n\n⬇️⬇️⬇️\n**UPDATE**\nPlease choose the module you want to update from the dropdown menu.`)

            interaction.update({embeds: [nextUpdateEmbed2], components: [row, buttons]})

        } else if(interaction.message.embeds[0].title.toLowerCase().includes("printing")) {

            const row = new Discord.MessageActionRow().addComponents(
                new Discord.MessageSelectMenu()
                .setCustomId('Printing-Update')
                .setPlaceholder('Select the setting you want to update.')
                .addOptions([
                    {
                        label: 'Guider Block',
                        value: 'Guider Block',
                        description: 'xxxx',
                        emoji: '🔹',
                    },
                    {
                        label: 'Guider Block Range',
                        value: 'Guider Block Range',
                        description: 'xxxxx',
                        emoji: '🔹',
                    },
                    {
                        label: 'Max Guider Blocks',
                        value: 'Max Guider Blocks',
                        description: 'xxxx',
                        emoji: '🔹',
                    },
                    {
                        label: 'Printing Gamemode',
                        value: 'Printing Gamemode',
                        description: 'xxxx',
                        emoji: '🔹',
                    },
                    {
                        label: 'Printing Speed',
                        value: 'Printing Speed',
                        description: 'xxxx',
                        emoji: '🔹',
                    }

                ])
                )

            let nextUpdateEmbed2 = interaction.message.embeds[0];

            nextUpdateEmbed2.setDescription(interaction.message.embeds[0].description + `\n\n⬇️⬇️⬇️\n**UPDATE**\nPlease choose the module you want to update from the dropdown menu.`)

            interaction.update({embeds: [nextUpdateEmbed2], components: [row, buttons]})

        }else {
            interaction.reply({content: "Something went wrong.", ephemeral: true})
        }


    }
}