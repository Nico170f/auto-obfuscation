const fs = require("fs");
const AccountLoading = require('../Functions/AccountLoading.js');


module.exports = {
    name: "AddAccount",
    ownerOnly: true,
    run: async (client, interaction, Discord) => {
        fs.readFile("./Settings.json", "utf8", function (err, data) {
            var setting = JSON.parse(data);
            var loggedIn = AccountLoading.loggedIn;

            if (interaction.user.tag !== interaction.message.embeds[0].footer.text) return interaction.reply({
                content: "Please use `.accounts` to do this.",
                ephemeral: true
            })

            let embed = interaction.message.embeds[0];
            let embedComponents = interaction.message.components;
            interaction.message.edit({
                embeds: [embed],
                components: []
            });

            let responseEmbed = new Discord.MessageEmbed()
                .setTitle("Add Accounts")
                .setColor(setting.embedColor)
                .setDescription("Please reply to the message using the following format: ```\n\nEmail1:Password\nEmail2:Password\nEmail3:Password\n...```")
            //.setFooter(interaction.user.tag)

            let accountArray;
            try {
                accountArray = JSON.parse(fs.readFileSync("./Accounts.json"));
            } catch (err) {
                console.log(err)
            }

            let loadedEmails = [];
            loggedIn.forEach((data) => {
                loadedEmails.push(data.email)
            })

            const filter = i => i.author.id === interaction.user.id;
            interaction.reply({
                    embeds: [responseEmbed],
                    ephemeral: false
                }, {
                    fetchReply: true
                })
                .then(() => {

                    interaction.channel.awaitMessages({
                            filter,
                            max: 1,
                            time: 30000,
                            errors: ['time']
                        })
                        .then(collected => {

                            let accountsCollected = collected.first().content.split("\n");

                            for (var i in accountsCollected) {
                                let entry = accountsCollected[i].split(":");
                                let account = {
                                    "username": entry[0],
                                    "password": entry[1]
                                }
                                try {
                                    accountArray.push(account)
                                } catch (error) {
                                    console.log(error)
                                }
                            }

                            fs.writeFile('./Accounts.json', JSON.stringify(accountArray, null, 1), 'utf8', function (err) {
                                if (err) {
                                    interaction.followUp({
                                        content: 'Error, check console.',
                                        ephemeral: true
                                    });
                                    throw err;
                                } else {


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
                                        .setColor(setting.embedColor)
                                        .setTitle("Accounts")
                                        .setDescription("Accounts currently added in the Accounts.json file. Accounts marked with a green circle are currently loaded, whereas accounts with a red cirle, are not.")
                                        .addField("Accounts:", accountString)
                                        .setThumbnail('https://myminecraftbot.com/images/Headshot.png')
                                        .setFooter(interaction.user.tag)


                                    if (embedComponents[0].components.length == 1) {

                                        embedComponents[0].addComponents(
                                            new Discord.MessageButton()
                                            .setCustomId('RemoveAccount')
                                            .setLabel('Remove Account')
                                            .setStyle('PRIMARY'),
                                        );

                                        interaction.message.edit({
                                            embeds: [accountEmbed],
                                            components: [embedComponents[0]]
                                        })
                                    } else {
                                        interaction.message.edit({
                                            embeds: [accountEmbed],
                                            components: [embedComponents[0]]
                                        })
                                    }

                                    interaction.deleteReply()
                                    collected.first().delete();

                                }
                            })

                        })
                        .catch(collected => {
                            console.log(collected)
                            interaction.followUp({
                                content: 'Timed out.',
                                ephemeral: true
                            });
                        });
                });
        })
    }
}