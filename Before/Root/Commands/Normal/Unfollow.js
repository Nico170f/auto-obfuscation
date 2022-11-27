const mineflayer = require('mineflayer');
const c = require("chalk");
const AccountLoading = require("../Functions/AccountLoading.js")
const fs = require("fs");

module.exports = {
    name: 'unfollow',
    aliases: ["uf"],
    run: async (client, message, args, Discord) => {
        fs.readFile("./Settings.json", "utf8", function (err, data) {
            var s = JSON.parse(data);
            let loggedIn = AccountLoading.loggedIn;

            let selected = [];
            let someFollow = false;
            loggedIn.forEach((data) => {
                if (data.selected) {
                    selected.push(data.username);
                    if(data.occupation.follow.followingPlayer) someFollow = true;
                }
            })

            let noAccounts = new Discord.MessageEmbed()
            .setColor(s.embedColor)
            .setDescription("No bots are currently selected! Use `.select` to select an account.")
            if (selected.length < 1) return message.channel.send({embeds: [noAccounts]});

            let noAccountsFollowing = new Discord.MessageEmbed()
            .setColor(s.embedColor)
            .setDescription("No accounts are currently following.")
            if (!someFollow) return message.channel.send({embeds: [noAccountsFollowing]})

            selected.splice(0);

            loggedIn.forEach((data) => {

                if (data.selected) data.occupation.follow.followingPlayer = false;

            })
        })
    }
}