const fs = require("fs");


module.exports = {
    name: "confirmResetButton",
    ownerOnly: true,
    run: async(client, interaction, Discord) => {


        fs.readFile("./Settings.json", "utf8", function (err, data) {
            var setting = JSON.parse(data);
                setting = {
                    serverIP: "localhost",
                    port: 25565,
                    version: "1.8",

                    joinCommand: "",
                    joinSpeed: 5,
                    maxAccounts: -1,
                    throttlingDelay: 5000,

                    useProxies: false,
                    randomizeOrder: false,
                    accountsPerProxy: 1,

                    embedColor: "2f3136",
                    permissionRole: "Not Set.",
                    errorLogging: true,
                    errorLoggingChannel: "Not set.",
                    ingameChat: false,
                    ingameChatChannel: "Not set.",

                    renderDistance: "normal",
                    autoSelect: false,
                    autoEat: false,
                    followSpeed: 300,

                    farmingSpeed: 50,
                    farmingRadius: 50,
                    depositChestCoords: "Auto",
                    cropsTillDeposit: 16,
                    farmCoords: []
                }
                var write = JSON.stringify(setting);
                fs.writeFileSync("./Settings.json", write);
        })

        let resetEmbed = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setDescription("Settings have been reset.")

        interaction.update({embeds: [resetEmbed], components: []})

    }
}