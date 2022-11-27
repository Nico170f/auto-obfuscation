(async () => {

    const debug = false;
    var pjson = require('./package.json');
    const si = require('systeminformation');
    const c = require("chalk");
    const axios = require('axios');
    const fs = require('fs')
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

    console.log(c.bold.white(`[Authentication] `) + c.reset("Loading..."))


    si.system()
        .then(async data => {

            await axios.get(`http://45.140.185.240:8000/license=${data.uuid}`) //http://localhost:8000/${data.uuid}
                //await axios.get(`http://localhost:8000/license=${data.uuid}`)//http://localhost:8000/${data.uuid}
                .then(async (res) => {

                    if (res.data.error) {

                        console.log(c.bold.redBright(`[Authentication Error] `) + c.reset("License: ") + c.reset.bold(`${data.uuid}`) + c.reset(" is invalid."))
                        console.log(c.bold.redBright(`[Info] `) + c.reset("If you're using the bot on a new machine, please update your license/hwid in our discord: Discord.gg/xxxx"))
                        console.log(c.bold.redBright(`[WARN] `) + c.reset(`Window closing in 30 seconds...`))

                        setTimeout(function () {
                            console.log("Stopping...")
                        }, 30000)

                    } else {

                        console.log(c.bold.greenBright(`[Authentication] `) + c.reset("Succesfully authenticated for user: ") + c.bold(res.data[0].userTag) + c.reset(" with the following ID: " + res.data[0].userID))

                        if (res.data[0].version <= pjson.version) {

                            console.log(c.bold.greenBright(`[Updater] `) + c.reset("Bot is up to date."))

                        } else {

                            console.log(c.bold.yellowBright(`[Updater] `) + c.yellowBright("Updates avaliable. Newest version is v") + c.bold.yellowBright(res.data[0].version) + c.yellowBright(", you're running v") + c.bold.yellowBright(pjson.version))
                            delay(300)

                        }

                        console.log(c.green(`[Booting] `) + c.reset("Checking configs... "))
                        fs.access("./Settings.json", fs.F_OK, (err) => {
                            if (err) {

                                let setting = {
                                    serverIP: "localhost",
                                    port: 25565,
                                    version: "1.8",

                                    joinCommand: "",
                                    joinSpeed: 5,
                                    maxAccounts: -1,
                                    throttlingDelay: 5000,

                                    useProxies: false,
                                    randomizeOrder: false,
                                    accountsPerProxy: 1,

                                    embedColor: "2f3136",
                                    permissionRole: "Not Set.",
                                    errorLogging: true,
                                    errorLoggingChannel: "Not set.",
                                    ingameChat: false,
                                    ingameChatChannel: "Not set.",

                                    renderDistance: "normal",
                                    autoSelect: false,
                                    autoEat: false,
                                    followSpeed: 300,

                                    farmingSpeed: 50,
                                    farmingRadius: 50,
                                    depositChestCoords: "Auto",
                                    cropsTillDeposit: 16,
                                    farmCoords: [],

                                    guiderBlock: 'netherrack',
                                    findGuiderBlockRange: 50,
                                    maxGuiderBlocks: 50,
                                    printingGamemode: 'creative',
                                    printingSpeed: 500


                                }

                                fs.appendFileSync('Settings.json', JSON.stringify(setting), function (err) {
                                    if (err) throw err;
                                    else console.log(c.green(`[Booting] `) + c.reset("Created settings file."))
                                });
                            }
                        })


                        if(debug) console.log(c.green(`[Booting] `) + c.reset("Settings done "))



                        fs.access("./Config.json", fs.F_OK, (err) => {
                            if (err) {
                                let config = {
                                    prefix: ".",
                                    token: ""
                                }

                                let data = "{\n" +
                                    `   "prefix": ".",\n` +
                                    `   "token": "Your Token Here"\n` +
                                    `}`

                                fs.appendFileSync('Config.json', JSON.stringify(config, null, 1), function (err) { //JSON.stringify(config)
                                    if (err) throw err;
                                    else console.log(c.green(`[Booting] `) + c.reset("Created config file."))
                                });

                            }
                        })


                        if(debug) console.log(c.green(`[Booting] `) + c.reset("Config done "))


                        fs.access("./Accounts.json", fs.F_OK, (err) => {
                            if (err) {
                                let accounts = [{
                                        username: "exampleEmail1",
                                        password: "examplePassword1"
                                    },
                                    {
                                        username: "exampleEmail2",
                                        password: "examplePassword2"
                                    },
                                    {
                                        username: "exampleEmail3",
                                        password: "examplePassword3"
                                    }
                                ]

                                fs.appendFileSync('Accounts.json', JSON.stringify(accounts, null, 1), function (err) {
                                    if (err) throw err;
                                    else console.log(c.green(`[Booting] `) + c.reset("Created accounts file."))
                                });

                            }
                        })



                        if(debug) console.log(c.green(`[Booting] `) + c.reset("Accounts done "))


                        fs.access("./Proxies.json", fs.F_OK, (err) => {
                            if (err) {

                                let proxies = [
                                    "address:port:username:password",
                                    "address:port:username:password",
                                    "address:port:username:password"
                                ]

                                fs.appendFileSync('Proxies.json', JSON.stringify(proxies, null, 1), 'utf8', function (err) { 
                                    if (err) throw err;
                                    else console.log(c.green(`[Booting] `) + c.reset("Created proxies file."))
                                });
                            }
                        })


                        if(debug) console.log(c.green(`[Booting] `) + c.reset("Proxies done "))



                        const Discord = require("discord.js");
                        const client = new Discord.Client({
                            intents: [
                                Discord.Intents.FLAGS.GUILDS,
                                Discord.Intents.FLAGS.GUILD_MESSAGES,
                                Discord.Intents.FLAGS.GUILD_PRESENCES,
                                Discord.Intents.FLAGS.DIRECT_MESSAGES,
                                Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
                                Discord.Intents.FLAGS.GUILD_MEMBERS,
                                Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
                                Discord.Intents.FLAGS.GUILD_WEBHOOKS,
                                Discord.Intents.FLAGS.GUILD_VOICE_STATES,
                                Discord.Intents.FLAGS.GUILD_INVITES,
                                Discord.Intents.FLAGS.GUILD_BANS,
                            ],
                            partials: ["CHANNEL"]
                        });

                        if(debug) console.log(c.green(`[Booting] `) + c.reset("discord done "))


                        exports.client = client;
                        global.ROOT = {}
                        //ROOT.path = __dirname;
                        //ROOT.config = require(`./Root/Storage/Vault/Config`)
                        client.commands = new Discord.Collection();
                        client.commands.normal = new Discord.Collection();
                        client.events = new Discord.Collection();
                        client.commands.normal.aliases = new Discord.Collection();
                        client.commands.buttons = new Discord.Collection();
                        client.commands.menus = new Discord.Collection();
                        client.commands.slash = new Discord.Collection();

                        if(debug) console.log(c.green(`[Booting] `) + c.reset("Client done "))


                        setTimeout(async function () {

                            const Handler = require(`./Root/Classes/Handlers/Handler`);
                            if(debug) console.log(c.green(`[Booting] `) + c.reset("handler required 1 "))

                            await Handler.loadCommands(client);
                            if(debug) console.log(c.green(`[Booting] `) + c.reset("loadCommands done "))

                            await Handler.loadEvents(client);
                            if(debug) console.log(c.green(`[Booting] `) + c.reset("loadEvents done "))

                            await Handler.loadSelectMenuCommands(client);
                            if(debug) console.log(c.green(`[Booting] `) + c.reset("loadSelectMenuCommands done "))

                            if(debug) console.log(c.green(`[Booting] `) + c.reset("debug 1 "))


                            fs.readFile("./Config.json", "utf8", async function (err, data) {
                                var s = JSON.parse(data);
                                if (!s.token.length) {
                                    setTimeout(async function () {

                                        if(debug) console.log(c.green(`[Booting] `) + c.reset("debug 2 "))


                                        console.log(c.bold.redBright(`[WARN] `) + c.reset("Please set your discord bot token in the Config.json file."))
                                        console.log(c.bold.redBright(`[WARN] `) + c.reset(`Window closing in 30 seconds...`))
                                    }, 1000)

                                    return setTimeout(async function () {
                                        console.log("Closing...")
                                    }, 30000)
                                } else {

                                    try {
                                        await client.login(s.token);
                                    } catch (error) {
                                        if (error.toString().includes("Privileged intent provided is not enabled or whitelisted")) {
                                            console.log(c.bold.redBright(`[WARN] `) + c.reset(`Please enable all intents for your bot application. Found here: https://discord.com/developers/applications`))
                                            console.log(c.bold.redBright(`[WARN] `) + c.reset(`Window closing in 30 seconds...`))
                                            setTimeout(function () {
                                                console.log("Closing...")
                                            }, 30000)
                                        } else {
                                            console.log(error)
                                        }
                                    }

                                }
                            })

                            if(debug) console.log(c.green(`[Booting] `) + c.reset("Config testing done "))

                            await Handler.loadButtonCommands(client);

                            if(debug) console.log(c.green(`[Booting] `) + c.reset("loadButtonCommands testing done "))


                        }, 1500)

}
})
})
.catch(error => {
//console.error(error)
console.log(c.bold.yellowBright(`[ERROR] `) + c.reset("There was an issue starting the bot."))
});

})()