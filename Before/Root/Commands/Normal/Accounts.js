const AccountLoading = require("../Functions/AccountLoading.js")
const fs = require("fs");


module.exports = {
    name: 'accounts',
    aliases: ["a", "e"],
    run: async (client, message, args, Discord) => {
        fs.readFile("./Settings.json", "utf8", function (err, data) {
            var s = JSON.parse(data);
            let loggedIn = AccountLoading.loggedIn;

            const buttons = new Discord.MessageActionRow().addComponents(
                    new Discord.MessageButton()
                    .setCustomId('AddAccount')
                    .setLabel('Add Accounts')
                    .setStyle('SUCCESS'),
                )
                .addComponents(
                    new Discord.MessageButton()
                    .setCustomId('RemoveAccount')
                    .setLabel('Remove Account')
                    .setStyle('PRIMARY'),
                );

            const AddButton = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                    .setCustomId('AddAccount')
                    .setLabel('Add Accounts')
                    .setStyle('SUCCESS'),
                )


            let loadedEmails = [];
            loggedIn.forEach((data) => {
                loadedEmails.push(data.email)
            })

            var accountArray;
            try {
                accountArray = JSON.parse(fs.readFileSync("./Accounts.json"));
            } catch (err) {
                console.log(err)
            }

            const noAccounts = new Discord.MessageEmbed()
                .setColor(s.embedColor)
                .setTitle("Accounts")
                .setDescription("You've currently got no accounts stored. To add accounts either manually add them to your Accounts.json file, or use the button below.")
                .setThumbnail('https://myminecraftbot.com/images/Headshot.png')
                .setFooter(message.author.tag)
            if (!accountArray.length) return message.channel.send({
                embeds: [noAccounts],
                components: [AddButton]
            })


            let accountString = "";
            let current = 1;
            let finished = false;
            accountArray.forEach((data, i) => {
                if (finished) return;
                if (accountString.length > 950) {
                    accountString = accountString + `\n🔔 *And ${accountArray.length - i} more...*`
                    finished = true;
                } else {

                    if (loadedEmails.includes(data.username)) {
                        accountString = accountString + `\n:green_circle: **${current}**. ${data.username}`
                    } else {
                        accountString = accountString + `\n:red_circle: **${current}**. ${data.username}`
                    }
                    current++;

                }
            })

            const accountEmbed = new Discord.MessageEmbed()
                .setColor(s.embedColor)
                .setTitle("Accounts")
                .setDescription("Accounts currently added in the Accounts.json file. Accounts marked with a green circle are currently loaded, whereas accounts with a red cirle, are not.")
                .addField("Accounts:", accountString)
                .setThumbnail('https://myminecraftbot.com/images/Headshot.png')
                .setFooter(message.author.tag)
            message.channel.send({
                embeds: [accountEmbed],
                components: [buttons]
            });

        })
    }
}