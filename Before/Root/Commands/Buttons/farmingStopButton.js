const AccountLoading = require('../Functions/AccountLoading.js').loggedIn;

module.exports = {
    name: "farmingStopButton",
    run: async(client, interaction, Discord) => {
        fs.readFile("./Settings.json", "utf8", function (err, data) {
            var s = JSON.parse(data);
            let loggedIn = AccountLoading.loggedIn;


            if (interaction.user.tag !== interaction.message.embeds[0].footer.text) return interaction.reply({
                content: "Please use `.farm` to do this.",
                ephemeral: true
            })

            if (!loggedIn.length) return interaction.reply({
                content: "No bots are currently loaded.",
                ephemeral: true
            })

            let bot;
            loggedIn.forEach((data) => {
                if (data.username == interaction.message.embeds[0].author.name.split(": ")[1]) {
                    bot = data;
                }
            })

            if(!bot) return interaction.reply({
                content: `Bot: **${interaction.message.embeds[0].author.name.split(": ")[1]}** is not online.`,
                ephemeral: true
            })
            
        
            if(!bot.occupation.farming.currentlyFarming) return interaction.reply({
                content: `Bot: **${bot.username}** is not currently farming.`,
                ephemeral: true
            })
        
            bot.occupation.farming.currentlyFarming = false;


            let ControlButtons = interaction.message.components[1];
            ControlButtons.components[0].setDisabled(false);
            ControlButtons.components[1].setDisabled(true);
            ControlButtons.components[2].setDisabled(false);


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
            .setFooter(`${interaction.user.tag}`)
            .setThumbnail(`https://mc-heads.net/player/${bot.username}`)


            interaction.update({embeds: [farmEmbed], components: [interaction.message.components[0], ControlButtons]})



        })
    }
}