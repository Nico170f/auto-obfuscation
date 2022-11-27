//const config = require('../../Config.json');
const fs = require("fs");


var config;
try {
    config = JSON.parse(fs.readFileSync("./Config.json"));
} catch (err) {
    console.log(err)
}
module.exports = {
    name: "messageCreate",
    run: async(message, client) => {
    let prefix = config.prefix;
    if (!message.content.toLowerCase().startsWith(prefix)) return;
    const cmdName = message.content.toString().toLowerCase().slice(prefix.length).trim().split(" ")[0]
    const command = client.commands.normal.get(cmdName) ?? client.commands.normal.get(client.commands.normal.aliases.get(cmdName))
    if (!command) return;
    //const loadCommandOptions = require(`${ROOT.path}/Root/Classes/CommandOptions/loadCommandOptions`)
    const loadCommandOptions = require(`../Classes/CommandOptions/loadCommandOptions`)
    if (command.allowBots) loadCommandOptions(client, message, command, false)
    else if (message.author.bot) return;
    else if (command.guildOnly == false) loadCommandOptions(client, message, command, false)
    else if (!message.guild) return;
   else loadCommandOptions(client, message, command, false)

    }
}