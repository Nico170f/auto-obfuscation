module.exports = async function(client) {
const Discord = require("discord.js")
const chalk = require("chalk")

//const fs = require("fs")
//onst { FileArray } = require(`${ROOT.path}/Root/Functions/FileArray`)
//
//ileArray(`${ROOT.path}/Root/Events`, async function(err, res){
//   res.forEach(file => {
//       if (fs.statSync(file).isDirectory()) return;
//       let event = require(file)
//       if (event.ignoreFile) return;
//       if (event.customEvent) event.run(client, Discord);
//       client.events.set(event.name, event)
//       event = client.events.get(event.name)
//       
//       if (event.once) client.once(event.name, (...args) => event.run(...args, client, Discord))
//       else client.on(event.name, (...args) => event.run(...args, client, Discord))
//   })
//})



 let ErrorManagger = require(`../../Events/ErrorManager`)
 if (ErrorManagger.customEvent) ErrorManagger.run(client, Discord);
 client.events.set(ErrorManagger.name, ErrorManagger)
 ErrorManagger = client.events.get(ErrorManagger.name)
 if (ErrorManagger.once) client.once(ErrorManagger.name, (...args) => ErrorManagger.run(...args, client, Discord))
 else client.on(ErrorManagger.name, (...args) => ErrorManagger.run(...args, client, Discord))

 let InteractionCreate = require(`../../Events/InteractionCreate`)
 if (InteractionCreate.customEvent) InteractionCreate.run(client, Discord);
 client.events.set(InteractionCreate.name, InteractionCreate)
 InteractionCreate = client.events.get(InteractionCreate.name)
 if (InteractionCreate.once) client.once(InteractionCreate.name, (...args) => InteractionCreate.run(...args, client, Discord))
 else client.on(InteractionCreate.name, (...args) => InteractionCreate.run(...args, client, Discord))

 let MessageCreate = require(`../../Events/MessageCreate`)
 if (MessageCreate.customEvent) MessageCreate.run(client, Discord);
 client.events.set(MessageCreate.name, MessageCreate)
 MessageCreate = client.events.get(MessageCreate.name)
 if (MessageCreate.once) client.once(MessageCreate.name, (...args) => MessageCreate.run(...args, client, Discord))
 else client.on(MessageCreate.name, (...args) => MessageCreate.run(...args, client, Discord))

 let Ready = require(`../../Events/Ready`)
 if (Ready.customEvent) Ready.run(client, Discord);
 client.events.set(Ready.name, Ready)
 Ready = client.events.get(Ready.name)
 if (Ready.once) client.once(Ready.name, (...args) => Ready.run(...args, client, Discord))
 else client.on(Ready.name, (...args) => Ready.run(...args, client, Discord))

 await console.log(chalk.bold.cyan("[HANDLER]") + chalk.reset(` Loaded events. [2/4]`))

}