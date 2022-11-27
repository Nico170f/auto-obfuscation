const chalk = require("chalk");
const AccountLoading = require("../Functions/AccountLoading.js")
const fs = require("fs");

//temp
const mineflayer = require('mineflayer')
const mineflayerViewer = require('prismarine-viewer').headless

let Found = 0;
let PlacementBlock = "netherrack";


module.exports = {
  name: 'sandbot',
  aliases: ["sb"],
  run: async (client, message, args, Discord) => {
    fs.readFile("./Settings.json", "utf8", function (err, data) {
      var s = JSON.parse(data);
      let loggedIn = AccountLoading.loggedIn;

      let noneOnline = new Discord.MessageEmbed()
        .setColor(s.embedColor)
        .setDescription("No bots are currently loaded.")
      if (!loggedIn.length) return message.channel.send({
        embeds: [noneOnline]
      })

      let botsSelected = 0;
      let botIgns = "";
      let occupied = "";
      loggedIn.forEach((data) => {
        if (data.selected) {

          if(data.occupation.busy){
            occupied = occupied + data.username + ` *(${data.occupation.occupation})*, `
          }

          botsSelected++;
          botIgns = botIgns + `${botsSelected}: ` + data.username + "\n"
        }
      })


      let noneSelected = new Discord.MessageEmbed()
        .setColor(s.embedColor)
        .setDescription("No bots are currently selected! Use `.select` to select an account.")
      if (botsSelected == 0) return message.channel.send({
        embeds: [noneSelected]
      });
      

      let botsOccupied = new Discord.MessageEmbed()
      .setColor(s.embedColor)
      .setDescription("Bots: " + occupied + " are already occupied with different tasks. Please either deselect these bots or stop their current tasks.")
      if(occupied.length) return message.channel.send({embeds: [botsOccupied]})



      const sandControl = new Discord.MessageActionRow()
      .addComponents(
          new Discord.MessageButton()
          .setCustomId('sandbotStart')
          .setLabel('Start Printing')
          .setStyle('SUCCESS')
          .setDisabled(false),
      ).addComponents(
          new Discord.MessageButton()
          .setCustomId('sandbotStop')
          .setLabel('Stop Printing')
          .setStyle('DANGER')
          .setDisabled(true),
      ).addComponents(
          new Discord.MessageButton()
          .setCustomId('sandbotFindBlocks')
          .setLabel('Find Guider Blocks')
          .setStyle('PRIMARY')
          .setDisabled(false),
      )




      let farmEmbed = new Discord.MessageEmbed()
        .setColor(s.embedColor)
        .setDescription(`Place guider blocks where you want sand to be printed. Once the blocks have been placed, use *Find Guider Blocks* to load the preset. \nBreaking the guider blocks after loading the preset will result in sand being printed where the guider blocks were placed, whereas leaving the them be will print sand underneath.\n\n` +
        `🔸 \`Guide Block\`\n⤷ **Block:** ${PlacementBlock}` + 
        `\n⤷ **Found:** ${Found}`)
         //`Currently placing sand under block:\n ➜ xxxx\n\n**Bots selected:**\n` + botIgns)
        .addField("Bots:", botIgns)
        .setFooter(message.author.tag)
        .setThumbnail('https://myminecraftbot.com/images/Headshot.png');


        if(botsSelected > 1){
          farmEmbed
          .setAuthor({
            name: "Print using: " + botsSelected + " bots.",
            iconURL: 'https://myminecraftbot.com/images/Headshot.png'
          })
        } else {
          farmEmbed
          .setAuthor({
            name: "Print using: " + botsSelected + " bot.",
            iconURL: 'https://myminecraftbot.com/images/Headshot.png'
          })
        }



      message.channel.send({embeds: [farmEmbed], components: [sandControl]})

    })
  }
}



function placeSand(x, y, z, bot) {
  for (var i = 0; i < botAmount; i++) {
    if (bots[i].blockAt(bots[i].entity.position.offset(x, y, z)).type === 0) {

      //Checks X+
      if (bots[i].blockAt(bots[i].entity.position.offset(x + 1, y, z)).type !== 0) {

        bots[i].placeBlock(bots[i].blockAt(bots[i].entity.position.offset(x + 1, y, z)), vec3(-1, 0, 0));
        //Checks X-
      } else if (bots[i].blockAt(bots[i].entity.position.offset(x - 1, y, z)).type !== 0) {

        bots[i].placeBlock(bots[i].blockAt(bots[i].entity.position.offset(x - 1, y, z)), vec3(1, 0, 0));
        //Checks Z+
      } else if (bots[i].blockAt(bots[i].entity.position.offset(x, y, z + 1)).type !== 0) {

        bots[i].placeBlock(bots[i].blockAt(bots[i].entity.position.offset(x, y, z + 1)), vec3(0, 0, -1));
        //Checks Z-
      } else if (bots[i].blockAt(bots[i].entity.position.offset(x, y, z - 1)).type !== 0) {

        bots[i].placeBlock(bots[i].blockAt(bots[i].entity.position.offset(x, y, z - 1)), vec3(0, 0, 1));
      }
    }
  }
}