module.exports = async function (client) {
    const Discord = require("discord.js")
    const chalk = require("chalk")
    //const fs = require("fs")
    //const { FileArray } = require(`${ROOT.path}/Root/Functions/FileArray`)
    //
    //FileArray(`${ROOT.path}/Root/Commands/Buttons`, async function(err, res) {
    //    res.forEach(file => {
    //        if (fs.statSync(file).isDirectory()) return;
    //        const button = require(file)
    //        client.commands.buttons.set(button.name, button)
    //    })
    // })



    const addAccount = require("../../Commands/Buttons/addAccount")
    client.commands.buttons.set(addAccount.name, addAccount)

    const configUpdate = require("../../Commands/Buttons/configUpdate")
    client.commands.buttons.set(configUpdate.name, configUpdate)

    const confirmConfigReset = require("../../Commands/Buttons/confirmConfigReset")
    client.commands.buttons.set(confirmConfigReset.name, confirmConfigReset)

    const confirmSelectOrDeselectAllAccountsButton = require("../../Commands/Buttons/confirmSelectOrDeselectAllAccountsButton")
    client.commands.buttons.set(confirmSelectOrDeselectAllAccountsButton.name, confirmSelectOrDeselectAllAccountsButton)

    const deselectAllAccounts = require("../../Commands/Buttons/deselectAllAccounts")
    client.commands.buttons.set(deselectAllAccounts.name, deselectAllAccounts)

    const farmingDeposit = require("../../Commands/Buttons/farmingDeposit")
    client.commands.buttons.set(farmingDeposit.name, farmingDeposit)

    const farmingStopButton = require("../../Commands/Buttons/farmingStopButton")
    client.commands.buttons.set(farmingStopButton.name, farmingStopButton)

    const moveBackward = require("../../Commands/Buttons/moveBackward")
    client.commands.buttons.set(moveBackward.name, moveBackward)

    const moveForward = require("../../Commands/Buttons/moveForward")
    client.commands.buttons.set(moveForward.name, moveForward)

    const moveJump = require("../../Commands/Buttons/moveJump")
    client.commands.buttons.set(moveJump.name, moveJump)

    const moveLeft = require("../../Commands/Buttons/moveLeft")
    client.commands.buttons.set(moveLeft.name, moveLeft)

    const moveRight = require("../../Commands/Buttons/moveRight")
    client.commands.buttons.set(moveRight.name, moveRight)

    const moveShift = require("../../Commands/Buttons/moveShift")
    client.commands.buttons.set(moveShift.name, moveShift)

    const old = require("../../Commands/Buttons/startFarming on")
    client.commands.buttons.set(old.name, old)

    const removeAccount = require("../../Commands/Buttons/removeAccount")
    client.commands.buttons.set(removeAccount.name, removeAccount)

    const resetConfig = require("../../Commands/Buttons/resetConfig")
    client.commands.buttons.set(resetConfig.name, resetConfig)

    const selectAllAccounts = require("../../Commands/Buttons/selectAllAccounts")
    client.commands.buttons.set(selectAllAccounts.name, selectAllAccounts)

    const startFarming = require("../../Commands/Buttons/startFarming")
    client.commands.buttons.set(startFarming.name, startFarming)

    const cancelSetting = require("../../Commands/Buttons/CancelSettingUpdate")
    client.commands.buttons.set(cancelSetting.name, cancelSetting)

    const loadAccountOne = require("../../Commands/Buttons/loadOneAccounts")
    client.commands.buttons.set(loadAccountOne.name, loadAccountOne)

    const loadAccountAll = require("../../Commands/Buttons/loadAllAccounts")
    client.commands.buttons.set(loadAccountAll.name, loadAccountAll)

    const stopLoading = require("../../Commands/Buttons/stopLoading")
    client.commands.buttons.set(stopLoading.name, stopLoading)

    const sandbotFindBlocks = require("../../Commands/Buttons/sandbotFindBlocks")
    client.commands.buttons.set(sandbotFindBlocks.name, sandbotFindBlocks)

    const sandbotStart = require("../../Commands/Buttons/sandbotStart")
    client.commands.buttons.set(sandbotStart.name, sandbotStart)

    const sandbotStop = require("../../Commands/Buttons/sandbotStop")
    client.commands.buttons.set(sandbotStop.name, sandbotStop)

    const AcceptLoadXBots = require("../../Commands/Buttons/AcceptLoadXBots")
    client.commands.buttons.set(AcceptLoadXBots.name, AcceptLoadXBots)
    
    await console.log(chalk.bold.cyan("[HANDLER]") + chalk.reset(` Loaded buttons. [4/4]`))

}