const AccountLoading = require("../Functions/AccountLoading.js")
const fs = require("fs");
const {
    Vec3
} = require('vec3')
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))


let performanceChecking = false;

module.exports = {
    name: "farmingStartButton123123123",
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


            let selected = 0;
            let bot;
            loggedIn.forEach((data) => {
                if (data.selected) {
                    selected++;
                    bot = data;
                }
            })



            //if (!selected.length) return interaction.reply({
            if (selected == 0) return interaction.reply({
                content: "No bot is currently selected! Use `.select` to select an account.",
                ephemeral: true
            })


            //if (selected.length > 1) return interaction.reply({
            if (selected > 1) return interaction.reply({
                content: "Please only select a single bot to do this.",
                ephemeral: true
            }) //return deleteResponse();



            //if(selected[0].username !== interaction.message.embeds[0].author.name.split(": ")[1]) return interaction.reply({
            /*if (bot.username !== interaction.message.embeds[0].author.name.split(": ")[1]) return interaction.reply({
                content: `This menu belongs to **${interaction.message.embeds[0].author.name.split(": ")[1]}**. If you wish to use **${selected[0].username}**, please use \`.farm\`, or select **${interaction.message.embeds[0].author.name.split(": ")[1]}** again using \`.select\`.`,
                ephemeral: true
            })*/


            //if (selected[0].occupation.currentlyOccupied == true && selected[0].occupation.farming.currentlyFarming == false) return interaction.reply({
            if (bot.occupation.currentlyOccupied.busy == true && selected[0].occupation.farming.currentlyFarming == false) return interaction.reply({
                content: `${selected[0].username} is curretly occupied doing a different task.`,
                ephemeral: true
            })

            //if (selected[0].occupation.currentlyOccupied == true && selected[0].occupation.farming.currentlyFarming == true) return interaction.reply({
            if (bot.occupation.currentlyOccupied.busy == true && selected[0].occupation.farming.currentlyFarming == true) return interaction.reply({
                content: `${selected[0].username} is already farming.`,
                ephemeral: true
            })




            bot.occupation.farming.depositVec = bot.occupation.farming.depositCoords;
            bot.occupation.currentlyOccupied.busy = true;
            bot.occupation.farming.currentlyFarming = true;
            bot.occupation.currentlyOccupied.occupation = "farming";
            const mcData = require('minecraft-data')(bot.botUser.version)


            async function checkInventory() {
                setInterval(async function () {
                    if (!bot.occupation.farming.currentlyFarming) return;
                    if (!bot.occupation.farming.depositing) {


                        let countedCropCount = 0;
                        let countedSeedCount = 0;


                        bot.botUser.inventory.items().forEach((data) => {

                            if (bot.occupation.farming.crop == "wheat") {

                                if (data.type == 295) countedSeedCount += data.count;
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



                        bot.occupation.farming.seedCount += (countedSeedCount - bot.occupation.farming.seedCount);
                        bot.occupation.farming.cropCount += (countedCropCount - bot.occupation.farming.cropCount);

                    }
                }, 2000)
            }


            farmLooping();
            checkInventory();


            async function farmLooping() {

                if (!bot.occupation.farming.currentlyFarming) {
                    bot.occupation.currentlyOccupied.busy = false;
                    bot.occupation.currentlyOccupied.occupation = "";
                    bot.occupation.farming.depositing = false;
                    bot.botUser.setControlState('forward', false);
                    bot.botUser.look(0, 0, false);
                    return;
                }

                if (bot.occupation.farming.cropCount > s.cropsTillDeposit || (bot.botUser.inventory.slots.filter(v => v == null).length - 8) < 3) {
                    if (!bot.occupation.farming.depositing) await depositLoop();

                } else await farmLoop();

                setTimeout(farmLooping, 150);
            }


            async function depositLoop() {

                if (typeof bot.occupation.farming.depositVec === 'string' || bot.occupation.farming.depositVec instanceof String) {

                    if (bot.occupation.farming.depositCoords.toLowerCase() == "auto") {
                        let foundChest = bot.botUser.findBlock({
                            matching: [mcdata.blocksByName["trapped_chest"].id, mcdata.blocksByName["chest"].id],
                            maxDistance: 64,
                        });
                        if (!foundChest) {

                            bot.occupation.currentlyOccupied.busy = false;
                            bot.occupation.farming.currentlyFarming = false;
                            bot.occupation.currentlyOccupied.occupation = "";

                            return interaction.message.channel.send(`<@${interaction.user.id}> No deposit chest found by: ${bot.username}. Bot was stopped.`);
                        }

                        bot.occupation.farming.depositVec = foundChest.position;
                    } else {
                        bot.occupation.farming.depositVec = new Vec3(parseInt(bot.occupation.farming.depositCoords.split(", ")[0]), parseInt(bot.occupation.farming.depositCoords.split(", ")[1]), parseInt(bot.occupation.farming.depositCoords.split(", ")[2]))
                    }
                }


                if (!bot.occupation.farming.depositing) {

                    if (bot.occupation.farming.depositVec.y - 0.2 > bot.botUser.entity.position.y) {
                        bot.botUser.setControlState("jump", true)
                    } else {
                        if (bot.botUser.getControlState("jump")) {
                            bot.botUser.setControlState("jump", false)
                        }
                    }


                    if(performanceChecking){

                        if (bot.occupation.farming.position != Math.floor(bot.botUser.entity.position.x).toString() + " " + Math.floor(bot.botUser.entity.position.z).toString()) {
                            bot.occupation.farming.position = Math.floor(bot.botUser.entity.position.x).toString() + " " + Math.floor(bot.botUser.entity.position.z).toString();
                            bot.occupation.farming.samePosition = 0;
        
                            if (bot.botUser.getControlState("jump")) {
                                bot.botUser.setControlState("jump", false)
                            }
                        } else {
                            if (bot.occupation.farming.samePosition >= 10) {
                                bot.botUser.setControlState("jump", true)
                                bot.botUser.setControlState('forward', true);
                            } else {
                                bot.occupation.farming.samePosition++;
                            }
                        }

                    }
    
                    //console.log(bot.occupation.farming.samePosition)
                    //console.log(Math.floor(bot.botUser.entity.position.x).toString() + "   " + bot.botUser.entity.position.x.toString())


                    if (bot.botUser.entity.position.distanceTo(bot.occupation.farming.depositVec) < 2) {
                        bot.botUser.setControlState('forward', false);
                        //bot.occupation.farming.depositing = true;

                        //let chestBlock;
                        //chestBlock = bot.botUser.findBlock({
                        //    matching: [mcdata.blocksByName["trapped_chest"].id, mcdata.blocksByName["chest"].id],
                        //});


                        //let chest = await bot.openContainer(chestBlock);
                        let chestToOpen = bot.botUser.blockAt(bot.occupation.farming.depositVec);
                        let chest;
                        try {
                            chest = await bot.botUser.openContainer(chestToOpen);
                            bot.occupation.farming.depositing = true;
                        } catch (error) {
                            let err = error;
                        }


                        for (slot of bot.botUser.inventory.slots) {
                            //if (slot && slot.name == bot.occupation.farming.crop) {
                            let cropNamesArray = ["wheat", "carrot", "potato", "pumpkin", "melon"];
                            if (slot && cropNamesArray.includes(slot.name)) {
                                try {
                                    await chest.deposit(slot.type, null, slot.count, (error) => {
                                        if (error) {
                                            //console.log(error.toString())
                                            if (error.toString().toLowerCase().includes("destination full")) {

                                                bot.occupation.farming.currentlyFarming = false;

                                                let errorChannel = interaction.guild.channels.cache.get(s.errorLoggingChannel)
                                                if (errorChannel) {
                                                    errorChannel.send(`<@${interaction.user.id}> ${bot.username}'s despoit chest is full. Bot has been stopped.`);
                                                } else {
                                                    interaction.message.channel.send(`<@${interaction.user.id}> ${bot.username}'s despoit chest is full. Bot has been stopped.`);
                                                }

                                                chest.close();
                                                return;

                                            }
                                        }

                                    })
                                } catch (error) {
                                    let err = error;
                                }
                            }
                        }

                        bot.occupation.farming.cropCount = 0;
                        if (bot.occupation.farming.crop == "carrots") await chest.withdraw(391, null, 3)
                        if (bot.occupation.farming.crop == "potatoes") await chest.withdraw(392, null, 3)

                        await chest.close();
                        bot.occupation.farming.depositing = false;

                    } else {
                        bot.botUser.lookAt(bot.occupation.farming.depositVec);
                        bot.botUser.setControlState('forward', true);
                    }
                }
            }

            async function farmLoop() {
                let harvest = readyCrop();

                if (harvest) {
                    bot.botUser.lookAt(harvest.position);

                    if (harvest.position.y - 0.2 > bot.botUser.entity.position.y) {
                        bot.botUser.setControlState("jump", true)
                    } else {
                        if (bot.botUser.getControlState("jump")) {
                            bot.botUser.setControlState("jump", false)
                        }
                    }


                    
                    if(performanceChecking){

                        if (bot.occupation.farming.position != Math.floor(bot.botUser.entity.position.x).toString() + " " + Math.floor(bot.botUser.entity.position.z).toString()) {
                            bot.occupation.farming.position = Math.floor(bot.botUser.entity.position.x).toString() + " " + Math.floor(bot.botUser.entity.position.z).toString();
                            bot.occupation.farming.samePosition = 0;
        
                            if (bot.botUser.getControlState("jump")) {
                                bot.botUser.setControlState("jump", false)
                            }
                        } else {
                            if (bot.occupation.farming.samePosition >= 10) {
                                bot.botUser.setControlState("jump", true)
                                bot.botUser.setControlState('forward', true);
                            } else {
                                bot.occupation.farming.samePosition++;
                            }
                        }

                    }
    
                    //console.log(bot.occupation.farming.samePosition)
                    //console.log(Math.floor(bot.botUser.entity.position.x).toString() + "   " + bot.botUser.entity.position.x.toString())


                    try {

                        let distance = bot.botUser.entity.position.distanceTo(harvest.position) < 0.5;
                        if (bot.occupation.farming.crop == "pumpkin" || bot.occupation.farming.crop == "melon_block") distance = bot.botUser.entity.position.distanceTo(harvest.position) < 2;


                        //if (bot.botUser.entity.position.distanceTo(harvest.position) < 0.5) {
                        if (distance) {
                            bot.botUser.setControlState('forward', false);

                            try {
                                await bot.botUser.dig(harvest);
                            } catch (error) {
                                let err = error;
                            }

                            if (bot.occupation.farming.crop != "pumpkin" && bot.occupation.farming.crop != "melon_block") {

                                if (!bot.botUser.heldItem || bot.botUser.heldItem.name != bot.occupation.farming.cropSeed) {
                                    try {

                                        await bot.botUser.equip(mcData.itemsByName[bot.occupation.farming.cropSeed].id);

                                    } catch (error) {
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

                            

                            let dirt = bot.botUser.blockAt(harvest.position.offset(0, -1, 0));

                            try {
                                await bot.botUser.placeBlock(dirt, new Vec3(0, 1, 0));
                            } catch (error) {
                                let er = error;
                            }
                            }

                            bot.botUser.setControlState('forward', true);
                            await delay(175);
                            bot.botUser.setControlState('forward', false);
                            await delay(300);
                        } else {
                            bot.botUser.setControlState('forward', true);
                        }
                    } catch (err) {
                        //console.log(err);
                    }
                }
            }

            function readyCrop() {
                //console.log(bot.occupation.farming.crop)


                if (bot.occupation.farming.crop == "pumpkin" || bot.occupation.farming.crop == "melon_block") {
                    return bot.botUser.findBlock({
                        maxDistance: 64,
                        matching: (blk) => {
                            return (blk.name == bot.occupation.farming.crop);
                        }
                    });
                } else {
                    return bot.botUser.findBlock({
                        maxDistance: 64,
                        matching: (blk) => {

                            //return (blk.name == harvestName && blk.metadata == 7);
                            return (blk.name == bot.occupation.farming.crop && blk.metadata == 7);
                            //return (blk.name == "potatoes");
                        }
                    });
                }
            }

            const cropMenu = new Discord.MessageActionRow().addComponents(
                new Discord.MessageSelectMenu()
                .setCustomId('ChooseCrop-Menu')
                .setPlaceholder('Select the crop you wish to farm.')
                .addOptions([{
                        label: 'Wheat',
                        value: 'wheat',
                        description: 'Farm Wheat',
                        emoji: "🌾"
                    },
                    {
                        label: "Carrots",
                        value: "carrots",
                        description: "Farm Carrots",
                        emoji: "🥕"
                    },
                    {
                        label: "Potato",
                        value: "potato",
                        description: "Farm Potatoes",
                        emoji: "🥔"
                    },
                    {
                        label: "Pumpkin",
                        value: "pumpkin",
                        description: "Farm Pumpkins",
                        emoji: "🎃"
                    },
                    {
                        label: "Melon",
                        value: "melon",
                        description: "Farm Melons",
                        emoji: "🍉"
                    },

                ])
            )

            const farmControlButtonCurrentlyEnabled = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                    .setCustomId('farmingStartButton')
                    .setLabel('Start Farming')
                    .setStyle('SUCCESS')
                    .setDisabled(true),
                ).addComponents(
                    new Discord.MessageButton()
                    .setCustomId('farmingStopButton')
                    .setLabel('Stop Farming')
                    .setStyle('DANGER')
                    .setDisabled(false),
                ).addComponents(
                    new Discord.MessageButton()
                    .setCustomId('farmingDepositChestButton')
                    .setLabel('Set Deposit Chest')
                    .setStyle('PRIMARY')
                    .setDisabled(true),
                )

            let farmEmbed = new Discord.MessageEmbed()
                .setColor(s.embedColor)
                .setAuthor({
                    name: "Farm using: " + bot.username,
                    iconURL: `http://cravatar.eu/head/${bot.username}/32.png`
                })
                .setDescription(`Select the crop type in the menu beneath and use the buttons to start farming. \n\n` +
                    `Currently Farming: \`${bot.occupation.farming.currentlyFarming}\`\n` +
                    `Current Crop: \`${bot.occupation.farming.crop}\`\n` +
                    `Deposit Chest Coords: \`${bot.occupation.farming.depositCoords}\`\n`)
                .setFooter(`${interaction.user.tag}`)
                .setThumbnail(`https://mc-heads.net/player/${bot.username}`)


            interaction.update({
                embeds: [farmEmbed],
                components: [cropMenu, farmControlButtonCurrentlyEnabled]
            })

        })
    }
}