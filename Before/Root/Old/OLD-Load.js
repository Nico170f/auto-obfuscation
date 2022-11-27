//DEPENDENCIES
const mineflayer = require('mineflayer');
const c = require("chalk");
const Canvas = require("canvas");
const fs = require("fs");
const {
  Vec3
} = require('vec3')
const autoeat = require("mineflayer-auto-eat")
const pathfinder = require('mineflayer-pathfinder').pathfinder
const blockFinderPlugin = require('mineflayer-blockfinder')(mineflayer);

const loggedIn = [];
let mcData;
let firstLogin = false;
let currentlyLoading = false;
let currentProxy = 0;
let accountsOnProxy = 0;




module.exports = {
  name: 'load',
  run: async (client, message, args, Discord) => {
    
    fs.readFile("./Settings.json", "utf8", async function (err, data) {
      var s = JSON.parse(data);


      var credentials;
      try {
        credentials = JSON.parse(fs.readFileSync("./Accounts.json"));
      } catch(err){
        console.log(err)
      }
      var proxies;
      try {
        proxies = JSON.parse(fs.readFileSync("./Proxies.json"));
      } catch(err){
        console.log(err)
      }
      let properRandom = proxies.slice(0);



      let invalidAccounts = [];
      let errorAccounts = [];


      let alreadyLoadingEmbed = new Discord.MessageEmbed()
        .setColor(s.embedColor)
        .setDescription("Accounts are already loading!")

      if (currentlyLoading) return message.channel.send({
        embeds: [alreadyLoadingEmbed]
      });

      currentlyLoading = true;

      let usedEmails = [];
      loggedIn.forEach((data) => {

        usedEmails.push(data.email)

      })


      let maxAccountsMsg = s.maxAccounts;

      let maxAccountsToLogin = usedEmails.length + s.maxAccounts;

      if (args[0]) {

        if (!isNaN(args[0])) {

          maxAccountsToLogin = usedEmails.length + parseInt(args[0]);

          maxAccountsMsg = args[0];

        }

      } else if (!args[0] || isNaN(args[0])) {

        maxAccountsToLogin = -1;

      }

      let amount = credentials.length - loggedIn.length;

      if (maxAccountsToLogin !== -1) {

        amount = maxAccountsToLogin - usedEmails.length;

      }

      console.log(c.bold.greenBright(`[Account Loading]`) + " " + c.reset.bold(`Attempting to load ${amount} accounts.`))


      let editMessage = new Discord.MessageEmbed()
        .setColor(s.embedColor)
        .setTitle("Account Loading")
        .setDescription(`Accounts loaded count all successful logins. Account errors occurs if an account is either banned or gets kicked while logging in. Invalid accounts have invalid credentials.\n\n➜ Currently loaded: **${usedEmails.length}/${credentials.length}** (*Max is set to \`${maxAccountsMsg}\`*)`)
        .addField("Errors:", "```None```")
        .addField("Invalid:", "```None```")
        .setThumbnail('https://myminecraftbot.com/images/Headshot.png');

      const sentMsg = await message.channel.send({

        embeds: [editMessage]

      });


      if (!s.useProxies) {

        console.log(c.bold.blueBright(`[PROXYING]`) + c.reset(` Proxying is disabled.`))

      } else {

        console.log(c.bold.blueBright(`[PROXYING]`) + c.reset.bold(` Proxying Enabled.`))

      }


      let loaded = 0;
      let accountNubmer = 0;
      for (let i = 0; i < credentials.length; ++i) {


        while (usedEmails.includes(credentials[i].username)) {

          if (i >= credentials.length - 1) return ready();
          i++;

        }

        if (accountNubmer == amount) return ready();
        accountNubmer++;


        setTimeout(async () => {

          createBot(credentials[i], i)

          if (i === credentials.length - 1) {

            setTimeout(() => {

              let error = errorAccounts.map((user) => `${user}\n`).toString().split(",").join("");
              if (errorAccounts.length == 0) error = "None";

              let invalid = invalidAccounts.map((user) => `${user}\n`).toString().split(",").join("");
              if (invalidAccounts.length == 0) invalid = "None";

              let editMessage = new Discord.MessageEmbed()
                .setColor(s.embedColor)
                .setTitle("Account Loading")
                .setDescription(`Accounts loaded count all successful logins. Account errors occurs if an account is either banned or gets kicked while logging in. Invalid accounts have invalid credentials.\n\n➜ Currently loaded: **${usedEmails.length + loaded}/${credentials.length}** (*Max is set to \`${maxAccountsMsg}\`*)`)
                .addField("Errors:", `\`\`\`${error}\`\`\``)
                .addField("Invalid:", `\`\`\`${invalid}\`\`\``)
                .setThumbnail('https://myminecraftbot.com/images/Headshot.png');

              sentMsg.edit({

                embeds: [editMessage]

              });

              ready()
            }, 2000)
          }
        }, i * parseInt(s.joinSpeed.toString() + "000"))
      }


      function createBot({
        username,
        password
      }, i) {

        let bot;
        if (s.useProxies) {
          process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
          const socks = require('socks').SocksClient
          const ProxyAgent = require('proxy-agent')

          let cProxy;
          if (s.randomizeOrder) {

            cProxy = proxies[Math.floor(Math.random() * proxies.length)];

            if (properRandom.length == 0) {

              properRandom = proxies.slice(0);

            }

            properRandom.forEach((data, i = 0) => {

              if (data == cProxy) {

                properRandom.splice(i, 1)

              }

              i++;
            })

          } else {

            cProxy = proxies[currentProxy];

          }

          //console.log(cProxy)
          bot = mineflayer.createBot({
            username: username,
            password: password,
            host: s.serverIP,
            port: s.port,
            version: s.version, //!---------
            viewDistance: s.renderDistance.toLowerCase(),
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
                  console.log(err)
                  return
                }
                client.setSocket(info.socket)
                client.emit('connect')
              })
            }
          });

          if (!s.randomizeOrder) {
            accountsOnProxy++;
            if (accountsOnProxy >= s.accountsPerProxy) {
              if (currentProxy == proxies.length - 1) {
                currentProxy = 0;
              } else {
                currentProxy++;
              }
              accountsOnProxy = 0;
            }
          }

        } else {
          bot = mineflayer.createBot({
            host: s.serverIP,
            port: s.port,
            username,
            password,
            version: s.version,
            viewDistance: s.renderDistance.toLowerCase()
            //auth: 'microsoft' / 'mojang' //?<------------------------------------------------------------------------
          })
        }

        //Plugins
        if (s.autoEat) bot.loadPlugin(autoeat)
        bot.loadPlugin(pathfinder)
        bot.loadPlugin(blockFinderPlugin);



        bot.once('login', async function () {
          console.log(c.bold.greenBright(`[LOGIN] `) + c.reset.bold(`${bot.username}`) + c.reset(" succesfully logged in!"))

          if (!loggedIn.length) mcdata = require('minecraft-data')(bot.version);
          let avatarLink = await Canvas.loadImage(`http://cravatar.eu/head/${bot.username}/32.png`);

          if (s.autoSelect) {
            loggedIn.push({
              username: bot.username,
              email: username,
              pass: password,
              avatar: avatarLink,
              selected: true,
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


          } else {

            loggedIn.push({
              username: bot.username,
              email: username,
              pass: password,
              avatar: avatarLink,
              selected: true,
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
          }


          let error = errorAccounts.map((user) => `${user}\n`).toString().split(",").join("");
          if (errorAccounts.length == 0) error = "None";

          let invalid = invalidAccounts.map((user) => `${user}\n`).toString().split(",").join("");
          if (invalidAccounts.length == 0) invalid = "None";

          let editMessage = new Discord.MessageEmbed()
            .setColor(s.embedColor)
            .setTitle("Account Loading")
            .setDescription(`Accounts loaded count all successful logins. Account errors occurs if an account is either banned or gets kicked while logging in. Invalid accounts have invalid credentials.\n\n➜ Currently loaded: **${/*1 + */usedEmails.length + loaded}/${credentials.length}** (*Max is set to \`${maxAccountsMsg}\`*)`)
            .addField("Errors:", `\`\`\`${error}\`\`\``)
            .addField("Invalid:", `\`\`\`${invalid}\`\`\``)
            .setThumbnail('https://myminecraftbot.com/images/Headshot.png');


          sentMsg.edit({
            embeds: [editMessage]
          });
          loaded++;

        })


        bot.once('spawn', async function () {

          if (!s.joinCommand == "" || !s.joinCommand.toLowerCase() == "none") {
            bot.chat(s.joinCommand);

          }

          if (s.autoEat) {

            bot.autoEat.options = {
              priority: "saturation",
              startAt: 16,
              bannedFood: ["golden_apple", "enchanted_golden_apple", "rotten_flesh"],
            }
          }

        })




        bot.on('end', function (reason) {

          console.log(reason)

          let error = errorAccounts.map((user) => `${user}\n`).toString().split(",").join("");
          if (errorAccounts.length == 0) error = "None";

          let invalid = invalidAccounts.map((user) => `${user}\n`).toString().split(",").join("");
          if (invalidAccounts.length == 0) invalid = "None";

          let count;
          if (usedEmails.length + loaded == 0) {

            count = 0

          } else {

            count = 1 + usedEmails.length + loaded;
          }


          let editMessage = new Discord.MessageEmbed()
            .setColor(s.embedColor)
            .setTitle("Account Loading")
            .setDescription(`Accounts loaded count all successful logins. Account errors occurs if an account is either banned or gets kicked while logging in. Invalid accounts have invalid credentials.\n\n➜ Currently loaded: **${count}/${credentials.length}** (*Max is set to \`${maxAccountsMsg}\`*)`)
            .addField("Errors:", `\`\`\`${error}\`\`\``)
            .addField("Invalid:", `\`\`\`${invalid}\`\`\``)
            .setThumbnail('https://myminecraftbot.com/images/Headshot.png');


          if (currentlyLoading) {

            if (!errorAccounts.includes(username)) {

              errorAccounts.push(username)
              console.log(reason)
              console.log(c.bold.yellowBright(`[ERROR] `) + c.reset.bold(`${username}`) + c.reset(" couldn't join the server."))

            }

            sentMsg.edit({
              embeds: [editMessage]
            });

          } else {
            if (currentlyLoading) console.log(c.bold.yellowBright(`[ERROR] `) + c.reset.bold(`${username}`) + c.reset(" was removed from the server. (Banned, kicked, etc.)"))
            errorAccounts.push(username)
          }


          loggedIn.forEach((data, i) => {
            if (data.email == username) {
              loggedIn.splice(i, 1)
            }
            i++;
          })

        })

        bot.on('error', function (err) {

          if (err.toString().includes("Invalid credentials.")) {
            if (!invalidAccounts.includes(username)) {
              invalidAccounts.push(username)
              console.log(c.bold.redBright(`[Invalid] `) + c.reset.bold(`${username}`) + c.reset(" - Invalid credentials."))

              let error = errorAccounts.map((user) => `${user}\n`).toString().split(",").join("");
              if (errorAccounts.length == 0) error = "None";

              let invalid = invalidAccounts.map((user) => `${user}\n`).toString().split(",").join("");
              if (invalidAccounts.length == 0) invalid = "None";

              let editMessage = new Discord.MessageEmbed()
                .setColor(s.embedColor)
                .setTitle("Account Loading")
                .setDescription(`Accounts loaded count all successful logins. Account errors occurs if an account is either banned or gets kicked while logging in. Invalid accounts have invalid credentials.\n\n➜ Currently loaded: **${/*1 + */usedEmails.length + loaded}/${credentials.length}** (*Max is set to \`${maxAccountsMsg}\`*)`)
                //.addField("Accounts loaded:", `${1 + usedEmails.length + loaded}/${credentials.length}`)
                .addField("Errors:", `\`\`\`${error}\`\`\``)
                .addField("Invalid:", `\`\`\`${invalid}\`\`\``)
                .setThumbnail('https://myminecraftbot.com/images/Headshot.png');

              sentMsg.edit({

                embeds: [editMessage]

              });

              //loaded - 1;
            }
          } else {

            if (!errorAccounts.includes(username)) {

              errorAccounts.push(username)
              //!TEMP
              console.log(err)

              console.log(c.bold.yellowBright(`[ERROR] `) + c.reset.bold(`${username}`) + c.reset(" couldn't join the server."))

            }
          }


          if (s.errorLogging) {
            if (!s.errorLoggingChannel || s.errorLoggingChannel == "Not set.") {
              console.log(c.bold.redBright('ErrorLogging is enabled but no channel is set.'))
            } else {
              let errorChannel = message.guild.channels.cache.get(s.errorLoggingChannel)
              if (errorChannel) {
                let errorMessage = new Discord.MessageEmbed()
                  .setColor(s.embedColor)
                  .setDescription("Account: " + username)
                  .addField("Error:", `\`\`\`${err.toString()}\`\`\``)
                errorChannel.send({
                  embeds: [errorMessage]
                })
              } else {
                console.log(c.bold.redBright(`ErrorLogging channel (${s.errorLoggingChannel}) was not fouund.`))
              }
            }
          }


        }) //Error end

        bot.on('kicked', async function (reason) {

          console.log(reason)


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
              let errorChannel = message.guild.channels.cache.get(s.errorLoggingChannel)
              if (errorChannel) {
                let errorMessage = new Discord.MessageEmbed()
                  .setColor(s.embedColor)
                  .setDescription("Account: " + username)
                  .addField("Error:", `\`\`\`${reason.toString()}\`\`\``)
                errorChannel.send({
                  embeds: [errorMessage]
                })
              } else {
                console.log(c.bold.redBright(`ErrorLogging channel (${s.errorLoggingChannel}) was not fouund.`))
              }
            }
          }


        })



        if (s.autoEat) {
          bot.on("health", () => {
            if (bot.food === 20) bot.autoEat.disable()
            else bot.autoEat.enable()
          })
        }
      }




      function ready() {

        setTimeout(() => {

          let error = errorAccounts.map((user) => `${user}\n`).toString().split(",").join("");
          if (errorAccounts.length == 0) error = "None";

          let invalid = invalidAccounts.map((user) => `${user}\n`).toString().split(",").join("");
          if (invalidAccounts.length == 0) invalid = "None";

          let editMessage = new Discord.MessageEmbed()
            .setColor(s.embedColor)
            .setTitle("Account Loading")
            .setDescription(`Accounts loaded count all successful logins. Account errors occurs if an account is either banned or gets kicked while logging in. Invalid accounts have invalid credentials.\n\n➜ Currently loaded: **${usedEmails.length + loaded}/${credentials.length}** (*Max is set to \`${maxAccountsMsg}\`*)`)
            .addField("Errors:", `\`\`\`${error}\`\`\``)
            .addField("Invalid:", `\`\`\`${invalid}\`\`\``)
            .setThumbnail('https://myminecraftbot.com/images/Headshot.png');
          sentMsg.edit({
            embeds: [editMessage]
          });

          currentlyLoading = false;
          console.log(c.bold.green(`[Account Loading]`) + c.reset.bold(" Loading accounts has finished."))

        }, 2000)

      }

    })

  },
  loggedIn,
  firstLogin,
  currentlyLoading,
  mcData

}



//!TESTING NAVIGATION
//!TESTING NAVIGATION
//!TESTING NAVIGATION
//!TESTING NAVIGATION

/*

navigatePlugin(bot)
bot.navigate.blocksToAvoid[132] = true // avoid tripwire
bot.navigate.blocksToAvoid[59] = false // ok to trample crops
bot.navigate.on('pathPartFound', function (path) {
  bot.chat('Going ' + path.length + ' meters in the general direction for now.')
})
bot.navigate.on('pathFound', function (path) {
  bot.chat('I can get there in ' + path.length + ' moves.')
})
bot.navigate.on('cannotFind', function (closestPath) {
  bot.chat('unable to find path. getting as close as possible')
  bot.navigate.walk(closestPath)
})
bot.navigate.on('arrived', function () {
  bot.chat('I have arrived')
})
bot.navigate.on('interrupted', function () {
  bot.chat('stopping')
})



bot.on('chat', function (username, message) {
  if (username === bot.username) return
  const target = bot.players[username].entity
  if (message === 'come') {
    bot.navigate.to(target.position)
  } else if (message === 'stop') {
    bot.navigate.stop()
  } else if (message === 'testcb') {
    bot.chat('computing path to ' + target.position)
    const results = bot.navigate.findPathSync(target.position)
    bot.chat('status: ' + results.status)
    bot.navigate.walk(results.path, function (stopReason) {
      bot.chat('done. ' + stopReason)
    })
  } else {
    const match = message.match(/^goto\s*\(\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*\)\s*$/)
    if (match) {
      const pt = vec3(
        parseFloat(match[1], 10),
        parseFloat(match[2], 10),
        parseFloat(match[3], 10))
      bot.navigate.to(pt)
    } else {
      console.log('no match')
    }
  }
})

*/

//!TESTING NAVIGATION
//!TESTING NAVIGATION
//!TESTING NAVIGATION
//!TESTING NAVIGATIONs





/*bot.on('login', async function () {

  console.log(c.bold.greenBright(`[LOGIN] `) + c.reset.bold(`${bot.username}`) + c.reset(" succesfully logged in!"))

  let avatarLink = await Canvas.loadImage(`http://cravatar.eu/head/${bot.username}/32.png`);
  loggedIn.push({
    username: bot.username,
    email: username,
    avatar: avatarLink,
    botUser: bot
  })



  let error = errorAccounts.map((user) => `${user}\n`).toString().split(",").join("");
  if (errorAccounts.length == 0) error = "None";

  let invalid = invalidAccounts.map((user) => `${user}\n`).toString().split(",").join("");
  if (invalidAccounts.length == 0) invalid = "None";

  let editMessage = new Discord.MessageEmbed()
    .setColor(s.embedColor)
    .setTitle("Account Loading")
    .setDescription(`Accounts loaded count all successful logins. Account errors occurs if an account is either banned or gets kicked while logging in. Invalid accounts have invalid credentials.\n\n➜ Currently loaded: **${1 + usedEmails.length + loaded}/${credentials.length}** (*Max is set to \`${s.maxAccounts}\`*)`)
    //.addField("Accounts loaded:", `${1 + usedEmails.length + loaded}/${credentials.length}`)
    .addField("Errors:", `\`\`\`${error}\`\`\``)
    .addField("Invalid:", `\`\`\`${invalid}\`\`\``)
    .setThumbnail('https://myminecraftbot.com/images/Headshot.png');

  sentMsg.edit({
    embeds: [editMessage]
  });
  loaded++;
})*/