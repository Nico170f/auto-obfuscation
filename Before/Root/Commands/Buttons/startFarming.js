const AccountLoading = require("../Functions/AccountLoading.js")
const fs = require("fs");
const pathfinder = require('mineflayer-pathfinder').pathfinder
const Movements = require('mineflayer-pathfinder').Movements
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const {
    GoalNear,
    GoalGetToBlock
} = require('mineflayer-pathfinder').goals
const {
    Vec3
} = require('vec3')

let mcData = null;
let defaultMove = null;
let range = 10;

let pathfinding = true;

module.exports = {
    name: "farmingStartButton",
    run: async (client, interaction, Discord) => {
        fs.readFile("./Settings.json", "utf8", function (err, data) {
            var s = JSON.parse(data);
            let loggedIn = AccountLoading.loggedIn;

            if (interaction.user.tag !== interaction.message.embeds[0].footer.text) return interaction.reply({
                content: "Please use `.farm` to do this.",
                ephemeral: true
            })

            if (!loggedIn.length) return interaction.reply({
                content: "No bots are currently loaded.",
                ephemeral: true
            })

            let bot;
            loggedIn.forEach((data) => {
                if (data.username == interaction.message.embeds[0].author.name.split(": ")[1]) {
                    bot = data;
                }
            })

            if (!bot) return interaction.reply({
                content: `Bot: **${interaction.message.embeds[0].author.name.split(": ")[1]}** is not online.`,
                ephemeral: true
            })


            if (bot.occupation.currentlyOccupied.busy == true && bot.occupation.farming.currentlyFarming == false) return interaction.reply({
                content: `${bot.username} is curretly occupied doing a different task.`,
                ephemeral: true
            })

            if (bot.occupation.currentlyOccupied.busy == true && bot.occupation.farming.currentlyFarming == true) return interaction.reply({
                content: `${bot.username} is already farming.`,
                ephemeral: true
            })



            if (!mcData) mcData = require('minecraft-data')(bot.botUser.version)
            if (!defaultMove) {
                defaultMove = new Movements(bot.botUser, mcData)
                defaultMove.canDig = false;
                defaultMove.scafoldingBlocks = [];
                defaultMove.allowFreeMotion = true;
                defaultMove.blocksToAvoid.delete(59)
                defaultMove.blocksToAvoid.delete(51)
                defaultMove.blocksToAvoid.delete(11)
                defaultMove.allowSprinting = true;
            }

            bot.occupation.farming.depositVec = bot.occupation.farming.depositCoords;
            bot.occupation.currentlyOccupied.busy = true;
            bot.occupation.farming.currentlyFarming = true;
            bot.occupation.currentlyOccupied.occupation = "farming";

            if (pathfinding) {
                bot.botUser.pathfinder.setMovements(defaultMove)
            }




            let checkInvInterval;
            async function checkInventory() {
                checkInvInterval = setInterval(async function () {
                    if (!bot.occupation.farming.currentlyFarming) return clearInterval(checkInvInterval)

                    let countedCropCount = 0;
                    //let countedSeedCount = 0;

                    bot.botUser.inventory.items().forEach((data) => {

                        if (bot.occupation.farming.crop == "wheat") {

                            //if (data.type == 295) countedSeedCount += data.count;
                            if (data.type == 296) countedCropCount += data.count;

                        } else if (bot.occupation.farming.crop == "carrots") {

                            if (data.type == 391) countedCropCount += data.count;


                        } else if (bot.occupation.farming.crop == "potatoes") {

                            if (data.type == 392) countedCropCount += data.count;

                        } else if (bot.occupation.farming.crop == "pumpkin") {

                            if (data.type == 86) countedCropCount += data.count;


                        } else if (bot.occupation.farming.crop == "melon_block") {

                            if (data.type == 103) countedCropCount += data.count;

                        }

                    })

                    //bot.occupation.farming.seedCount += (countedSeedCount - bot.occupation.farming.seedCount);
                    bot.occupation.farming.cropCount += (countedCropCount - bot.occupation.farming.cropCount);

                }, 5000)
            }


            farmLooping();
            checkInventory();


            async function farmLooping() {

                console.log("farming loop")

                if (!bot.occupation.farming.currentlyFarming) {
                    bot.occupation.currentlyOccupied.busy = false;
                    bot.occupation.currentlyOccupied.occupation = "";
                    bot.botUser.setControlState('forward', false);
                    bot.botUser.look(0, 0, false);
                    return;
                }

                if (bot.occupation.farming.cropCount > s.cropsTillDeposit || (bot.botUser.inventory.slots.filter(v => v == null).length - 8) < 3) {

                    clearInterval(checkInvInterval);
                    await findDepositChest();


                } else {

                    await farmLoop();
                    setTimeout(farmLooping, 250);

                }
            }


            async function findDepositChest() {
                console.log("findDepositChest")

                clearInterval(checkInvInterval)

                if (typeof bot.occupation.farming.depositVec === 'string' || bot.occupation.farming.depositVec instanceof String) {
                    if (bot.occupation.farming.depositCoords.toLowerCase() == "auto") {

                        let foundChest = await bot.botUser.findBlockSync({
                            point: bot.botUser.entity.position,
                            matching: [mcdata.blocksByName["trapped_chest"].id, mcdata.blocksByName["chest"].id],
                            maxDistance: 50,
                            count: 1
                        });


                        if (!foundChest) {
                            bot.occupation.currentlyOccupied.busy = false;
                            bot.occupation.farming.currentlyFarming = false;
                            bot.occupation.currentlyOccupied.occupation = "";

                            return interaction.message.channel.send(`<@${interaction.user.id}> No deposit chest found by: ${bot.username}. Bot was stopped.`);
                        }

                        bot.occupation.farming.depositVec = foundChest[0].position;
                    } else {
                        bot.occupation.farming.depositVec = new Vec3(parseInt(bot.occupation.farming.depositCoords.split(", ")[0]), parseInt(bot.occupation.farming.depositCoords.split(", ")[1]), parseInt(bot.occupation.farming.depositCoords.split(", ")[2]))
                    }
                }
                bot.occupation.farming.beforeDepositVec = bot.botUser.entity.position;
                //bot.botUser.pathfinder.goto(new GoalGetToBlock(bot.occupation.farming.depositVec.x, bot.occupation.farming.depositVec.y, bot.occupation.farming.depositVec.z), depositLoot);

                if (pathfinding) {
                    await bot.botUser.pathfinder.goto(new GoalNear(bot.occupation.farming.depositVec.x, bot.occupation.farming.depositVec.y, bot.occupation.farming.depositVec.z, 1.5), depositLoot);
                } else {

                    return console.log("not pathfinding - end (do smtn)")

                }
            }


            async function depositLoot() {
                console.log("depositLoot")

                let chestToOpen = bot.botUser.blockAt(bot.occupation.farming.depositVec)
                let chest;
                try {
                    chest = await bot.botUser.openContainer(chestToOpen);
                    bot.occupation.farming.depositing = true;
                } catch (error) {
                    let err = error;
                    console.log(error)
                }

                for (slot of bot.botUser.inventory.slots) {
                    let cropNamesArray = ["wheat", "carrot", "potato", "pumpkin", "melon", "wheat_seeds"];
                    if (slot && cropNamesArray.includes(slot.name)) {
                        try {
                            console.log(slot.count)
                            //if(slot.name == "wheat_seeds") {
                            //    await chest.deposit(slot.type, null, slot.count, depositError)}
                            //    else await chest.deposit(slot.type, null, slot.count, depositError)



                            await chest.deposit(slot.type, null, slot.count, (error) => {
                                if (error) {
                                    if (error.toString().toLowerCase().includes("destination full")) {
                                        a

                                        bot.occupation.farming.currentlyFarming = false;
                                        let errorChannel = interaction.guild.channels.cache.get(s.errorLoggingChannel)
                                        if (errorChannel) errorChannel.send(`<@${interaction.user.id}> ${bot.username}'s despoit chest is full. Bot has been stopped.`)
                                        else interaction.message.channel.send(`<@${interaction.user.id}> ${bot.username}'s despoit chest is full. Bot has been stopped.`);

                                        chest.close();
                                        return;

                                    }
                                }

                            })

                        } catch (error) {
                            console.log(error)
                        }
                    }
                }

                try {

                    /*await chest.withdraw(295, null, 3, testCallback);

                    if (bot.occupation.farming.crop == "carrots") await chest.withdraw(391, null, 3);
                    if (bot.occupation.farming.crop == "potatoes") await chest.withdraw(392, null, 3);   

                    bot.occupation.farming.cropCount = 0;
                    await chest.close();*/

                    await chest.close()
                    chest = await bot.botUser.openContainer(chestToOpen);
                    if (bot.occupation.farming.crop == "wheat") await chest.withdraw(295, null, 3);
                    if (bot.occupation.farming.crop == "carrots") await chest.withdraw(391, null, 3);
                    if (bot.occupation.farming.crop == "potatoes") await chest.withdraw(392, null, 3);
                    //await equipItem(bot.occupation.farming.cropSeed, "hand")

                    bot.occupation.farming.cropCount = 0;
                    await chest.close();

                } catch (error) {
                    console.log(error)
                }


                //bot.botUser.pathfinder.goto(new GoalGetToBlock(bot.occupation.farming.beforeDepositVec.x, bot.occupation.farming.beforeDepositVec.y, bot.occupation.farming.beforeDepositVec.z), await resumeFarming);

                if (pathfinding) {
                    await bot.botUser.pathfinder.goto(new GoalNear(bot.occupation.farming.beforeDepositVec.x, bot.occupation.farming.beforeDepositVec.y, bot.occupation.farming.beforeDepositVec.z, 1), resumeFarming);
                } else {
                    return console.log("not pathfinding - end (do smtn)")
                }


                function resumeFarming() {
                    bot.occupation.farming.harvest.waiting = true;
                    farmLooping()
                    checkInventory()
                }
            }


            async function farmLoop() {

                
                    if (bot.occupation.farming.harvest.waiting) {
                        let findCrop = await readyCrop();
                        if (findCrop) {
                            if (findCrop.length >= 1) {
                                bot.occupation.farming.harvest.cropBlock = findCrop[0];
                                bot.occupation.farming.harvest.waiting = false;

                            }
                        }
                    }
                
            if (!bot.occupation.farming.harvest.moving) {
                if (!bot.occupation.farming.harvest.waiting) {
                    await delay(20)
                    console.log(bot.occupation.farming.harvest.waiting)

                    if (pathfinding) {
                        //bot.occupation.farming.harvest.moving = true;
                        let block = bot.occupation.farming.harvest.cropBlock.position;

                        try {
                            console.log("pathfind")
                            bot.botUser.pathfinder.goto(new GoalNear(block.x, block.y, block.z, 1), breakCrop);
                            console.log("pathfind111")
                        } catch (error) {
                            console.log(error)
                        }

                        async function breakCrop(err, result) {
                            console.log("breakCrop")
                            if (!err) {
                                try {
                                    console.log("breakCrop1111")
                                    console.log(result)
                                    await bot.botUser.dig(bot.occupation.farming.harvest.cropBlock, equipSeed);
                                } catch (error) {
                                    console.log(error)
                                }
                            } else {
                                console.log(err);;
                            }
                        }

                        async function equipSeed(err) {
                            console.log("equipSeed")
                            if (!err) {
                                try {
                                    console.log("equipSeed111")

                                    await bot.botUser.dig(bot.occupation.farming.harvest.cropBlock, plantSeed);
                                } catch (error) {
                                    console.log(error)
                                }
                            } else {
                                console.log(err)
                            }
                        }

                        async function plantSeed(err) {
                            console.log("plantSeed")
                            if (!err) {
                                console.log("plantSeed111")
                                try {
                                    await equipItem(bot.occupation.farming.cropSeed, "hand");

                                    let dirt = bot.botUser.blockAt(bot.occupation.farming.harvest.cropBlock.position.offset(0, -1, 0));

                                    try {
                                        await delay(50)
                                        await bot.botUser.placeBlock(dirt, new Vec3(0, 1, 0));

                                        bot.botUser.setControlState('forward', true);
                                        await delay(175);
                                        bot.botUser.setControlState('forward', false);
                                        await delay(300);
                                        bot.occupation.farming.harvest.waiting = true;
                                        bot.occupation.farming.harvest.moving = false;
                                        console.log(bot.occupation.farming.harvest.waiting)

                                    } catch (error) {
                                        if (!error.toString().includes("the block is still air")) console.log(error)
                                    }

                                } catch (error) {
                                    console.log(error)
                                }
                            } else {
                                console.log(err)
                            }
                        }



                    } else {
                        await bot.botUser.lookAt(bot.occupation.farming.harvest.cropBlock.position);

                        try {

                            let distance = bot.botUser.entity.position.distanceTo(bot.occupation.farming.harvest.cropBlock.position) < 0.5;
                            if (bot.occupation.farming.crop == "pumpkin" || bot.occupation.farming.crop == "melon_block") distance = bot.botUser.entity.position.distanceTo(bot.occupation.farming.harvest.cropBlock.position) < 2;


                            if (distance) {
                                bot.botUser.setControlState('forward', false);


                                if (bot.occupation.farming.crop != "pumpkin" && bot.occupation.farming.crop != "melon_block") {

                                    if (!bot.botUser.heldItem || bot.botUser.heldItem.name != bot.occupation.farming.cropSeed) {
                                        try {

                                            try {
                                                //await bot.botUser.equip(seeds, null);
                                                //let seedsInHand = await equipItem(bot.occupation.farming.cropSeed, "hand")
                                                console.log("is here1")
                                                //await equipItem(bot.occupation.farming.cropSeed, "hand");

                                                //let item = bot.botUser.inventory.items().filter(item => item.name === bot.occupation.farming.cropSeed)[0];
                                                //console.log("lmao2")
                                                //bot.botUser.equip(item, "hand", check);
                                                //console.log("lmao3")
                                                //
                                                //async function check(err){
                                                //    console.log(err)
                                                //    if(err) interaction.message.channel.send(`<@${interaction.user.id}> ${bot.username} was unable to equip ${bot.occupation.farming.cropSeed}.`);
                                                //}

                                                await equipItem(bot.occupation.farming.cropSeed, "hand");

                                                console.log("is here2")

                                                //if(!seedsInHand) interaction.message.channel.send(`<@${interaction.user.id}> ${bot.username} does not have any seeds.`);

                                            } catch (error) {
                                                console.log(error)
                                            }


                                        } catch (error) {

                                            console.log(error)

                                            if (bot.occupation.farming.crop == "wheat") {
                                                let errorChannel = interaction.guild.channels.cache.get(s.errorLoggingChannel)
                                                if (errorChannel) {
                                                    errorChannel.send(`<@${interaction.user.id}> ${bot.username} does not have any seeds.`);
                                                } else {
                                                    interaction.message.channel.send(`<@${interaction.user.id}> ${bot.username} does not have any seeds.`);
                                                }
                                            } else {
                                                let err = error;
                                            }
                                        }
                                    }

                                    console.log("is here3")


                                    let dirt = bot.botUser.blockAt(bot.occupation.farming.harvest.cropBlock.position.offset(0, -1, 0));

                                    try {
                                        await bot.botUser.placeBlock(dirt, new Vec3(0, 1, 0));
                                    } catch (error) {
                                        if (!error.toString().includes("the block is still air")) console.log(error)
                                    }
                                }

                                bot.botUser.setControlState('forward', true);
                                await delay(175);
                                bot.botUser.setControlState('forward', false);
                                await delay(300);
                                bot.occupation.farming.harvest.waiting = true;
                            } else {
                                bot.botUser.setControlState('forward', true);
                            }
                        } catch (error) {
                            console.log(error)
                        }
                    }
                }
            }
            }

            async function readyCrop() { //findBlockSync

                console.log("readyCrop")


                if (bot.occupation.farming.crop == "pumpkin" || bot.occupation.farming.crop == "melon_block") {

                    return bot.botUser.findBlockSync({
                        point: bot.botUser.entity.position,
                        matching: (blk) => {
                            return (blk.name == bot.occupation.farming.crop);
                        },
                        maxDistance: range,
                        count: 1,
                    })

                    //return bot.botUser.findBlock({
                    //    maxDistance: 50,
                    //    matching: (blk) => {
                    //        return (blk.name == bot.occupation.farming.crop);
                    //    }
                    //});

                } else {
                    console.log(bot.occupation.farming.crop)

                    try {
                        return await bot.botUser.findBlockSync({
                            point: bot.botUser.entity.position,
                            matching: (blk) => {
                                //return (blk.name == bot.occupation.farming.crop && blk.metadata == 7);
                                return (blk.metadata == 7 && blk.name == bot.occupation.farming.crop);
                            },
                            maxDistance: range,
                            count: 1,
                        });
                    } catch (error) {
                        console.log("could not find block")
                        return false;
                    }


                    //return bot.botUser.findBlock({
                    //    maxDistance: 50,
                    //    matching: (blk) => {
                    //        return (blk.name == bot.occupation.farming.crop && blk.metadata == 7);
                    //    }
                    //});
                }
            }




            async function equipItem(name, destination) {
                const item = itemByName(name)
                if (item) {
                    try {
                        await bot.botUser.equip(item, destination)
                        bot.botUser.chat(`/m OHMelin equipped ${name}`)
                    } catch (err) {
                        bot.botUser.chat(`/msg OHMelin cannot equip ${name}: ${err.message}`)
                    }
                } else {
                    bot.botUser.chat(`/msg OHMelin I have no ${name}`)
                }
            }



            function itemByName(name) {
                const items = bot.botUser.inventory.items()
                console.log(name)
                return items.filter(item => item.type === 295)[0]
            }


            /*
            async function equipItem(name, destination) {
                //const item = await itemByName(name)
                console.log("equipItem")
                let item = bot.botUser.inventory.items().filter(item => item.name === name)[0];
                if (item) {
                    await bot.botUser.equip(item, destination, checkIfEquipped);
                } else {
                    console.log("noooooo")
                    interaction.message.channel.send(`<@${interaction.user.id}> ${bot.username} does not have any seeds. 11111`);
                }

                async function checkIfEquipped(err) {
                    console.log("checkIfEquipped")
                    if (err) {
                        let errorChannel = interaction.guild.channels.cache.get(s.errorLoggingChannel)
                        if (errorChannel) {
                            errorChannel.send(`<@${interaction.user.id}> ${bot.username} was unable to equip ${name}.`);
                        } else {
                            interaction.message.channel.send(`<@${interaction.user.id}> ${bot.username} was unable to equip ${name}.`);
                        }
                    }
                }
            }

            async function itemByName(name) {
                return bot.botUser.inventory.items().filter(item => item.name === name)[0]
            }*/



            let ControlButtons = interaction.message.components[1];
            ControlButtons.components[0].setDisabled(true);
            ControlButtons.components[1].setDisabled(false);
            ControlButtons.components[2].setDisabled(true);


            let farmEmbed = new Discord.MessageEmbed()
                .setColor(s.embedColor)
                .setAuthor({
                    name: "Farm using: " + bot.username,
                    iconURL: `http://cravatar.eu/head/${bot.username}/32.png`
                })
                .setDescription(`Select the crop type in the menu beneath and use the buttons to start farming. \n\n` +
                    `🔸 \`Deposit Chest\`\n⤷  **Coords:** ${bot.occupation.farming.depositCoords}`
                )
                //`Currently Farming: \`${bot.occupation.farming.currentlyFarming}\`\n` +
                //`Current Crop: \`${bot.occupation.farming.crop}\`\n` +
                //`Deposit Chest Coords: \`${bot.occupation.farming.depositCoords}\`\n`)
                .setFooter(`${interaction.user.tag}`)
                .setThumbnail(`https://mc-heads.net/player/${bot.username}`)


            interaction.update({
                embeds: [farmEmbed],
                components: [interaction.message.components[0], ControlButtons]
            })

        })
    }
}