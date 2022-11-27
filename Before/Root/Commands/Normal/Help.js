const fs = require("fs");

module.exports = {
    name: 'help',
    aliases: ["h"],
    run: async (client, message, args, Discord) => {
        fs.readFile("./Settings.json", "utf8", function (err, data) {
            var s = JSON.parse(data);


            const row = new Discord.MessageActionRow().addComponents(
                new Discord.MessageSelectMenu()
                .setCustomId('Help_Menu')
                .setPlaceholder('Choose a help Category')
                .addOptions([{
                        label: 'Main Commands',
                        value: 'main',
                        description: 'View All Main Commands',
                        emoji: "🗣️"
                    },
                    {
                        label: "Bot Commands",
                        value: "bot",
                        description: "View Bot Commands",
                        emoji: "📰"
                    },
                    {
                        label: "Plugins",
                        value: "plugins",
                        description: "View Plugins",
                        emoji: "⚙️"
                    },

                ])
            )

            const button = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                    .setLabel('Discord Support')
                    .setStyle('LINK')
                    .setURL('https://google.com')
                )


            let embed = new Discord.MessageEmbed()
                .setColor(s.embedColor)
                .setTitle("Help Menu", 'https://myminecraftbot.com/images/Headshot.png')
                .setDescription("Commands are split into four different categories. \nPlease select one of the categories by using the dropdown menu beneath.")
                .setFooter(message.author.tag, message.author.displayAvatarURL())

            message.channel.send({
                embeds: [embed],
                components: [row, button]
            })

        })
    }
}