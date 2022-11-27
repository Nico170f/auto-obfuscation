const Discord = require('discord.js');
//const bot = new Discord.Client
const Client = require('../../../bot.js');
const mineflayer = require('mineflayer');
const c = require("chalk");
const Canvas = require("canvas");
const Vec3 = require('vec3').Vec3;
const fs = require("fs");
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const socks = require('socks').SocksClient
const ProxyAgent = require('proxy-agent')

//Plugins
const autoeat = require("mineflayer-auto-eat")
const pathfinder = require('mineflayer-pathfinder').pathfinder
const blockFinderPlugin = require('mineflayer-blockfinder')(mineflayer);

//Variables
let loggedIn = [];
const invalidAccounts = [];
const errorAccounts = [];
const usedEmails = [];
const usedProxies = []; //!What? 
let autoRelogData = {
    queue: [],
    waiting: false,
    timer: 5
};
var CurrentlyLoading = false;
let throttled = false;
let currentProxy = 0;
let accountsOnProxy = 0;
let credentials;
let proxies;
let randomProxies;
var interaction;
var stopLoading = false;


//Temp variables
let throttleTime = 100;
let autoRelogEnabled = true;


const debug = false;


async function startUp(MessageInteraction, multiple) {
    if (interaction != MessageInteraction) interaction = MessageInteraction;
    CurrentlyLoading = true;
    stopLoading = false;
    await startLoading(multiple)
}


async function startLoading(multiple) {
    await checkStatus(false, async function () {
        await checkData(async function () {
            await getThrottle(async function () {
                await getAccount(multiple, async function (account) {
                    await createBot(account, multiple)
                })
            })
        })
    })
}


async function checkStatus(stop, callback) {
    if (stop) stopLoading = true;
    else {
        if (stopLoading) Ready()
        else callback()
    }
}


async function createBot({
    username,
    password
}, multiple, autorelog) {

    if (debug) console.log(username + " " + password)

    fs.readFile("./Settings.json", "utf8", async function (err, data) {
        var s = JSON.parse(data);
        let bot = null;

        if (s.useProxies) {

            getProxy(cProxy, async function () {
                process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
                bot = mineflayer.createBot({
                    username: username,
                    password: password,
                    host: s.serverIP,
                    port: s.port,
                    version: s.version, //!---------
                    viewDistance: s.renderDistance.toLowerCase(),
                    auth: 'microsoft',
                    agent: new ProxyAgent({
                        protocol: 'socks5:',
                        host: cProxy.split(":")[0],
                        port: parseInt(cProxy.split(":")[1]),
                        username: cProxy.split(":")[2],
                        password: cProxy.split(":")[3]
                    }),

                    connect: (client) => {
                        socks.createConnection({
                            proxy: {
                                host: cProxy.split(":")[0],
                                port: parseInt(cProxy.split(":")[1]),
                                type: 5,
                                userId: cProxy.split(":")[2],
                                password: cProxy.split(":")[3]
                            },
                            command: 'connect',
                            destination: {
                                host: s.serverIP,
                                port: s.port
                            }
                        }, (err, info) => {
                            if (err) {
                                if (debug) console.log("Here: ")
                                return console.log(err)
                            }
                            client.setSocket(info.socket)
                            client.emit('connect')
                        })
                    }
                });
            })

        } else {
            if(debug) console.log("not using proxies")
            try {
                bot = mineflayer.createBot({
                    host: s.serverIP,
                    port: s.port,
                    username,
                    password,
                    version: s.version,
                    viewDistance: s.renderDistance.toLowerCase(),
                    auth: 'microsoft'
                })
            } catch (error) {
                if(debug) console.log("here222")
                console.log(error)
            }
        }

        registerEvents(interaction, bot, username, password, async function () {


            if (autorelog) {
                autoRelogData.queue.splice(0, 1);
                if (autoRelogData.queue.length) {
                    setTimeout(() => {
                        createBot(autoRelogData.queue[0], {}, true)
                    }, s.joinSpeed * 1000)
                }

            } else {

                if (multiple.multiple) {
                    if (multiple.loaded.currentlyLoaded == multiple.loaded.amount - 1) {

                        Ready(true);

                    } else {

                        let returndata = multiple;
                        returndata.loaded.currentlyLoaded++;
                        updateMessage(false)

                        setTimeout(() => {
                            startLoading(returndata)
                        }, s.joinSpeed * 1000)

                    }

                } else {
                    Ready(true);
                }
            }

        })
    })
}


async function autoRelog() {

    if(CurrentlyLoading) return;

    if (autoRelogData.waiting) {
        let timerCheck = setInterval(async function () {
            if(debug) console.log("timer is: " + autoRelogData.timer)
            if (autoRelogData.timer <= 0) {
                clearInterval(timerCheck)
                await createBot(autoRelogData.queue[0], {}, true)
                autoRelogData.waiting = false;
                autoRelogData.timer = 5;
            } else {
                autoRelogData.timer -= 1;
                if(debug) console.log("timer is now: " + autoRelogData.timer)
            }
        }, 1000)

    }
}

async function registerEvents(msginteraction, bot, username, password, callback) {
    fs.readFile("./Settings.json", "utf8", async function (err, data) {
        var s = JSON.parse(data);

        //Instant Loading
        if(s.joinSpeed == 0) callback();


        //Loading plugins
        if (s.autoEat) bot.loadPlugin(autoeat)
        bot.loadPlugin(pathfinder)
        bot.loadPlugin(blockFinderPlugin);



        //Login event
        bot.once('login', async function () {

            console.log(c.bold.greenBright(`[LOGIN] `) + c.reset.bold(`${bot.username}`) + c.reset(" succesfully logged in!"))
            let avatarLink = await Canvas.loadImage(`http://cravatar.eu/head/${bot.username}/32.png`);

            loggedIn.push({
                username: bot.username,
                email: username,
                pass: password,
                avatar: avatarLink,
                selected: false,
                loginTimestamp: new Date().getTime(),

                occupation: {
                    currentlyOccupied: {
                        busy: false,
                        occupation: ""
                    },

                    farming: {
                        currentlyFarming: false,
                        crop: "wheat",
                        cropSeed: "wheat_seeds",
                        depositCoords: "Auto",
                        beforeDepositVec: new Vec3(),
                        depositVec: new Vec3(),
                        harvest: {
                            cropBlock: Object,
                            waiting: true,
                            moving: false
                        },
                        cropCount: 0,
                        seedCount: 0
                    },

                    follow: {
                        followingPlayer: false,
                        playerIGN: ""
                    },

                    fishing: false,
                    sandPrinting: false
                },

                reconnect: {},
                botUser: bot
            })


            if (s.autoSelect) loggedIn[loggedIn.length - 1].selected = true;
            if (CurrentlyLoading) updateMessage(false)


            if(s.joinSpeed != 0) callback();
        })


        //Spawn Event
        bot.once('spawn', async function () {
            if (s.joinCommand != "" && s.joinCommand.toLowerCase() != "none") bot.chat(s.joinCommand);
            if (s.autoEat) {
                bot.autoEat.options = {
                    priority: "saturation",
                    startAt: 16,
                    bannedFood: ["golden_apple", "enchanted_golden_apple", "rotten_flesh"],
                }
            }
        })


        //End Event
        bot.on('end', function (reason) {
            if(debug) console.log("run end")

            if(debug) console.log("end " + reason)


            getLoadingStatus(async function (loading) {
                if (loading) {
                    console.log(c.bold.yellowBright(`[ERROR] `) + c.reset.bold(`${username}`) + c.reset(" was removed from the server. (Banned, kicked, etc.)"))


                    if (!errorAccounts.includes(username)) {
                        errorAccounts.push(username)
                        console.log(c.bold.yellowBright(`[ERROR] `) + c.reset.bold(`${username}`) + c.reset(" couldn't join the server."))
                    }

                    updateMessage(false)

                } else {

                    console.log(c.bold.yellowBright(`[ERROR] `) + c.reset.bold(`${username}`) + c.reset(" was removed from the server. (Banned, kicked, etc.)"))
                    errorAccounts.push(username)

                }
            })

            let finished = false;
            loggedIn.forEach((data, i) => {
                if (finished) return;
                if (data.email == username) {
                    if (autoRelogEnabled) {
                        autoRelogData.queue.push({
                            username,
                            password
                        })
                        if (!autoRelogData.waiting) {
                            autoRelogData.waiting = true
                            autoRelog();
                        } else {
                            autoRelogData.timer = 5;
                        }
                    }

                    loggedIn.splice(i, 1)
                    finished = true;
                }
                i++;
            })
            if(CurrentlyLoading){
                if(s.joinSpeed != 0) callback();
            }
        })




        //Kicked Event
        bot.on('kicked', async function (reason) {
            if(debug) console.log("run kicked")

            let repreason = null;

            try {
                repreason = JSON.parse(reason);
            } catch (error) {
                console.log(error)
                if (error) repreason = null;
            }

            let responselog = "";
            if (repreason != null) {
                if (repreason.extra) {
                    if (repreason.extra.length) {

                        await console.log(c.bold.gray("[LOG START]"))
                        await repreason.extra.forEach(async (data) => {
                            console.log(c.bold.redBright("-> ") + c.reset(data.text.replace(/\n/g, "")));
                            responselog = responselog + `-> ${data.text.replace(/\n/g,"")}\n`
                        })

                        if (repreason.text.length) await console.log(c.bold.redBright("-> ") + c.reset(repreason.text))
                        await console.log(c.bold.gray("[LOG END]"))
                    }
                } else {
                    await console.log(c.bold.gray("[LOG START]"))
                    await console.log(repreason)
                    await console.log(c.bold.gray("[LOG END]"))
                }
            } else {
                console.log(reason)
                responselog = reason;
            }




            await new Promise(resolve => setTimeout(resolve, 500))

            if (reason.toLowerCase().includes("throttled")) {
                throttled = true;

                if (errorAccounts.includes(username)) {
                    errorAccounts.forEach((entry, i) => {
                        if (entry == username) {
                            errorAccounts[i] = errorAccounts[i] + " (Connection Throttled)";
                        }
                        i++;
                    })
                }
            }


            if (reason.toLowerCase().includes("banned")) {
                if (errorAccounts.includes(username)) {
                    errorAccounts.forEach((entry, i) => {
                        if (entry == username) {
                            errorAccounts[i] = errorAccounts[i] + " (Banned)";
                        }
                        i++;
                    })
                }
            }


            if (s.errorLogging) {
                if (!s.errorLoggingChannel || s.errorLoggingChannel == "Not set.") {
                    console.log(c.bold.redBright('ErrorLogging is enabled but no channel is set.'))
                } else {

                    Client.client.channels.fetch(s.errorLoggingChannel)
                    .then((channel) => {
                        if(channel){
                            let errorMessage = new Discord.MessageEmbed()
                            .setColor(s.embedColor)
                            .setAuthor({
                                name: `${bot._client.username}`,
                                iconURL: `http://cravatar.eu/head/${bot._client.username}/32.png`
                            })
                            .setDescription(`Bot: **${bot._client.username}** (\`${username}\`)` + " caused an error. Details regarding the error are listed below:")
                            .addField("Error:", `\`\`\`diff\n${responselog}\`\`\``)
    
                            channel.send({embeds: [errorMessage]})
                        } else {
                            console.log(c.bold.redBright(`ErrorLogging channel (${s.errorLoggingChannel}) was not found.`))
                        }
                    })
                    .catch(console.error)
                }
            }
        })





        bot.on('error', async function (err) {
            if(debug) console.log("error caused here: 1111")
            if (err.toString().includes("Invalid credentials.")) {
                if (!invalidAccounts.includes(username)) {
                    invalidAccounts.push(username)
                    console.log(c.bold.redBright(`[Invalid] `) + c.reset.bold(`${username}`) + c.reset(" - Invalid credentials."))

                }
            } else {
                if (!errorAccounts.includes(username)) {
                    errorAccounts.push(username)
                    console.log(c.bold.yellowBright(`[ERROR] `) + c.reset.bold(`${username}`) + c.reset(" couldn't join the server."))

                }
            }


            if (s.errorLogging) {
                if (!s.errorLoggingChannel || s.errorLoggingChannel == "Not set.") {
                    console.log(c.bold.redBright('ErrorLogging is enabled but no channel is set.'))
                } else {
                    Client.client.channels.fetch(s.errorLoggingChannel)
                    .then((channel) => {
                        if(channel){

                            let errorMessage = new Discord.MessageEmbed()
                            .setColor(s.embedColor)
                            .setDescription("Account: " + username)
                            .addField("Error:", `\`\`\`${err.toString()}\`\`\``)

                            channel.send({embeds: [errorMessage]})
                        } else {
                            console.log(c.bold.redBright(`ErrorLogging channel (${s.errorLoggingChannel}) was not found.`))
                        }
                    })
                    .catch(console.error)
                }
            }
        })



        //Health Update Event
        if (s.autoEat) {
            bot.on("health", () => {
                if (bot.food === 20) bot.autoEat.disable()
                else bot.autoEat.enable()
            })
        }
    })
}



async function Ready(amount) {

    updateMessage(true, false, interaction)

}


async function updateMessage(ready, autorelog, msginteraction) {
    if (!autorelog) {
        if(CurrentlyLoading){
            fs.readFile("./Settings.json", "utf8", async function (err, data) {
                var s = JSON.parse(data);
    
                let error = errorAccounts.map((user) => `${user}\n`).toString().split(",").join("");
                if (errorAccounts.length == 0) error = "-";
    
                let invalid = invalidAccounts.map((user) => `${user}\n`).toString().split(",").join("");
                if (invalidAccounts.length == 0) invalid = "-";
    
                let embed = await interaction.message.embeds[0];
                embed.setDescription(embed.description.split("Currently loaded: ")[0] + `Currently loaded: **${loggedIn.length}/${credentials.length}**`)
                embed.fields[0].value = `\`\`\`${error}\`\`\``
                embed.fields[1].value = `\`\`\`${invalid}\`\`\``
    
    
                if (!ready) {
                    await interaction.message.edit({
                        embeds: [embed]
                    })
                } else {

                    CurrentlyLoading = false;

                    let OldComponent = interaction.message.components[0];
                    OldComponent.components[0].disabled = false
                    OldComponent.components[1].disabled = false
                    OldComponent.components[2].disabled = true
    
                    await interaction.editReply("Finished...").then(data => {
                        setTimeout(function () {
                            data.delete()
                        }, 500)
                    })
    
                    await interaction.message.edit({
                        embeds: [embed],
                        components: [OldComponent]
                    })

                    console.log(c.bold.green(`[Account Loading]`) + c.reset.bold(" Loading accounts has finished."))
                    interaction = null
    
                }
            })
        }
    }
}


async function getAccount(multiple, callback) {

    //console.log(usedEmails)

    await updateUsedEmails()

    //console.log(usedEmails)

    var index = 0;
    while (usedEmails.includes(credentials[index].username) || invalidAccounts.includes(credentials[index].username)) {
        if (index == credentials.length - 1) {
            if (!multiple.multiple) return Ready(1)
            return Ready(multiple.loaded.currentlyLoaded)
        } else {
            index++;
        }
    }

    usedEmails.push(credentials[index].username)
    callback(credentials[index])
}


async function updateUsedEmails(callback) {
    if (loggedIn.length) {
        loggedIn.forEach((data, i) => {
            if (!usedEmails.includes(data.email)) usedEmails.splice(i, 1)
        })
    }
}

async function getThrottle(callback) {

    if (throttled) {

        interaction.followUp({
            content: "Bots are currently throttled, waiting: x"
        })

        delay(throttleTime)
        throttled = false;
        callback()
    } else {
        callback()
    }
}



async function checkData(callback) {
    fs.readFile("./Settings.json", "utf8", async function (err, data) {
        var s = JSON.parse(data);
        if (err) return console.log(err);

        try {

            credentials = JSON.parse(fs.readFileSync("./Accounts.json"));
            proxies = JSON.parse(fs.readFileSync("./Proxies.json"));
            randomProxies = proxies.slice(0);

        } catch (err) {
            console.log(err)
        }

        if (!credentials.length) return await Cancel(interaction, "No accounts found. Please either add accounts using '.accounts', or add them manually in the 'Accounts.json' file.");
        if (credentials[0].username == "exampleEmail1") return await Cancel(interaction, "The 'Accounts.json' file still contains example accounts. Please remove them and add new ones using '.accounts' or manually update the 'Accounts.json' file.");

        if (s.useProxies) {

            if (!proxies.length) return await Cancel(interaction, "You're currently attempting to load accounts using proxies without any proxies saved. Please add them inside the 'Proxies.json' file.");
            if (proxies[0].split(":")[0] == "address") return await Cancel(interaction, "The 'Proxies.json' file still contains example proxies. Please remove them and add new ones in the file.");

        }

        callback()


        async function Cancel(messageInteraction, input) {

            CurrentlyLoading = false;

            let OldComponent = messageInteraction.message.components[0];
            OldComponent.components[0].disabled = false
            OldComponent.components[1].disabled = false
            OldComponent.components[2].disabled = true

            await messageInteraction.message.edit({
                components: [OldComponent]
            })
            await messageInteraction.editReply({
                content: input
            })

        }
    })
}

async function getProxy(callback) {
    fs.readFile("./Settings.json", "utf8", async function (err, data) {
        var s = JSON.parse(data);
        let deliverProxy;

        if (s.randomizeOrder) {

            if (!randomProxies.length) randomProxies = proxies.slice(0);
            deliverProxy = randomProxies[Math.floor(Math.random() * randomProxies.length)];

            randomProxies.forEach((proxy, i = 0) => {
                if (proxy == deliverProxy) randomProxies.splice(i, 1)
            })

        } else {

            accountsOnProxy++;
            if (accountsOnProxy >= s.accountsPerProxy) {
                if (currentProxy == proxies.length - 1) {
                    currentProxy = 0;
                } else {
                    currentProxy++;
                }
                accountsOnProxy = 0;
            }
            deliverProxy = proxies[currentProxy]
        }


        callback(deliverProxy)
    })
}

async function getLoadingStatus(callback) {
    callback(CurrentlyLoading)
}

async function removeLogin(callback){

    if(debug) console.log("loggedIn.length " + loggedIn.length)
    let copy = loggedIn.splice(0)
    if(debug) console.log("copy.length " + copy.length)

    copy = loggedIn.filter(a => a.selected !== true)
    if(debug) console.log("copy.length " + copy.length)

    loggedIn = copy.splice(0)
    if(debug) console.log("loggedIn.length " + loggedIn.length)

    //loggedIn.splice(0,1)

    callback()
}


module.exports = {
    loggedIn,
    startUp,
    getLoadingStatus,
    checkStatus,
    removeLogin
}