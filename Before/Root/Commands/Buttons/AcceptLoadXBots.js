const AccountLoading = require("../Functions/AccountLoading.js")
const fs = require("fs");

module.exports = {
    name: "AcceptLoadXBots",
    ownerOnly: true,
    run: async (client, interaction, Discord) => {
        fs.readFile("./Settings.json", "utf8", async function (err, data) {
            var s = JSON.parse(data);
            let loggedIn = AccountLoading.loggedIn;

            if (interaction.user.tag !== interaction.message.embeds[0].footer.text) return interaction.reply({
                content: "Please use `.load` to do this.",
                ephemeral: true
            })

            let embed = await interaction.message.embeds[0];
            let amountToLoad = embed.description.split("`")[1].split("`")[0];

            if (isNaN(amountToLoad)) amountToLoad = 1;
            else amountToLoad = parseInt(amountToLoad);

            let Buttons = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                    .setCustomId('loadAllAccounts')
                    .setLabel('Load All')
                    .setStyle('PRIMARY')
                    .setDisabled(true),
                ).addComponents(
                    new Discord.MessageButton()
                    .setCustomId('loadOneAccounts')
                    .setLabel('Load One')
                    .setStyle('PRIMARY')
                    .setDisabled(true),
                ).addComponents(
                    new Discord.MessageButton()
                    .setCustomId('stopLoadingAccounts')
                    .setLabel('Stop Loading')
                    .setStyle('DANGER')
                    .setDisabled(false),
                )

            try {
                credentials = JSON.parse(fs.readFileSync("./Accounts.json"));
            } catch (error) {
                return console.log(error)
            }

            const LoadEmbed = new Discord.MessageEmbed()
                .setColor(s.embedColor)
                .setTitle("Account Loading")
                .setDescription(`Currently loaded counts the total amount of bots currently online. Account errors occurs if an account is either banned or gets kicked while logging in. Invalid accounts have invalid credentials. Errors thrown while a bot is logging in will be logged in console.\n\n➜ Currently loaded: **${loggedIn.length}/${credentials.length}** `)
                .addField("Errors:", `\`\`\`-\`\`\``)
                .addField("Invalid:", `\`\`\`-\`\`\``)
                .setFooter(interaction.user.tag)
                .setThumbnail('https://myminecraftbot.com/images/Headshot.png');

            await interaction.message.edit({
                embeds: [LoadEmbed],
                components: [Buttons]
            })
            await interaction.deferReply()
            await AccountLoading.getLoadingStatus(async function (Loading) {
                if (Loading) {

                    await interaction.editReply({
                        content: `<@!${interaction.user.id}> -  Bots are already being loaded.`
                    });
                    return;

                } else {

                    setTimeout(async function () {
                        await AccountLoading.startUp(interaction, {
                            multiple: true,
                            loaded: {
                                amount: amountToLoad,
                                currentlyLoaded: 0
                            }
                        })
                    }, 100)
                }
            })
        })
    }
}