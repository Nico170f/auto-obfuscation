const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const GoalFollow = goals.GoalFollow;
const chalk = require("chalk");
const AccountLoading = require("../Functions/AccountLoading.js")
const fs = require("fs");
const { Vec3 } = require('vec3')



module.exports = {
    name : 'follow',
    aliases: ["f"],
    run : async(client, message, args, Discord) => {
        fs.readFile("./Settings.json", "utf8", function (err, data) {
        var s = JSON.parse(data);
        let loggedIn = AccountLoading.loggedIn;

        let selected = false;
        loggedIn.forEach((data) => {
            if (data.selected) {
                selected = true;
            }
        })



        let noAccounts = new Discord.MessageEmbed()
        .setColor(s.embedColor)
        .setDescription("No bots are currently selected! Use `.select` to select an account.")

        let noArgs = new Discord.MessageEmbed()
        .setColor(s.embedColor)
        .setDescription("Use `.follow <IGN>`")


        
        if (!selected) return message.channel.send({embeds: [noAccounts]});
        if (!args[0]) return message.channel.send({embeds: [noArgs]});

        let callBackMessage = "";
        loggedIn.forEach((data) => {
            if (data.selected) {
                
            if(data.occupation.currentlyOccupied.busy && !data.occupation.follow.followingPlayer) {

                let currentlyBusy = new Discord.MessageEmbed()
                .setColor(s.embedColor)
                .setDescription(`Bot: \`${data.username}\` is currently busy \`${data.occupation.currentlyOccupied.occupation}\`.`)
                return message.channel.send({embeds: [currentlyBusy]})
            
            }

            
            if(data.occupation.follow.followingPlayer && data.occupation.follow.playerIGN == args[0]) {
                
                let alreadyFollowing = new Discord.MessageEmbed()
                .setColor(s.embedColor)
                .setDescription(`Bot: \`${data.username}\` is already following \`${args[0]}\`.`)
                return message.channel.send({embeds: [alreadyFollowing]})
            
            }

            
            let followPlayer = data.botUser.players[args[0]] ? data.botUser.players[args[0]].entity : null
            if(!followPlayer) {

                let cantFind = new Discord.MessageEmbed()
                .setColor(s.embedColor)
                .setDescription(`Bot: \`${data.username}\` was not able to find \`${args[0]}\`.`)
                return message.channel.send({embeds: [cantFind]});
                
            }

            if(!data.occupation.currentlyOccupied.busy) data.occupation.currentlyOccupied.busy = true;
            if(!data.occupation.follow.followingPlayer) data.occupation.follow.followingPlayer = true;
            data.occupation.follow.playerIGN = args[0];

            findPlayerLoop(data, args[0]);

            let startedFollowing = new Discord.MessageEmbed()
            .setColor(s.embedColor)
            .setDescription(`Bot: \`${data.username}\` started following \`${args[0]}\`.`)
            message.channel.send({embeds: [startedFollowing]});
            
            }
        })

        async function findPlayerLoop(bot, playerIGN){

        if(!bot.occupation.follow.followingPlayer) {

            let stoppedFollowing = new Discord.MessageEmbed()
            .setColor(s.embedColor)
            .setDescription(`Bot: \`${bot.username}\` stopped following: \`${bot.occupation.follow.playerIGN}\`.`)

            bot.occupation.currentlyOccupied.busy = false;
            bot.occupation.currentlyOccupied.occupation = "";
            bot.occupation.follow.playerIGN = "";

            bot.botUser.setControlState('forward', false);
            bot.botUser.setControlState('jump', false);
            
            return message.channel.send({embeds: [stoppedFollowing]})

        }


        await followPlayer(bot, playerIGN)
        setTimeout(async function(){

            findPlayerLoop(bot, playerIGN)
            
        }, s.followSpeed)

        }

        async function followPlayer(bot, playerIGN){

            console.log(bot.botUser.food)
            console.log(bot.botUser.foodSaturation)

            //TODO: If all accounts in loggedIn have "following: false" return this function.
            //let followPlayer = bot.botUser.players[playerIGN]
            let followPlayer = bot.botUser.players[playerIGN] ? bot.botUser.players[playerIGN].entity : null
            
            if (!followPlayer) {
                
                let lostTrack = new Discord.MessageEmbed()
                .setColor(s.embedColor)
                .setDescription(`Bot: \`${bot.username}\` lost track of \`${bot.occupation.follow.playerIGN}\`.`)

                bot.botUser.setControlState('forward', false);
                bot.botUser.setControlState('jump', false)
                bot.occupation.currentlyOccupied.busy = false;
                bot.occupation.follow.followingPlayer = false;
                return message.channel.send({embeds: [lostTrack]});
            }

            bot.botUser.lookAt(new Vec3(parseInt(bot.botUser.players[playerIGN].entity.position.x), parseInt(bot.botUser.players[playerIGN].entity.position.y) + 1, parseInt(bot.botUser.players[playerIGN].entity.position.z)))

            try {

                if (bot.botUser.entity.position.distanceTo(bot.botUser.players[playerIGN].entity.position) < 2) {
    
                    bot.botUser.setControlState('forward', false);
                    bot.botUser.setControlState('jump', false)
    
                } else {
    
                    bot.botUser.setControlState('forward', true);

                }

                if(bot.botUser.players[playerIGN].entity.position.y > bot.botUser.entity.position.y) {

                    bot.botUser.setControlState('jump', true)

                } else {

                    bot.botUser.setControlState('jump', false)

                }

            } catch (error) {
    
                //console.log(error)

                let errorFollowing = new Discord.MessageEmbed()
                .setColor(s.embedColor)
                .setDescription(`Follow error using: \`${bot.username}\``)

                return message.channel.send({embeds: [errorFollowing]})
    
            }
        }

        return;

        /*
        if (!selected.length) return message.channel.send({embeds: [noAccounts]});

        //selected.forEach(async (data) => { //!    Using Async?
        
        if (!args[0]) return message.channel.send({embeds: [noArgs]});

        const mcData = require('minecraft-data')(loggedIn[0].botUser.version);


        selected.forEach((data) => {
            let bot = loggedIn[data].botUser;
            bot.loadPlugin(pathfinder);

            let playerFound = bot.players[args[0]]
            if (!playerFound) return message.channel.send({embeds: [cantFind]});

            const movements = new Movements(bot, mcData);
            bot.pathfinder.setMovements(movements);

            const goal = new GoalFollow(playerFound.entity, 1);
            bot.pathfinder.setGoal(goal, true);
        }

        let startedFollowing = new Discord.MessageEmbed()
        .setColor(s.embedColor)
        .setDescription(`Bot: \`${data.username}\` started following \`${args[0]}\`.`)
        message.channel.send({embeds: [startedFollowing]});
        )*/
        })
    }
}