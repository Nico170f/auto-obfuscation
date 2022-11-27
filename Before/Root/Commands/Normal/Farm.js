const mineflayer = require('mineflayer');
const {
    pathfinder,
    Movements,
    goals
} = require('mineflayer-pathfinder');
const GoalFollow = goals.GoalFollow;
const AccountLoading = require("../Functions/AccountLoading.js")
const fs = require("fs");

const navigatePlugin = require('mineflayer-navigate')(mineflayer);

module.exports = {
    name: 'farm',
    aliases: ["farming"],
    run: async (client, message, args, Discord) => {
        fs.readFile("./Settings.json", "utf8", function (err, data) {
            var s = JSON.parse(data);
            let loggedIn = AccountLoading.loggedIn;

            let noneOnline = new Discord.MessageEmbed()
            .setColor(s.embedColor)
            .setDescription("No bots are currently loaded.")
            if (!loggedIn.length) return message.channel.send({embeds: [noneOnline]})

            let botsSelected = 0;
            let bot;
            loggedIn.forEach((data) => {
                if (data.selected) {
                    bot = data;
                    botsSelected++;
                }
            })


            let noneSelected = new Discord.MessageEmbed()
                .setColor(s.embedColor)
                .setDescription("No bots are currently selected! Use `.select` to select an account.")
            if (botsSelected == 0) return message.channel.send({
                embeds: [noneSelected]
            });

            let tooMany = new Discord.MessageEmbed()
                .setColor(s.embedColor)
                .setDescription("Please only select one account to use this command.")
            if (botsSelected > 1) return message.channel.send({
                embeds: [tooMany]
            });

            let alreadyOccupied = new Discord.MessageEmbed()
                .setColor(s.embedColor)
                .setDescription(`${bot.username} is curretly occupied doing a different task.`)
            if (bot.occupation.currentlyOccupied == true && bot.occupation.farming.currentlyFarming == false) return message.channel.send({
                embeds: [alreadyOccupied]
            })

            let MenuItems = [{
                label: "Wheat",
                emoji: "🌾"
            }, {
                label: "Carrots",
                emoji: "🥕"
            }, {
                label: "Potatoes",
                emoji: "🥔"
            }, {
                label: "Pumpkins",
                emoji: "🎃"
            }, {
                label: "Melons",
                emoji: "🍉"
            }, ]

            const cropMenu = new Discord.MessageActionRow().addComponents(
                new Discord.MessageSelectMenu()
                .setCustomId('ChooseCrop-Menu')
                .setPlaceholder('Select the crop you wish to farm.')
            )

            MenuItems.forEach((data) => {
                if(data.label.toLowerCase().includes(bot.occupation.farming.crop.split("s")[0]) || data.label.toLowerCase().includes(bot.occupation.farming.crop.replace("_block", "s"))){

                    cropMenu.components[0].addOptions([{
                        label: data.label,
                        value: data.label,
                        description: "Farm " + data.label,
                        emoji: data.emoji,
                        default: true
                    }])

                } else {

                    cropMenu.components[0].addOptions([{
                        label: data.label,
                        value: data.label,
                        description: "Farm " + data.label,
                        emoji: data.emoji,
                    }])
                }
            })



            const farmControl = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                    .setCustomId('farmingStartButton')
                    .setLabel('Start Farming')
                    .setStyle('SUCCESS')
                    .setDisabled(false),
                ).addComponents(
                    new Discord.MessageButton()
                    .setCustomId('farmingStopButton')
                    .setLabel('Stop Farming')
                    .setStyle('DANGER')
                    .setDisabled(true),
                ).addComponents(
                    new Discord.MessageButton()
                    .setCustomId('farmingDepositChestButton')
                    .setLabel('Set Deposit Chest')
                    .setStyle('PRIMARY')
                    .setDisabled(false),
                )

                if (bot.occupation.farming.currentlyFarming){
                    console.log(farmControl.components[0])
                    farmControl.components[0].setDisabled(true)
                    farmControl.components[1].setDisabled(false)
                    farmControl.components[2].setDisabled(true)
                }


                    let farmEmbed = new Discord.MessageEmbed()
                        .setColor(s.embedColor)
                        .setAuthor({
                            name: "Farm using: " + bot.username,
                            iconURL: `http://cravatar.eu/head/${bot.username}/32.png`
                        })
                        .setDescription(`Select the crop type in the menu beneath and use the buttons to start farming. \n\n` +
                        `🔸 \`Deposit Chest\`\n⤷  **Coords:** ${bot.occupation.farming.depositCoords}`
                        )
                            //`Currently Farming: \`${bot.occupation.farming.currentlyFarming}\`\n` +
                            //`Current Crop: \`${bot.occupation.farming.crop}\`\n` +
                            //`Deposit Chest Coords: \`${bot.occupation.farming.depositCoords}\`\n`)
                        .setFooter(`${message.author.tag}`)
                        .setThumbnail(`https://mc-heads.net/player/${bot.username}`)



            message.channel.send({
                embeds: [farmEmbed],
                components: [cropMenu, farmControl]
            })

        })
    }
}