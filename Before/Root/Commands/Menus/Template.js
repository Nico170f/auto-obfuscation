const Discord = require('discord.js');
const fs = require("fs");

module.exports = {
    name: "Template_Menu",
    run: async (client, interaction, container) => {
        fs.readFile("./Settings.json", "utf8", function (err, data) {
            var s = JSON.parse(data);

            if (interaction.user.tag !== interaction.message.embeds[0].footer.text) return interaction.reply({
                content: "Please use `.template` to do this.",
                ephemeral: true
            })




        })
    }
}