module.exports = async function (client) {
    const Discord = require("discord.js")
    const chalk = require("chalk")
    const debug = false;
    //const fs = require("fs")
    //const { FileArray } = require(`${ROOT.path}/Root/Functions/FileArray`)

    //   FileArray(`${ROOT.path}/Root/Commands/Normal`, async function(err, res) {
    //       res.forEach(file => {
    //           if (fs.statSync(file).isDirectory()) return;
    //           const command = require(file)
    //           client.commands.normal.set(command.name.toLowerCase(), command)
    //           if (command.aliases) command.aliases.forEach(alias => {
    //               client.commands.normal.aliases.set(alias, command.name)
    //           })
    //       })
    // 


    //!let cmd_360 = require(`../../Commands/Normal/360`)
    //!client.commands.normal.set(cmd_360.name.toLowerCase(), cmd_360)
    //!if (cmd_360.aliases) cmd_360.aliases.forEach(alias => {
    //!    client.commands.normal.aliases.set(alias, cmd_360.name)
    //!})

    //!console.log("cmd_360")


    let cmd_accounts = require(`../../Commands/Normal/Accounts`)
    client.commands.normal.set(cmd_accounts.name.toLowerCase(), cmd_accounts)
    if (cmd_accounts.aliases) cmd_accounts.aliases.forEach(alias => {
        client.commands.normal.aliases.set(alias, cmd_accounts.name)
    })

    if(debug) console.log("cmd_accounts")


    let cmd_chat = require(`../../Commands/Normal/Chat`)
    client.commands.normal.set(cmd_chat.name.toLowerCase(), cmd_chat)
    if (cmd_chat.aliases) cmd_chat.aliases.forEach(alias => {
        client.commands.normal.aliases.set(alias, cmd_chat.name)
    })

    if(debug) console.log("cmd_chat")


    //!let cmd_come_test = require(`../../Commands/Normal/come_test`)
    //!client.commands.normal.set(cmd_come_test.name.toLowerCase(), cmd_come_test)
    //!if (cmd_come_test.aliases) cmd_come_test.aliases.forEach(alias => {
    //!    client.commands.normal.aliases.set(alias, cmd_come_test.name)
    //!})

    //!if(debug) console.log("cmd_come_test")


    let cmd_farm = require(`../../Commands/Normal/Farm`)
    client.commands.normal.set(cmd_farm.name.toLowerCase(), cmd_farm)
    if (cmd_farm.aliases) cmd_farm.aliases.forEach(alias => {
        client.commands.normal.aliases.set(alias, cmd_farm.name)
    })
    if(debug) console.log("cmd_farm")


    let cmd_follow = require(`../../Commands/Normal/Follow`)
    client.commands.normal.set(cmd_follow.name.toLowerCase(), cmd_follow)
    if (cmd_follow.aliases) cmd_follow.aliases.forEach(alias => {
        client.commands.normal.aliases.set(alias, cmd_follow.name)
    })
    if(debug) console.log("cmd_follow")


    let cmd_help = require(`../../Commands/Normal/Help`)
    client.commands.normal.set(cmd_help.name.toLowerCase(), cmd_help)
    if (cmd_help.aliases) cmd_help.aliases.forEach(alias => {
        client.commands.normal.aliases.set(alias, cmd_help.name)
    })
    if(debug) console.log("cmd_help")


    let cmd_leave = require(`../../Commands/Normal/Leave`)
    client.commands.normal.set(cmd_leave.name.toLowerCase(), cmd_leave)
    if (cmd_leave.aliases) cmd_leave.aliases.forEach(alias => {
        client.commands.normal.aliases.set(alias, cmd_leave.name)
    })
    if(debug) console.log("cmd_leave")


    //let cmd_load_new = require(`../../Commands/Normal/Load_New`)
    //client.commands.normal.set(cmd_load_new.name.toLowerCase(), cmd_load_new)
    //if (cmd_load_new.aliases) cmd_load_new.aliases.forEach(alias => {
    //    client.commands.normal.aliases.set(alias, cmd_load_new.name)
    //})


    let cmd_load = require(`../../Commands/Normal/Load`)
    client.commands.normal.set(cmd_load.name.toLowerCase(), cmd_load)
    if (cmd_load.aliases) cmd_load.aliases.forEach(alias => {
        client.commands.normal.aliases.set(alias, cmd_load.name)
    })
    if(debug) console.log("cmd_load")


    let cmd_move = require(`../../Commands/Normal/Move`)
    client.commands.normal.set(cmd_move.name.toLowerCase(), cmd_move)
    if (cmd_move.aliases) cmd_move.aliases.forEach(alias => {
        client.commands.normal.aliases.set(alias, cmd_move.name)
    })
    if(debug) console.log("cmd_move")


    let cmd_sandbot = require(`../../Commands/Normal/Sandbot`)
    client.commands.normal.set(cmd_sandbot.name.toLowerCase(), cmd_sandbot)
    if (cmd_sandbot.aliases) cmd_sandbot.aliases.forEach(alias => {
        client.commands.normal.aliases.set(alias, cmd_sandbot.name)
    })
    if(debug) console.log("cmd_sandbot")


    let cmd_select = require(`../../Commands/Normal/Select`)
    client.commands.normal.set(cmd_select.name.toLowerCase(), cmd_select)
    if (cmd_select.aliases) cmd_select.aliases.forEach(alias => {
        client.commands.normal.aliases.set(alias, cmd_select.name)
    })
    if(debug) console.log("cmd_select")


    let cmd_settings = require(`../../Commands/Normal/Settings`)
    client.commands.normal.set(cmd_settings.name.toLowerCase(), cmd_settings)
    if (cmd_settings.aliases) cmd_settings.aliases.forEach(alias => {
        client.commands.normal.aliases.set(alias, cmd_settings.name)
    })
    if(debug) console.log("cmd_settings")


    let cmd_status = require(`../../Commands/Normal/Status`)
    client.commands.normal.set(cmd_status.name.toLowerCase(), cmd_status)
    if (cmd_status.aliases) cmd_status.aliases.forEach(alias => {
        client.commands.normal.aliases.set(alias, cmd_status.name)
    })
    if(debug) console.log("cmd_status")


    //!let cmd_test = require(`../../Commands/Normal/test`)
    //!client.commands.normal.set(cmd_test.name.toLowerCase(), cmd_test)
    //!if (cmd_test.aliases) cmd_test.aliases.forEach(alias => {
    //!    client.commands.normal.aliases.set(alias, cmd_test.name)
    //!})
    //!if(debug) console.log("cmd_test")


    //!let cmd_stream = require(`../../Commands/Normal/Stream`)
    //!client.commands.normal.set(cmd_stream.name.toLowerCase(), cmd_stream)
    //!if (cmd_stream.aliases) cmd_stream.aliases.forEach(alias => {
    //!    client.commands.normal.aliases.set(alias, cmd_stream.name)
    //!})
    //!if(debug) console.log("cmd_stream")


    let cmd_unfollow = require(`../../Commands/Normal/Unfollow`)
    client.commands.normal.set(cmd_unfollow.name.toLowerCase(), cmd_unfollow)
    if (cmd_unfollow.aliases) cmd_unfollow.aliases.forEach(alias => {
        client.commands.normal.aliases.set(alias, cmd_unfollow.name)
    })
    if(debug) console.log("cmd_unfollow")


    let cmd_view = require(`../../Commands/Normal/View`)
    client.commands.normal.set(cmd_view.name.toLowerCase(), cmd_view)
    if (cmd_view.aliases) cmd_view.aliases.forEach(alias => {
        client.commands.normal.aliases.set(alias, cmd_view.name)
    })
    if(debug) console.log("cmd_view")


    //console.log(client)

    //await console.log(chalk.bold.blueBright("[APPLICATION] ") + chalk.reset.bold(`Connected to ${client.user.tag}`))
    await console.log(chalk.bold.cyan("[HANDLER]") + chalk.reset(` Loaded commands. [1/4]`))

}