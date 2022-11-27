const AccountLoading = require("../Functions/AccountLoading.js")


module.exports = {
    name: "moveFrontButton",
    run: async (client, interaction, Discord) => {
        let loggedIn = AccountLoading.loggedIn;

        if(interaction.user.tag !== interaction.message.embeds[0].footer.text) return interaction.reply({content: "Please use `.settings` to do this.", ephemeral: true})

        if(loggedIn.length < 1) return interaction.reply({content: "No bots are currently loaded.", ephemeral: true})

        let selected = [];
        loggedIn.forEach((data) => {
            if (data.selected) {
                selected.push(data);
            }
        })

        if(selected.length < 1) return interaction.reply({content: "No bots are currently selected! Use `.select` to select an account.", ephemeral: true})

        interaction.deferReply();
        
        selected.forEach((data) => {

            let bot = data.botUser;

            bot.setControlState('forward', true)
            bot.setControlState('sprint', true)

            setTimeout(() => {
                bot.clearControlStates()
            }, 200)

            /*
            let pos = bot.entity.position;
            let sX = pos.x;
            let sY = pos.y;

            let moved = false;
            while (!moved) {
                console.log(pos)
                if (((parseInt(sX.toString().split(".")[0]) >= parseInt(bot.entity.position.toString().split(".")[0]) + 1) || parseInt(sX.toString().split(".")[0]) <= parseInt(bot.entity.position.toString().split(".")[0]) - 1) || ((parseInt(sY.toString().split(".")[0]) >= parseInt(bot.entity.position.toString().split(".")[0]) + 1) || parseInt(sY.toString().split(".")[0]) <= parseInt(bot.entity.position.toString().split(".")[0]) - 1) ) {
                    bot.setControlState('forward', false)
                    moved = true;
                    break;
                }
            }*/

        })
        interaction.deleteReply()
    }
}