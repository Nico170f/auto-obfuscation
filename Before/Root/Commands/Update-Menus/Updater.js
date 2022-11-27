const fs = require("fs");


async function updateFile(u, v, callback){
    fs.readFile("./Settings.json", "utf8", async function (err, data) {
        var s = JSON.parse(data);

        // u = module to update
        // v = value to set

        switch(u) {

            case "Server IP":
                s.serverIP = v;
                break;
            
            case "Port":
                s.port = v;
                break;

            case "Version":
                s.version = v;
                break;

            case "Join Command":
                s.joinCommand = v;
                break;
            
            case "Join Speed":
                s.joinSpeed = v;
                break;

            case "Max Accounts":
                s.maxAccounts = v;
                break;
            
            case "Throttling Delay":
                s.throttlingDelay = v;
                break;

            case "Use Proxies":
                s.useProxies = v;
                break;

            case "Randomize Order":
                s.randomizeOrder = v;
                break;

            case "Accounts Per Proxy":
                s.accountsPerProxy = v;
                break;

            case "Embed Color":
                s.embedColor = v;
                break;

            case "Permissions Role":
                s.permissionRole = v;
                break;

            case "Ingame Chat Logging":
                s.ingameChat = v;
                break;

            case "Ingame Chat Logging Channel":
                s.ingameChatChannel = v;
                break;

            case "Error Logging":
                s.errorLogging = v;
                break;

            case "Error Logging Channel":
                s.errorLoggingChannel = v;
                break;

            case "Render Distance":
                s.renderDistance = v;
                break;

            case "Auto Select Bots":
                s.autoSelect = v;
                break;

            case "Auto Eat":
                s.autoEat = v;
                break;

            case "Follow Speed":
                s.followSpeed = v;
                break;

            case "Farming Speed":
                s.farmingSpeed = v;
                break;

            case "Farming Radius":
                s.farmingRadius = v;
                break;

            case "Deposit Chest Coords":
                s.depositChestCoords = v;
                break;

            case "Crops Till Deposit":
                s.cropsTillDeposit = v;
                break;

            case "Farm Coords":
                if (s.farmCoords.length < 2) {
                    s.farmCoords.push(v);
                } else {
                    s.farmCoords.splice(0)
                    s.farmCoords.push(v);
                }
                break;


            case "Guider Block":
                s.guiderBlock = v;
                break;

            case "Guider Block Range":
                s.findGuiderBlockRange = v;
                break;

            case "Max Guider Blocks":
                s.maxGuiderBlocks = v;
                break;

            case "Printing Gamemode":
                s.printingGamemode = v;
                break;

            case "Printing Speed":
                s.printingSpeed = v;
                break;

            default:
                console.log("Error updating settings for: " + u)
                break;
        }

        fs.writeFileSync("./Settings.json", JSON.stringify(s));
        callback();
    })
}

module.exports = {updateFile}