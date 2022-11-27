const fs = require("fs");
const {
    Vec3
} = require('vec3')

module.exports = {
    name: 'settings',
    aliases: ["s", "config", "conf", "c"],
    run: async (client, message, args, Discord) => {
        fs.readFile("./Settings.json", "utf8", function (err, data) {
            var setting = JSON.parse(data);



            const row = new Discord.MessageActionRow().addComponents(
                new Discord.MessageSelectMenu()
                .setCustomId('Settings_Menu')
                .setPlaceholder('Choose a settings Category')
                .addOptions([{
                        label: 'Connection',
                        value: 'Connection',
                        description: 'View Connection Settings',
                        emoji: "📡"
                    },
                    {
                        label: "Proxies",
                        value: "Proxies",
                        description: "View Proxy Settings",
                        emoji: "🌍"
                    },
                    {
                        label: "Discord",
                        value: "Discord",
                        description: "View Discord Settings",
                        emoji: "⚙️"
                    },
                    {
                        label: "Bot",
                        value: "Bot",
                        description: "View Bot Settings",
                        emoji: "🤖"
                    },
                    {
                        label: "Farming",
                        value: "Farming",
                        description: "View Farming Settings",
                        emoji: "🌿"
                    },
                    {
                        label: "Printing",
                        value: "Printing",
                        description: "View Printing Settings",
                        emoji: "🖨️"
                    }

                ])
            )

            const row2 = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                .setCustomId('configResetButton')
                .setLabel('Reset Settings')
                .setStyle('DANGER'),
            )



            let configStart = new Discord.MessageEmbed()
                .setColor(setting.embedColor)
                .setTitle("Settings Menu", 'https://myminecraftbot.com/images/Headshot.png')
                .setDescription(`` +
                    `Select a category beneath to view all current settings.\n` +
                    `If you wish to update a setting, simply click "Update Category".\n` +
                    `Then select the setting you wish to update and write the new value.`)
                .setFooter(message.author.tag, message.author.displayAvatarURL())
            message.channel.send({
                embeds: [configStart],
                components: [row, row2]
            })

        })

    }
}