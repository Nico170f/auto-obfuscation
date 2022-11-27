module.exports = {
    name: "ready",
    run: async(client) => {
        const chalk = require("chalk")
        client.user.setActivity('Discord', {
            type: `WATCHING`,
        })
        console.log(chalk.bold.blueBright("[APPLICATION] ") + chalk.reset.bold(`Bot ready.`))

    }
}