const Canvas = require('canvas')
const chalk = require("chalk")
const AccountLoading = require("../Functions/AccountLoading.js")
const fs = require("fs");


module.exports = {
    name: 'status',
    aliases: ["list", "online"],
    run: async (client, message, args, Discord) => {
        fs.readFile("./Settings.json", "utf8", async function (err, data) {
        var s = JSON.parse(data);
        let loggedIn = AccountLoading.loggedIn;


        let notLoaded = new Discord.MessageEmbed()
        .setColor(s.embedColor)
        .setDescription("No bots are currently loaded.")
        if (!loggedIn.length) return message.channel.send({
            embeds: [notLoaded]
        })


        if (loggedIn.length < 3) {

            let string = "";
            loggedIn.forEach((data, i = 1) => {

                let username;
                if(data.selected){
                    username = `**${data.username}**`
                } else username = data.username;

                string = string + `${i+1 + ". " + username}\n`;
            })
            let accountembed = new Discord.MessageEmbed()
                .setColor(s.embedColor)
                .setDescription("Here's a list of accounts who successfully logged online.")
                .addField("IGNS:", string, true)

            message.channel.send({
                embeds: [accountembed]
            });

        } else {

            let column1 = "";
            let column2 = "";
            let column3 = "";

            loggedIn.forEach((data, i = 1) => {

                let username;
                if(data.selected){
                    username = `**${data.username}**`
                } else username = data.username;

                if (i < (loggedIn.length / 3)) {
                    column1 = column1 + `${i+1 + ". " + username}\n`;
                } else if ((i < (loggedIn.length / 3) * 2)) {
                    column2 = column2 + `${i+1 + ". " + username}\n`;
                } else {
                    column3 = column3 + `${i+1 + ". " + username}\n`;
                }
            })

            let accountembed = new Discord.MessageEmbed()
                .setColor(s.embedColor)
                .setDescription("Here's a list of accounts who successfully logged online.")
                .addField("IGNS:", column1, true)
                .addField("〰️", column2, true)
                .addField("〰️", column3, true)
                .setThumbnail('https://myminecraftbot.com/images/Headshot.png');

                message.channel.send({
                    embeds: [accountembed]
                });

        }


        let waitingMessage = await message.channel.send("Waiting for image...");

        const canvas = Canvas.createCanvas(352, 264);
        const context = canvas.getContext('2d');
        //const background = await Canvas.loadImage('./Root/Storage/Vault/Media/Doublechest_Background.png');
        const background = await Canvas.loadImage('http://45.140.185.240:8010/images/Doublechest_Background.png');
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        //let plusImage = await Canvas.loadImage(`./Root/Storage/Vault/Media/PlusSymbol.png`);
        let plusImage = await Canvas.loadImage(`http://45.140.185.240:8010/images/PlusSymbol.png`);

        let x = 16;
        let y = 36;
        let count = 0;
        let total = 0;
        loggedIn.forEach(function (data) {
            if (total >= 53) return context.drawImage(plusImage, 309, 221, 20, 20);
            if (count == 9) {
                y += 36;
                x = 16;
                count = 0;
            }
            context.drawImage(data.avatar, x, y, 32, 32)
            x += 36;
            count++;
            total++;
        })

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'bots.png');
        await message.channel.send({
            files: [attachment]
        })

        await waitingMessage.delete();
    })
    }
}