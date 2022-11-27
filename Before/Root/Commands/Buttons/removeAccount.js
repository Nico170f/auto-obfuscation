const fs = require("fs");
const AccountLoading = require("../Functions/AccountLoading.js")
module.exports = {
    name: "RemoveAccount",
    ownerOnly: true,
    run: async (client, interaction, Discord) => {
        fs.readFile("./Settings.json", "utf8", function (err, data) {
            var setting = JSON.parse(data);
            let loggedIn = AccountLoading.loggedIn;

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
                .setTitle("Remove Accounts")
                .setColor(setting.embedColor)
                .setDescription("Please reply to the message using the following format:\n```Remove a single account: x\nRemove multiple accounts: x-x```\nExample:```Remove the first account: 1\nRemove all accounts from 1 to 5: 1-5```")

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

                            let response = collected.first().content;


                            if (!response.includes("-")) {
                                if (!isNaN(response)) {

                                    let number = parseInt(response);

                                    if (number > accountArray.length) {

                                        interaction.message.edit({
                                            embeds: [embed],
                                            components: [embedComponents[0]]
                                        })

                                        interaction.deleteReply()
                                        collected.first().delete();

                                        interaction.followUp({
                                            content: `Please enter a valid account number to remove.`
                                        }).then(message => {
                                            setTimeout(function () {
                                                message.delete()
                                            }, 2000)
                                        })

                                    } else {

                                        accountArray.splice(number - 1, 1);
                                        fs.writeFile('./Accounts.json', JSON.stringify(accountArray, null, 1), 'utf8', async function (err) {
                                            if (err) {

                                                interaction.followUp({
                                                    content: 'Error, check console.',
                                                    ephemeral: true
                                                });
                                                console.log(err)
                                                setTimeout(function () {
                                                    console.log("Closing...")
                                                }, 20000)

                                            } else {

                                                let embednew = updateMessage();

                                                await interaction.message.edit(embednew)

                                                interaction.deleteReply()
                                                collected.first().delete();

                                                const Success = new Discord.MessageEmbed()
                                                    .setColor("GREEN")
                                                    .setDescription(`Successfully removed account: \`${number}\``)


                                                interaction.followUp({
                                                    embeds: [Success]
                                                }).then(message => {
                                                    setTimeout(function () {
                                                        message.delete()
                                                    }, 2000)
                                                })

                                            }
                                        })

                                    }

                                } else {

                                    interaction.message.edit({
                                        embeds: [embed],
                                        components: [embedComponents[0]]
                                    })
                                    interaction.deleteReply()
                                    collected.first().delete();

                                    interaction.followUp({
                                        content: `Please only enter valid numbers.`
                                    }).then(message => {
                                        setTimeout(function () {
                                            message.delete()
                                        }, 2000)
                                    })

                                }
                            } else {


                                let firstNumber = response.split("-")[0]
                                let secondNumber = response.split("-")[1]


                                if (isNaN(firstNumber) || isNaN(secondNumber)) {
                                    interaction.message.edit({
                                        embeds: [embed],
                                        components: [embedComponents[0]]
                                    })
                                    interaction.deleteReply()
                                    collected.first().delete();

                                    return interaction.followUp({
                                        content: `Please only enter numbers.`
                                    }).then(message => {
                                        setTimeout(function () {
                                            message.delete()
                                        }, 4000)
                                    })
                                }

                                firstNumber = parseInt(firstNumber)
                                secondNumber = parseInt(secondNumber)


                                if (firstNumber < 1 || secondNumber <= 1) {

                                    interaction.message.edit({
                                        embeds: [embed],
                                        components: [embedComponents[0]]
                                    })
                                    interaction.deleteReply()
                                    collected.first().delete();

                                    return interaction.followUp({
                                        content: `Imput numbers too low. Please only enter valid account numbers.`
                                    }).then(message => {
                                        setTimeout(function () {
                                            message.delete()
                                        }, 4000)
                                    })

                                }

                                if (firstNumber > accountArray.length || secondNumber > accountArray.length) {

                                    interaction.message.edit({
                                        embeds: [embed],
                                        components: [embedComponents[0]]
                                    })
                                    interaction.deleteReply()
                                    collected.first().delete();

                                    return interaction.followUp({
                                        content: `Imput numbers too high. Please only enter valid account numbers.`
                                    }).then(message => {
                                        setTimeout(function () {
                                            message.delete()
                                        }, 4000)
                                    })

                                }

                                if (firstNumber > secondNumber) {

                                    interaction.message.edit({
                                        embeds: [embed],
                                        components: [embedComponents[0]]
                                    })
                                    interaction.deleteReply()
                                    collected.first().delete();

                                    return interaction.followUp({
                                        content: `Please enter the lowest account number first. See example imput.`
                                    }).then(message => {
                                        setTimeout(function () {
                                            message.delete()
                                        }, 4000)
                                    })

                                }


                                if (firstNumber == secondNumber) {

                                    interaction.message.edit({
                                        embeds: [embed],
                                        components: [embedComponents[0]]
                                    })
                                    interaction.deleteReply()
                                    collected.first().delete();

                                    return interaction.followUp({
                                        content: `The second input number must be higher than the first.`
                                    }).then(message => {
                                        setTimeout(function () {
                                            message.delete()
                                        }, 4000)
                                    })

                                }

                                accountArray.splice(firstNumber - 1, secondNumber - (firstNumber - 1))

                                fs.writeFile('./Accounts.json', JSON.stringify(accountArray, null, 1), 'utf8', async function (err) {
                                    if (err) {
                                        interaction.followUp({
                                            content: 'Error, check console.',
                                            ephemeral: true
                                        });
                                        throw err;
                                    } else {

                                        let embednew = updateMessage();
                                        await interaction.message.edit(embednew)

                                        interaction.deleteReply()
                                        collected.first().delete();

                                        const Success = new Discord.MessageEmbed()
                                            .setColor("GREEN")
                                            .setDescription(`Successfully removed accounts from \`${firstNumber}\` to \`${secondNumber}\`.`)

                                        interaction.followUp({
                                            embeds: [Success]
                                        }).then(message => {
                                            setTimeout(function () {
                                                message.delete()
                                            }, 2000)
                                        })

                                    }
                                })
                            }
                        })
                        .catch(collected => {
                            //console.log(collected)
                            interaction.followUp({
                                content: 'Timed out.',
                                ephemeral: true
                            });
                        });
                });


            function updateMessage() {

                if(!accountArray.length){

                    const noAccounts = new Discord.MessageEmbed()
                    .setColor(setting.embedColor)
                    .setTitle("Accounts")
                    .setDescription("You've currently got no accounts stored. To add accounts either manually add them to your Accounts.json file, or use the button below.")
                    .setThumbnail('https://myminecraftbot.com/images/Headshot.png')
                    .setFooter(interaction.user.tag)


                    embedComponents[0].components.splice(1)
                    return {embeds: [noAccounts], components: [embedComponents[0]]};

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
    
                    return {embeds: [accountEmbed], components: [embedComponents[0]]};
                }

            }

        })
    }
}