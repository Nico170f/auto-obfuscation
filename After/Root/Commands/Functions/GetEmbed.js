const Discord=require('discord.js'),fs=require('fs'),Embeds={'ConnectionEmbed':Object,'ProxiesEmbed':Object,'DiscordEmbed':Object,'BotEmbed':Object,'FarmingEmbed':Object,'PrintingEmbed':Object},Menus={'SettingsMenu':Object},Button=new Discord['MessageActionRow']()['addComponents'](new Discord['MessageButton']()['setCustomId']('configUpdate')['setLabel']('Update\x20Category')['setStyle']('PRIMARY')),Buttons={'UpdateCategory':Button};async function getSettingsMenu(_0x4c7ae0,_0x3d39ce){let _0x1fb2ea=[{'label':'Connection','description':'View\x20Connection\x20Settings','emoji':'📡'},{'label':'Proxies','description':'View\x20Proxy\x20Settings','emoji':'🌍'},{'label':'Discord','description':'View\x20Discord\x20Settings','emoji':'⚙️'},{'label':'Bot','description':'View\x20Bot\x20Settings','emoji':'🤖'},{'label':'Farming','description':'View\x20Farming\x20Settings','emoji':'🌿'},{'label':'Printing','description':'View\x20Printing\x20Settings','emoji':'🖨️'}];const _0x3b37ef=new Discord['MessageActionRow']()['addComponents'](new Discord['MessageSelectMenu']()['setCustomId']('Settings_Menu')['setPlaceholder']('Choose\x20A\x20Settings\x20Category'));_0x1fb2ea['forEach'](_0x21a3a2=>{_0x21a3a2['label']['toLowerCase']()==_0x4c7ae0['toLowerCase']()?_0x3b37ef['components'][0x0]['addOptions']([{'label':_0x21a3a2['label'],'value':_0x21a3a2['label'],'description':_0x21a3a2['description'],'emoji':_0x21a3a2['emoji'],'default':!![]}]):_0x3b37ef['components'][0x0]['addOptions']([{'label':_0x21a3a2['label'],'value':_0x21a3a2['label'],'description':_0x21a3a2['description'],'emoji':_0x21a3a2['emoji']}]);}),Menus['SettingsMenu']=_0x3b37ef,_0x3d39ce();}async function getSettingsEmbed(_0x1bdaeb,_0x1c8190){fs['readFile']('./Settings.json','utf8',function(_0xa8367f,_0x499e8d){var _0x35d94d=JSON['parse'](_0x499e8d);let _0x3c2e23=_0x35d94d['joinCommand'];if(_0x35d94d['joinCommand']=='')_0x3c2e23='none';let _0x333d7f=_0x35d94d['permissionRole'];if(!_0x333d7f['includes']('Not'))_0x333d7f='<@&'+_0x35d94d['permissionRole']+'>';let _0x4477a2=_0x35d94d['ingameChatChannel'];if(!_0x4477a2['includes']('Not'))_0x4477a2='<#'+_0x35d94d['ingameChatChannel']+'>';let _0x27f161=_0x35d94d['errorLoggingChannel'];if(!_0x27f161['includes']('Not'))_0x27f161='<#'+_0x35d94d['errorLoggingChannel']+'>';let _0x12a5f9=_0x35d94d['farmCoords'];if(!_0x12a5f9['length'])_0x12a5f9='Not\x20set.';const _0x5b2b90=new Discord['MessageEmbed']()['setColor'](_0x35d94d['embedColor'])['setTitle']('Connection\x20Settings')['setDescription'](''+('🔹\x20`Server\x20IP`\x0a⤷\x20Current:\x20**'+_0x35d94d['serverIP']+'**\x0a\x0a')+('🔹\x20`Port`\x0a⤷\x20Current:\x20**'+_0x35d94d['port']+'**\x0a\x0a')+('🔹\x20`Version`\x0a⤷\x20Current:\x20**'+_0x35d94d['version']+'**\x0a\x0a')+('🔹\x20`Join\x20Command`\x0a⤷\x20Current:\x20**'+_0x3c2e23+'**\x0a\x0a')+('🔹\x20`Join\x20Speed`\x0a⤷\x20Current:\x20**'+_0x35d94d['joinSpeed']+'**\x0a\x0a')+('🔹\x20`Max\x20Accounts`\x0a⤷\x20Current:\x20**'+_0x35d94d['maxAccounts']+'**\x0a\x0a')+('🔹\x20`Throttling\x20Delay`\x0a⤷\x20Current:\x20**'+_0x35d94d['throttlingDelay']+'**\x0a\x0a'))['setFooter'](_0x1bdaeb)['setThumbnail']('https://myminecraftbot.com/images/Headshot.png');Embeds['ConnectionEmbed']=_0x5b2b90;const _0x5f491a=new Discord['MessageEmbed']()['setColor'](_0x35d94d['embedColor'])['setTitle']('Proxy\x20Settings')['setDescription'](''+('🔹\x20`Use\x20Proxies`\x0a⤷\x20Current:\x20**'+_0x35d94d['useProxies']+'**\x0a\x0a')+('🔹\x20`Randomize\x20Order`\x0a⤷\x20Current:\x20**'+_0x35d94d['randomizeOrder']+'**\x0a\x0a')+('🔹\x20`Accounts\x20Per\x20Proxy`\x0a⤷\x20Current:\x20**'+_0x35d94d['accountsPerProxy']+'**\x0a\x0a'))['setFooter'](_0x1bdaeb)['setThumbnail']('https://myminecraftbot.com/images/Headshot.png');Embeds['ProxiesEmbed']=_0x5f491a;const _0x5a4368=new Discord['MessageEmbed']()['setColor'](_0x35d94d['embedColor'])['setTitle']('Discord\x20Settings')['setDescription'](''+('🔹\x20`Embed\x20Color`\x0a⤷\x20Current:\x20**'+_0x35d94d['embedColor']+'**\x0a\x0a')+('🔹\x20`Permissions\x20Role`\x0a⤷\x20Current:\x20**'+_0x333d7f+'**\x0a\x0a')+('🔹\x20`Ingame\x20Chat\x20Logging`\x0a⤷\x20Current:\x20**'+_0x35d94d['ingameChat']+'**\x0a\x0a')+('🔹\x20`Ingame\x20Chat\x20Logging\x20Channel`\x0a⤷\x20Current:\x20**'+_0x4477a2+'**\x0a\x0a')+('🔹\x20`Error\x20Logging`\x0a⤷\x20Current:\x20**'+_0x35d94d['errorLogging']+'**\x0a\x0a')+('🔹\x20`Error\x20Logging\x20Channel`\x0a⤷\x20Current:\x20**'+_0x27f161+'**\x0a\x0a'))['setFooter'](_0x1bdaeb)['setThumbnail']('https://myminecraftbot.com/images/Headshot.png');Embeds['DiscordEmbed']=_0x5a4368;const _0x1a26f6=new Discord['MessageEmbed']()['setColor'](_0x35d94d['embedColor'])['setTitle']('Bot\x20Settings')['setDescription'](''+('🔹\x20`Render\x20Distance`\x0a⤷\x20Current:\x20**'+_0x35d94d['renderDistance']+'**\x0a\x0a')+('🔹\x20`Auto\x20Select\x20Bots`\x0a⤷\x20Current:\x20**'+_0x35d94d['autoSelect']+'**\x0a\x0a')+('🔹\x20`Auto\x20Eat`\x0a⤷\x20Current:\x20**'+_0x35d94d['autoEat']+'**\x0a\x0a')+('🔹\x20`Follow\x20Speed`\x0a⤷\x20Current:\x20**'+_0x35d94d['followSpeed']+'**\x0a\x0a'))['setFooter'](_0x1bdaeb)['setThumbnail']('https://myminecraftbot.com/images/Headshot.png');Embeds['BotEmbed']=_0x1a26f6;const _0x14f96e=new Discord['MessageEmbed']()['setColor'](_0x35d94d['embedColor'])['setTitle']('Farming\x20Settings')['setDescription'](''+('🔹\x20`Farming\x20Speed`\x0a⤷\x20Current:\x20**'+_0x35d94d['farmingSpeed']+'**\x0a\x0a')+('🔹\x20`Farming\x20Radius`\x0a⤷\x20Current:\x20**'+_0x35d94d['farmingRadius']+'**\x0a\x0a')+('🔹\x20`Deposit\x20Chest\x20Coords`\x0a⤷\x20Current:\x20**'+_0x35d94d['depositChestCoords']+'**\x0a\x0a')+('🔹\x20`Crops\x20Till\x20Deposit`\x0a⤷\x20Current:\x20**'+_0x35d94d['cropsTillDeposit']+'**\x0a\x0a')+('🔹\x20`Farm\x20Coords`\x0a⤷\x20Current:\x20**'+_0x12a5f9['toString']()['replace'](',',',\x20')+'**\x0a\x0a'))['setFooter'](_0x1bdaeb)['setThumbnail']('https://myminecraftbot.com/images/Headshot.png');Embeds['FarmingEmbed']=_0x14f96e;const _0x26bcc3=new Discord['MessageEmbed']()['setColor'](_0x35d94d['embedColor'])['setTitle']('Printing\x20Settings')['setDescription'](''+('🔹\x20`Guider\x20Block`\x0a⤷\x20Current:\x20**'+_0x35d94d['guiderBlock']+'**\x0a\x0a')+('🔹\x20`Guider\x20Block\x20Range`\x0a⤷\x20Current:\x20**'+_0x35d94d['findGuiderBlockRange']+'**\x0a\x0a')+('🔹\x20`Max\x20Guider\x20Blocks`\x0a⤷\x20Current:\x20**'+_0x35d94d['maxGuiderBlocks']+'**\x0a\x0a')+('🔹\x20`Printing\x20Gamemode`\x0a⤷\x20Current:\x20**'+_0x35d94d['printingGamemode']+'**\x0a\x0a')+('🔹\x20`Printing\x20Speed`\x0a⤷\x20Current:\x20**'+_0x35d94d['printingSpeed']+'**\x0a\x0a'))['setFooter'](_0x1bdaeb)['setThumbnail']('https://myminecraftbot.com/images/Headshot.png');Embeds['PrintingEmbed']=_0x26bcc3,_0x1c8190();});}module['exports']={'getSettingsEmbed':getSettingsEmbed,'Embeds':Embeds,'getSettingsMenu':getSettingsMenu,'Menus':Menus,'Buttons':Buttons};