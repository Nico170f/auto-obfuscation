module.exports = async function (client) {
    const chalk = require("chalk")


    //Normal Menu's
    const HelpMenu = require(`../../Commands/Menus/Help.js`)
    client.commands.menus.set(HelpMenu.name, HelpMenu)

    const SettingsMenu = require(`../../Commands/Menus/Settings.js`)
    client.commands.menus.set(SettingsMenu.name, SettingsMenu)

    const SelectMenu = require(`../../Commands/Menus/Select.js`)
    client.commands.menus.set(SelectMenu.name, SelectMenu)

    const NearChestMenu = require(`../../Commands/Menus/NearChest.js`)
    client.commands.menus.set(NearChestMenu.name, NearChestMenu)

    const ChooseCropMenu = require(`../../Commands/Menus/ChooseCrop.js`)
    client.commands.menus.set(ChooseCropMenu.name, ChooseCropMenu)



    //Settings Update Menu's
    const ProxyUpdate = require(`../../Commands/Update-Menus/Proxy.js`)
    client.commands.menus.set(ProxyUpdate.name, ProxyUpdate)

    const ConnectionUpdate = require(`../../Commands/Update-Menus/Connection.js`)
    client.commands.menus.set(ConnectionUpdate.name, ConnectionUpdate)

    const DiscordUpdate = require(`../../Commands/Update-Menus/Discord.js`)
    client.commands.menus.set(DiscordUpdate.name, DiscordUpdate)

    const FarmingUpdate = require(`../../Commands/Update-Menus/Farming.js`)
    client.commands.menus.set(FarmingUpdate.name, FarmingUpdate)

    const BotUpdate = require(`../../Commands/Update-Menus/Bot.js`)
    client.commands.menus.set(BotUpdate.name, BotUpdate)

    const PrintingUpdate = require(`../../Commands/Update-Menus/Printing.js`)
    client.commands.menus.set(PrintingUpdate.name, PrintingUpdate)

    await console.log(chalk.bold.cyan("[HANDLER]") + chalk.reset(` Loaded menus. [3/4]`))


}