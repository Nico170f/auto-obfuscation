const Discord = require('discord.js');
const c = require("chalk");
const fs = require("fs");
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const AccountLoading = require("../Functions/AccountLoading.js")
const {
    Vec3
} = require('vec3')

let CurrentlyPlacing = false;
let PlacementCoords = [];
let PlacementBlock = "netherrack";
let bots = [];
var interaction;

//Temp variables
let findBlockRange = 30;
let mcData = null;
let stopped = false;
let Item = null;
let timer = 500;
let gamemode = "creative"
let blockReach = 5;
let findCount = 100;

let debug = false;


async function startUp(MessageInteraction, action) {
    let loggedIn = AccountLoading.loggedIn;

    /*if (interaction != MessageInteraction) */interaction = MessageInteraction;
    if (!loggedIn.length) return await MessageInteraction.editReply({
        content: "No accounts are currenty online."
    })


    if(action == "FindBlocks") return findBlocks();
    if(action == "Start") return startPlacing();
    if(action == "Stop"){
        stopped = true;
        updateMessage(interaction, false, async function(){
            interaction.editReply("Stopped printing").then(data => {
                setTimeout(function () {
                    data.delete()
                }, 2500)
            })
        })
    }


}


async function findBlocks() {

    if (CurrentlyPlacing) return interaction.editReply({
        content: "You can't do this while the bots are printing."
    })

    getSelectedBots(async function () {

        if(mcData == null) mcData = require('minecraft-data')(bots[0].botUser.version);
        if(Item == null) Item = require('prismarine-item')(bots[0].botUser.version)

        try {

            PlacementCoords.splice(0, PlacementCoords.length)
            await bots[0].botUser.waitForChunksToLoad()

            if (mcData.blocksByName[PlacementBlock] === undefined) return interaction.editReply({
                content: `Block: \`${PlacementBlock}\` is invalid.`
            })

            const blockID = [mcData.blocksByName[PlacementBlock].id];
            let Found = bots[0].botUser.findBlocks({
                matching: blockID,
                maxDistance: findBlockRange,
                count: findCount
            })


            Found.forEach(async (data) => {
                PlacementCoords.push(data)
            })

            updateMessage(interaction, false, async function(){
                await interaction.editReply({content: `Successfully found: \`${PlacementCoords.length}\` guider blocks!`}).then(data => {
                    setTimeout(function () {
                        data.delete()
                    }, 2500)
                })
            })

        } catch (error) {
            return console.log(error)
        }

    })
}




async function startPlacing() {

    if(debug) console.log("Loading...")

    if(!PlacementCoords.length) return updateMessage(interaction, false, async function(){
        return await interaction.editReply({content: `You don't have any guider blocks loaded. Please place \`${PlacementBlock}\`, and use 'Find Guider Blocks'.`}).then(data => {
            setTimeout(function () {
                data.delete()
            }, 5000)
        })
    })


    await getSelectedBots(async function () {
        if(mcData == null) mcData = require('minecraft-data')(bots[0].botUser.version);
        if(Item == null) Item = require('prismarine-item')(bots[0].botUser.version)

        await checkGamemode(async function(){
            await getSand(async function(){
                await getDistance(async function(){
                    await getMode(async function(){
                        await startPrinting();
                    })

                })
            })
        })
    })
}



async function startPrinting(){

    bots.forEach(async (data) => {
        if(stopped) return;

            for await (const position of data.Reachable){
                if(stopped) return;
                if(data.botUser.blockAt(position).type !== 0) await data.botUser.placeBlock(data.botUser.blockAt(position), new Vec3(0, -1, 0))
                else {
                    if(data.botUser.blockAt(position.offset(1, 0, 0)).type !== 0) await data.botUser.placeBlock(data.botUser.blockAt(position.offset(1, 0, 0)), new Vec3(-1, 0, 0));
                    else if(data.botUser.blockAt(position.offset(- 1, 0, 0)).type !== 0) await data.botUser.placeBlock(data.botUser.blockAt(position.offset(-1, 0, 0)), new Vec3(1, 0, 0));
                    else if(data.botUser.blockAt(position.offset(0, 0, 1)).type !== 0) await data.botUser.placeBlock(data.botUser.blockAt(position.offset(0, 0, 1)), new Vec3(0, 0, -1));
                    else if(data.botUser.blockAt(position.offset(0, 0, -1)).type !== 0) await data.botUser.placeBlock(data.botUser.blockAt(position.offset(0, 0, -1)), new Vec3(0, 0, 1));
                }
            }
    if(debug) console.log("\n\n")

    })

    if(!stopped) {
        setTimeout(() => {
            startPrinting();
        }, timer)
    } else {
        stopped = false;
    }
}



async function getMode(callback){
    if(debug) console.log("getMode")
    await callback();
}



async function getDistance(callback){

    let amount = bots.length;
    for (var i = 0; i < amount; i++){

        if(debug) console.log(bots[i].botUser._client.username + ": ")

        let copyArray2 = [];
        let parsedArray = JSON.parse(JSON.stringify(PlacementCoords))
        parsedArray.forEach(async (data) => {
            copyArray2.push(new Vec3(data.x, data.y, data.z))
        })

        await copyArray2.forEach(async (data) => {

            if(bots[i].botUser.entity.position.distanceTo(data) < blockReach){
                if(debug) console.log("Within reach: " + data + " (" + bots[i].botUser.entity.position.distanceTo(data) + ")")
                bots[i].Reachable.push(data);
            } else {
                if(debug) console.log("Not within reach: " + data + " (" + bots[i].botUser.entity.position.distanceTo(data) + ")")
            }
        })

        if(debug) await console.log("checked")

    }

    await callback();
}

async function getSand(callback){

    if(gamemode.toLowerCase() == "creative"){

        bots.forEach(async (data, i = 0) => {
            i++;
            //!data.botUser.creative.setInventorySlot(36, new Item(12, 1, 0));
            if(i == bots.length) callback();
        })

    } else {

        //Survival stuff

    }

}


async function checkGamemode(callback){

    let InvalidGamemodeString = "survival";
    if(gamemode.toLowerCase() == "survival") InvalidGamemodeString = "creative";

    let stop = [];
    bots.forEach(async (data, i = 0) => {
        i++;

        if(debug) console.log(data.botUser.username + " " + data.botUser.game.gameMode)

        if(data.botUser.game.gameMode.toLowerCase() != gamemode.toLowerCase()) stop.push(data.botUser.username);

        if(i == bots.length){
            if(stop.length) {
                updateMessage(interaction, false, async function(){
                    return await interaction.editReply({content: `Bots: \`${stop.toString()}\` are currently in ${InvalidGamemodeString}. If you wish to print while in ${InvalidGamemodeString}, please change the gamemode using \`.settings\`.`});
                })
            } else await callback();
        }
    })

}


async function checkOccupationStatus(){
    
}


async function getSelectedBots(callback) {
    if(debug) console.log("getSelectedBots")
    let loggedIn = AccountLoading.loggedIn;
    let stopped = false;
    bots = []
    loggedIn.forEach(async (data, i = 0) => {
        if(stopped) return;
        i++;
        //console.log("here2 - " + i)

        if(data.selected){
            if(data.occupation.currentlyOccupied.busy) {
                stopped = true;
                return interaction.editReply({content: `Bot: \`${data.username} is currently occupied ${data.occupation.currentlyOccupied.occupation}\`. Please either deselect this account, or stop its current tasks.`})
            } else {
                bots.push({botUser: data.botUser, Reachable: []});
            }
        }
        if (i == loggedIn.length) await callback();
    })

}

async function getUsernames(callback){
    if(debug) console.log("getUsernames")

    getSelectedBots(async function(){
        let botIgns = "";
        bots.forEach(async (data, i = 0) => {
            i++;
            botIgns = botIgns + `${i + ". " + data.botUser.username}\n`;
            if(i == bots.length) await callback(botIgns);
        })
    })

}

async function updateMessage(interaction, running, callback){
    fs.readFile("./Settings.json", "utf8", async function (err, data) {
        //console.log("updateMessage")

        await getUsernames(async function(botIgns){

            let embed = interaction.message.embeds[0];
            embed.setDescription(`1. Place guider blocks where you want sand to be printed.\n2. Use 'Find Guider Blocks' to load the preset.\n\n(!) If you break the guider blocks after loading the preset, sand will be printed where the guider was. If you leave the guiders sand will print under them.\n\n` +
            `🔸 \`Guide Block\`\n⤷ **Block:** ${PlacementBlock}` +
            `\n⤷ **Found:** ${PlacementCoords.length}`);
            embed.fields[0].value = botIgns;

            let OldComponent = interaction.message.components[0];
            if(running){
                OldComponent.components[0].disabled = true
                OldComponent.components[1].disabled = false
                OldComponent.components[2].disabled = true
            } else {
                OldComponent.components[0].disabled = false
                OldComponent.components[1].disabled = true
                OldComponent.components[2].disabled = false
            }

            await interaction.message.edit({embeds: [embed], components: [OldComponent]})
            if(callback) await callback();
        })
    })
}


module.exports = {
    startUp,
    PlacementCoords,
    PlacementBlock
};