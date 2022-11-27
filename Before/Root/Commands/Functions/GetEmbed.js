const Discord = require('discord.js');
const fs = require("fs");

const Embeds = {
    ConnectionEmbed: Object,
    ProxiesEmbed: Object,
    DiscordEmbed: Object,
    BotEmbed: Object,
    FarmingEmbed: Object,
    PrintingEmbed: Object
};

const Menus = {
    SettingsMenu: Object
}

const Button = new Discord.MessageActionRow().addComponents(
new Discord.MessageButton()
.setCustomId("configUpdate")
.setLabel("Update Category")
.setStyle("PRIMARY")
)

const Buttons = {
    UpdateCategory: Button
}

async function getSettingsMenu(selected, callback) {

    let MenuItems = [{
        label: "Connection",
        description: 'View Connection Settings',
        emoji: "📡"
    }, {
        label: "Proxies",
        description: "View Proxy Settings",
        emoji: "🌍"
    }, {
        label: "Discord",
        description: "View Discord Settings",
        emoji: "⚙️"
    }, {
        label: "Bot",
        description: "View Bot Settings",
        emoji: "🤖",
    }, {
        label: "Farming",
        description: "View Farming Settings",
        emoji: "🌿"
    }, {
        label: "Printing",
        description: "View Printing Settings",
        emoji: "🖨️"
    }, ]

    const settingsMenu = new Discord.MessageActionRow().addComponents(
        new Discord.MessageSelectMenu()
        .setCustomId('Settings_Menu')
        .setPlaceholder('Choose A Settings Category')
    )

    MenuItems.forEach((data) => {

        if(data.label.toLowerCase() == selected.toLowerCase()){

            settingsMenu.components[0].addOptions([{
                label: data.label,
                value: data.label,
                description: data.description,
                emoji: data.emoji,
                default: true
            }])

        } else {

            settingsMenu.components[0].addOptions([{
                label: data.label,
                value: data.label,
                description: data.description,
                emoji: data.emoji,
            }])

        }  
    })



    Menus.SettingsMenu = settingsMenu;
    callback();
}


async function getSettingsEmbed(footer, callback) {
    fs.readFile("./Settings.json", "utf8", function (err, data) {
        var s = JSON.parse(data);


        //Text replacement
        let joinCMD = s.joinCommand;
        if (s.joinCommand == "") joinCMD = "none";

        let role = s.permissionRole;
        if (!role.includes("Not")) role = `<@&${s.permissionRole}>`

        let chat = s.ingameChatChannel;
        if (!chat.includes("Not")) chat = `<#${s.ingameChatChannel}>`

        let chat2 = s.errorLoggingChannel;
        if (!chat2.includes("Not")) chat2 = `<#${s.errorLoggingChannel}>`

        let farmingCoords = s.farmCoords;
        if (!farmingCoords.length) farmingCoords = "Not set."


        const ConnectionEmbed = new Discord.MessageEmbed()
            .setColor(s.embedColor)
            .setTitle('Connection Settings')
            .setDescription(`` +
                `🔹 \`Server IP\`\n⤷ Current: **${s.serverIP}**\n\n` +
                `🔹 \`Port\`\n⤷ Current: **${s.port}**\n\n` +
                `🔹 \`Version\`\n⤷ Current: **${s.version}**\n\n` +
                `🔹 \`Join Command\`\n⤷ Current: **${joinCMD}**\n\n` +
                `🔹 \`Join Speed\`\n⤷ Current: **${s.joinSpeed}**\n\n` +
                `🔹 \`Max Accounts\`\n⤷ Current: **${s.maxAccounts}**\n\n` +
                `🔹 \`Throttling Delay\`\n⤷ Current: **${s.throttlingDelay}**\n\n`)
            .setFooter(footer)
            .setThumbnail('https://myminecraftbot.com/images/Headshot.png');
        //settingsEmbeds[0] = ConnectionEmbed;
        Embeds.ConnectionEmbed = ConnectionEmbed;

        const ProxiesEmbed = new Discord.MessageEmbed()
            .setColor(s.embedColor)
            .setTitle('Proxy Settings')
            .setDescription(`` +
                `🔹 \`Use Proxies\`\n⤷ Current: **${s.useProxies}**\n\n` +
                `🔹 \`Randomize Order\`\n⤷ Current: **${s.randomizeOrder}**\n\n` +
                `🔹 \`Accounts Per Proxy\`\n⤷ Current: **${s.accountsPerProxy}**\n\n`)
            .setFooter(footer)
            .setThumbnail('https://myminecraftbot.com/images/Headshot.png');
        //settingsEmbeds[1] = ProxiesEmbed;
        Embeds.ProxiesEmbed = ProxiesEmbed;

        const DiscordEmbed = new Discord.MessageEmbed()
            .setColor(s.embedColor)
            .setTitle('Discord Settings')
            .setDescription(`` +
                `🔹 \`Embed Color\`\n⤷ Current: **${s.embedColor}**\n\n` +
                `🔹 \`Permissions Role\`\n⤷ Current: **${role}**\n\n` +
                `🔹 \`Ingame Chat Logging\`\n⤷ Current: **${s.ingameChat}**\n\n` +
                `🔹 \`Ingame Chat Logging Channel\`\n⤷ Current: **${chat}**\n\n` +
                `🔹 \`Error Logging\`\n⤷ Current: **${s.errorLogging}**\n\n` +
                `🔹 \`Error Logging Channel\`\n⤷ Current: **${chat2}**\n\n`)
            .setFooter(footer)
            .setThumbnail('https://myminecraftbot.com/images/Headshot.png');
        Embeds.DiscordEmbed = DiscordEmbed;


        const BotEmbed = new Discord.MessageEmbed()
            .setColor(s.embedColor)
            .setTitle('Bot Settings')
            .setDescription(`` +
                `🔹 \`Render Distance\`\n⤷ Current: **${s.renderDistance}**\n\n` +
                `🔹 \`Auto Select Bots\`\n⤷ Current: **${s.autoSelect}**\n\n` +
                `🔹 \`Auto Eat\`\n⤷ Current: **${s.autoEat}**\n\n` +
                `🔹 \`Follow Speed\`\n⤷ Current: **${s.followSpeed}**\n\n`)
            .setFooter(footer)
            .setThumbnail('https://myminecraftbot.com/images/Headshot.png');
        Embeds.BotEmbed = BotEmbed;


        const FarmingEmbed = new Discord.MessageEmbed()
            .setColor(s.embedColor)
            .setTitle('Farming Settings')
            .setDescription(`` +
                `🔹 \`Farming Speed\`\n⤷ Current: **${s.farmingSpeed}**\n\n` +
                `🔹 \`Farming Radius\`\n⤷ Current: **${s.farmingRadius}**\n\n` +
                `🔹 \`Deposit Chest Coords\`\n⤷ Current: **${s.depositChestCoords}**\n\n` +
                `🔹 \`Crops Till Deposit\`\n⤷ Current: **${s.cropsTillDeposit}**\n\n` +
                `🔹 \`Farm Coords\`\n⤷ Current: **${farmingCoords.toString().replace(",", ", ")}**\n\n`)
            .setFooter(footer)
            .setThumbnail('https://myminecraftbot.com/images/Headshot.png');
        Embeds.FarmingEmbed = FarmingEmbed;



        const PrintingEmbed = new Discord.MessageEmbed()
            .setColor(s.embedColor)
            .setTitle('Printing Settings')
            .setDescription(`` +
                `🔹 \`Guider Block\`\n⤷ Current: **${s.guiderBlock}**\n\n` +
                `🔹 \`Guider Block Range\`\n⤷ Current: **${s.findGuiderBlockRange}**\n\n` +
                `🔹 \`Max Guider Blocks\`\n⤷ Current: **${s.maxGuiderBlocks}**\n\n` +
                `🔹 \`Printing Gamemode\`\n⤷ Current: **${s.printingGamemode}**\n\n` +
                `🔹 \`Printing Speed\`\n⤷ Current: **${s.printingSpeed}**\n\n`)
            .setFooter(footer)
            .setThumbnail('https://myminecraftbot.com/images/Headshot.png');
        Embeds.PrintingEmbed = PrintingEmbed;

        callback();
    })

}

module.exports = {
    getSettingsEmbed,
    Embeds,

    getSettingsMenu,
    Menus,

    Buttons
};