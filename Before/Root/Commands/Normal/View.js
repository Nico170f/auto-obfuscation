const AccountLoading = require("../Functions/AccountLoading.js")
const { Viewer, WorldView, getBufferFromStream } = require('prismarine-viewer').viewer
global.Worker = require('worker_threads').Worker
const fs2 = require('fs')
const Canvas = require('canvas')
const THREE = require('three')
const { createCanvas } = require('node-canvas-webgl/lib')
const fs = require('fs').promises
const { Vec3 } = require('vec3')
const { EventEmitter } = require('events')



module.exports = {
    name: 'view',
    aliases: ["see", "screenshot"],
    run: async (client, message, args, Discord) => {
      fs2.readFile("./Settings.json", "utf8", async function (err, data) {
      var s = JSON.parse(data);
      let loggedIn = AccountLoading.loggedIn;


        let selected = [];
        loggedIn.forEach((data) => {
          if(data.selected){
            selected.push(data);
          }
        })

        
        let noAccounts = new Discord.MessageEmbed()
        .setColor(s.embedColor)
        .setDescription("No bots are currently selected! Use `.select` to select an account.")
        if (selected.length == 0) return message.channel.send({embeds: [noAccounts]});

        let onlyOne = new Discord.MessageEmbed()
        .setColor(s.embedColor)
        .setDescription("You can only use the `.view` command with one bot selected.")
        if (selected.length > 1) return message.channel.send({embeds: [onlyOne]});

        let noArgs = new Discord.MessageEmbed()
        .setColor(s.embedColor)
        .setDescription("You must include the direction (`North`, `East`, `South`, `West`, `Up` or `Down`).")

        let wrongArgs = new Discord.MessageEmbed()
        .setColor(s.embedColor)
        .setDescription("Please choose a valid direction (`North`, `East`, `South`, `West`, `Up` or `Down`).")


        let validDirection = ["north", "east", "south", "west", "up", "down"]
        if(!args[0]) {
          return message.channel.send({embeds: [noArgs]});
        } else {
          if(!validDirection.includes(args[0].toLowerCase())){
            return message.channel.send({embeds: [wrongArgs]});
          }
        }

        let updateMessage = new Discord.MessageEmbed()
        .setColor(s.embedColor)
        .setDescription("Loading... Please wait.");
        const sentMsg = await message.channel.send({
        embeds: [updateMessage]});

        //let b = loggedIn[selected];
        //b.botUser.lookAt(new Vec3(parseInt(b.entity.position.x), parseInt(b.entity.position.y) + 1, parseInt(b.entity.position.z) + 1))

        class Camera extends EventEmitter {
            constructor (bot) {
              super()
              this.bot = bot
              this.viewDistance = 8
              this.width = 1920
              this.height = 1080
              this.canvas = createCanvas(this.width, this.height)
              this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas })
              this.viewer = new Viewer(this.renderer)
              this._init().then(() => {
                this.emit('ready')

                let newMessage = new Discord.MessageEmbed()
                .setColor(s.embedColor)
                .setDescription(`🟩🟩🟩🟩⬛⬛`);
                sentMsg.edit({
                  embeds: [newMessage]
                  });

              })
            }
          
            async _init () {
              const botPos = this.bot.entity.position
              const center = new Vec3(botPos.x, botPos.y + 2, botPos.z)
              this.viewer.setVersion(this.bot.version)

              let newMessage = new Discord.MessageEmbed()
              .setColor(s.embedColor)
              .setDescription(`🟩⬛⬛⬛⬛⬛`);
              sentMsg.edit({
                embeds: [newMessage]
                });


              const worldView = new WorldView(this.bot.world, this.viewDistance, center)
              this.viewer.listen(worldView)
          
              this.viewer.camera.position.set(center.x, center.y, center.z)
          
              await worldView.init(center)

              let newMessage22 = new Discord.MessageEmbed()
              .setColor(s.embedColor)
              .setDescription(`🟩🟩⬛⬛⬛⬛`);
              sentMsg.edit({
                embeds: [newMessage22]
                });
            }
          
            async takePicture (direction, name) {
                let newMessage = new Discord.MessageEmbed()
                .setColor(s.embedColor)
                .setDescription(`🟩🟩🟩⬛⬛⬛`);
                sentMsg.edit({
                  embeds: [newMessage]
                  });
              this.bot.look(0, 0, false)

              let cameraPos;
                if (args[0].toLowerCase() == "north") {
                cameraPos = new Vec3(this.viewer.camera.position.x, this.viewer.camera.position.y, this.viewer.camera.position.z - 90)
              } else if (args[0].toLowerCase() == "east") {
                cameraPos = new Vec3(this.viewer.camera.position.x + 90, this.viewer.camera.position.y, this.viewer.camera.position.z)
              } else if (args[0].toLowerCase() == "south") {
                cameraPos = new Vec3(this.viewer.camera.position.x, this.viewer.camera.position.y, this.viewer.camera.position.z + 90)
              } else if (args[0].toLowerCase() == "west") {
                cameraPos = new Vec3(this.viewer.camera.position.x - 90, this.viewer.camera.position.y, this.viewer.camera.position.z)
              } else if (args[0].toLowerCase() == "up") {
                cameraPos = new Vec3(this.viewer.camera.position.x, this.viewer.camera.position.y + 90, this.viewer.camera.position.z)
              } else if (args[0].toLowerCase() == "down") {
                cameraPos = new Vec3(this.viewer.camera.position.x, this.viewer.camera.position.y - 90, this.viewer.camera.position.z)
              }

              const point = cameraPos.add(direction)
              this.viewer.camera.lookAt(point.x, point.y, point.z)
              await new Promise(resolve => setTimeout(resolve, 500))
              this.renderer.render(this.viewer.scene, this.viewer.camera)
          
              let newMessage11 = new Discord.MessageEmbed()
              .setColor(s.embedColor)
              .setDescription(`🟩🟩🟩🟩🟩⬛`);
              sentMsg.edit({
                embeds: [newMessage11]
                });

              const imageStream = this.canvas.createJPEGStream({
                bufsize: 4096,
                quality: 100,
                progressive: false
              })
              const buf = await getBufferFromStream(imageStream)

              /*let stats
              try {
                stats = await fs.stat('./Root/Storage/Screenshots')
              } catch (e) {
                if (!stats?.isDirectory()) {
                  await fs.mkdir('./Root/Storage/Screenshots')
                }
              }*/

              //await fs.writeFile(`./Root/Storage/Screenshots/${name}.jpg`, buf)
              await fs.writeFile(`./${name}.jpg`, buf)

              const canvas = Canvas.createCanvas(1920/2, 1080/2);
              const context = canvas.getContext('2d');
              //const background = await Canvas.loadImage(`./Root/Storage/Screenshots/${name}.jpg`);
              const background = await Canvas.loadImage(`./${name}.jpg`);

              //Opacity test


              context.drawImage(background, 0, 0, canvas.width, canvas.height);

              context.save();
              context.globalAlpha = 1;
              

              context.font = '20px Calibri';
              context.globalAlpha = 0.90;
              context.shadowOffsetX = 1;
              context.shadowOffsetY = 1;
              context.shadowBlur = 2;
              context.shadowColor = '#000000';
              context.fillStyle = '#ffffff';

              context.fillText(`IGN: ${selected[0].username}`, 30, 40)

              let xCoord = selected[0].botUser.entity.position.x.toString().split(".")[0];
              let yCoord = selected[0].botUser.entity.position.y.toString().split(".")[0];
              let zCoord = selected[0].botUser.entity.position.z.toString().split(".")[0];
              context.fillText(`Coords: X: ${xCoord}, Y: ${yCoord}, Z: ${zCoord}`, 30, 70)

              let yaw = parseInt(selected[0].botUser.entity.yaw.toString().split(".")[0]);
              if (args[0]) {
                if (args[0].toLowerCase() == "north") {
                  context.fillText(`Facing: North`, 30, 100);
                }
                else if (args[0].toLowerCase() == "east") {
                  context.fillText(`Facing: East`, 30, 100);
                }
                else if (args[0].toLowerCase() == "south") {
                  context.fillText(`Facing: South`, 30, 100);
                }
                else if (args[0].toLowerCase() == "west") {
                  context.fillText(`Facing: West`, 30, 100);
                }
              }
              

              context.restore();

              let newMessage33 = new Discord.MessageEmbed()
              .setColor("GREEN")
              .setDescription(`🟩🟩🟩🟩🟩🟩`);
              sentMsg.edit({
                embeds: [newMessage33]
                });

              const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'onlineList.png');
              await message.channel.send({
                  files: [attachment]
              })

              await sentMsg.delete();


              fs2.stat(`./${name}.jpg`, function (err, stats) {             
                if (err) {
                    return console.error(err);
                }
                fs2.unlink(`./${name}.jpg`,function(err){
                     if(err) return console.log(err);
                });  
             });


            }
          }



        const camera = new Camera(selected[0].botUser);
        camera.on('ready', async () => {
            await camera.takePicture(new Vec3(1, -0.2, 0), 'screenshot')
            //await message.channel.send({files: [{
            //    attachment: './Root/Storage/Screenshots/screenshot.jpg',
            //    name: 'account.png'
            //}]})
          })

})
    }
}
