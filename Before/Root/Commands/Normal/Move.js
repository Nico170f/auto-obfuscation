const mineflayer = require('mineflayer');
const c = require("chalk");
const AccountLoading = require("../Functions/AccountLoading.js")

const fs = require("fs");
var Vec3 = require('vec3').Vec3;

module.exports = {
    name: 'move',
    aliases: ["movee"],
    run: async (client, message, args, Discord) => {
        fs.readFile("./Settings.json", "utf8", function (err, data) {
            var s = JSON.parse(data);
            let loggedIn = AccountLoading.loggedIn;

            let selected = [];
            loggedIn.forEach((data) => {
                if (data.selected) {
                    selected.push(data);
                }
            })

            let noAccounts = new Discord.MessageEmbed()
                .setColor(s.embedColor)
                .setDescription("No bots are currently selected! Use `.select` to select atleast one account.")
            if (selected.length < 1) return message.channel.send({
                embeds: [noAccounts]
            });

            const row1 = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                    .setCustomId('moveJumpButton')
                    .setLabel('Jump')
                    .setStyle('SECONDARY'),
                ).addComponents(
                    new Discord.MessageButton()
                    .setCustomId('moveFrontButton')
                    .setLabel('Front')
                    .setStyle('PRIMARY'),
                ).addComponents(
                    new Discord.MessageButton()
                    .setCustomId('moveShiftButton')
                    .setLabel('Sneak')
                    .setStyle('SECONDARY'),
                );

            const row2 = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                    .setCustomId('moveLeftButton')
                    .setLabel('Left')
                    .setStyle('PRIMARY'),
                ).addComponents(
                    new Discord.MessageButton()
                    .setCustomId('moveBackwardButton')
                    .setLabel('Back')
                    .setStyle('PRIMARY'),
                ).addComponents(
                    new Discord.MessageButton()
                    .setCustomId('moveRightButton')
                    .setLabel('Right')
                    .setStyle('PRIMARY'),
                )

            let moveEmbed = new Discord.MessageEmbed()
                .setColor(s.embedColor)
                .setFooter(message.author.tag)

            if (selected.length == 1) {
                moveEmbed.setAuthor({
                        name: "Move Bot",
                        iconURL: `http://cravatar.eu/head/${selected[0].username}/32.png`
                    })
                    .setDescription(`Bot: **${selected[0].username}**\nUse the buttons beneath to move it accordingly.`)
                    .setThumbnail(`https://mc-heads.net/player/${selected[0].username}`)
            } else {
                moveEmbed.setAuthor({
                        name: "Move Bot",
                        iconURL: 'https://myminecraftbot.com/images/Headshot.png'
                    })
                    .setDescription(`**${selected.length}** bots selecetd.\nUse the buttons beneath to move them accordingly.`)
                    .setThumbnail('https://myminecraftbot.com/images/Headshot.png')
            }

            selected.forEach((data) => {
                let bot = data.botUser;



                let yaw = parseInt(bot.entity.yaw.toString().split(".")[0]);
                //!Fix this
                //!Fix this
                //!Fix this
                //!Fix this
                //!Fix this
                


                if (yaw > -45 && yaw < 45) {
                    bot.lookAt(new Vec3(bot.entity.position.x, bot.entity.position.y + 1.6, bot.entity.position.z + 1), false)
                } else if (yaw > 45 && yaw < 135) {
                    bot.lookAt(new Vec3(bot.entity.position.x - 1, bot.entity.position.y + 1.6, bot.entity.position.z), false)
                } else if (yaw > -135 && yaw < -45) {
                    bot.lookAt(new Vec3(bot.entity.position.x + 1, bot.entity.position.y + 1.6, bot.entity.position.z), false)
                } else {
                    bot.lookAt(new Vec3(bot.entity.position.x, bot.entity.position.y + 1.6, bot.entity.position.z - 1), false)
                }

            })


            message.channel.send({
                embeds: [moveEmbed],
                components: [row1, row2]
            });

        })
    }
}