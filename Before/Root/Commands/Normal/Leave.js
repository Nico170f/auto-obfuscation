const mineflayer = require('mineflayer');
const c = require("chalk");
const AccountLoading = require("../Functions/AccountLoading.js")
const fs = require("fs");

module.exports = {
    name : 'leave',
    aliases: ["disconnect", "dc", "quit", "q"],
    run : async(client, message, args, Discord) => {
        fs.readFile("./Settings.json", "utf8", async function (err, data) {
        var s = JSON.parse(data);
        let loggedIn = AccountLoading.loggedIn;

        let selected = [];
        loggedIn.forEach((data) => {
            if (data.selected) {
                selected.push(data);
            }
        })

        let successEmbed = new Discord.MessageEmbed()
        .setColor(s.embedColor)
        .setDescription(`Successfully disconnected \`${selected.length}\` bots!`)

        let noAccounts = new Discord.MessageEmbed()
        .setColor(s.embedColor)
        .setDescription("No bots are currently selected! Use `.select` to select an account.")
        if (!selected.length) return message.channel.send({embeds: [noAccounts]});


        selected.forEach((data) => {
            data.botUser.off('end', function (reason){
                console.log(reason)
                data.botUser.end("lmao");
            });
            try {
                console.log(c.bold.magentaBright("[LOGGED OUT]") + " " + c.reset.bold(data.username) + c.reset(` was logged out.`))
            } catch (error) {
                message.channel.send("Error")
                console.log(error);
            }
        })
        
        //loggedIn = loggedIn.filter(a => a.selected !== true)
        //AccountLoading.loggedIn = loggedIn;
        AccountLoading.removeLogin(async function(){
            message.channel.send({embeds: [successEmbed]});
        })

        })
    }
}