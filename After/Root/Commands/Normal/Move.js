const mineflayer=require('mineflayer'),c=require('chalk'),AccountLoading=require('../Functions/AccountLoading.js'),fs=require('fs');var Vec3=require('vec3')['Vec3'];module['exports']={'name':'move','aliases':['movee'],'run':async(_0x5c5fb7,_0x2827bb,_0x3a319b,_0x8b47d3)=>{fs['readFile']('./Settings.json','utf8',function(_0x4fd774,_0x155512){var _0x5765e1=JSON['parse'](_0x155512);let _0x5bc6f0=AccountLoading['loggedIn'],_0x3256a4=[];_0x5bc6f0['forEach'](_0xda5c63=>{_0xda5c63['selected']&&_0x3256a4['push'](_0xda5c63);});let _0xf2a907=new _0x8b47d3['MessageEmbed']()['setColor'](_0x5765e1['embedColor'])['setDescription']('No\x20bots\x20are\x20currently\x20selected!\x20Use\x20`.select`\x20to\x20select\x20atleast\x20one\x20account.');if(_0x3256a4['length']<0x1)return _0x2827bb['channel']['send']({'embeds':[_0xf2a907]});const _0x82d0f3=new _0x8b47d3['MessageActionRow']()['addComponents'](new _0x8b47d3['MessageButton']()['setCustomId']('moveJumpButton')['setLabel']('Jump')['setStyle']('SECONDARY'))['addComponents'](new _0x8b47d3['MessageButton']()['setCustomId']('moveFrontButton')['setLabel']('Front')['setStyle']('PRIMARY'))['addComponents'](new _0x8b47d3['MessageButton']()['setCustomId']('moveShiftButton')['setLabel']('Sneak')['setStyle']('SECONDARY')),_0x1246d7=new _0x8b47d3['MessageActionRow']()['addComponents'](new _0x8b47d3['MessageButton']()['setCustomId']('moveLeftButton')['setLabel']('Left')['setStyle']('PRIMARY'))['addComponents'](new _0x8b47d3['MessageButton']()['setCustomId']('moveBackwardButton')['setLabel']('Back')['setStyle']('PRIMARY'))['addComponents'](new _0x8b47d3['MessageButton']()['setCustomId']('moveRightButton')['setLabel']('Right')['setStyle']('PRIMARY'));let _0x314d02=new _0x8b47d3['MessageEmbed']()['setColor'](_0x5765e1['embedColor'])['setFooter'](_0x2827bb['author']['tag']);_0x3256a4['length']==0x1?_0x314d02['setAuthor']({'name':'Move\x20Bot','iconURL':'http://cravatar.eu/head/'+_0x3256a4[0x0]['username']+'/32.png'})['setDescription']('Bot:\x20**'+_0x3256a4[0x0]['username']+'**\x0aUse\x20the\x20buttons\x20beneath\x20to\x20move\x20it\x20accordingly.')['setThumbnail']('https://mc-heads.net/player/'+_0x3256a4[0x0]['username']):_0x314d02['setAuthor']({'name':'Move\x20Bot','iconURL':'https://myminecraftbot.com/images/Headshot.png'})['setDescription']('**'+_0x3256a4['length']+'**\x20bots\x20selecetd.\x0aUse\x20the\x20buttons\x20beneath\x20to\x20move\x20them\x20accordingly.')['setThumbnail']('https://myminecraftbot.com/images/Headshot.png'),_0x3256a4['forEach'](_0x5dffe8=>{let _0x471593=_0x5dffe8['botUser'],_0xf4a637=parseInt(_0x471593['entity']['yaw']['toString']()['split']('.')[0x0]);if(_0xf4a637>-0x2d&&_0xf4a637<0x2d)_0x471593['lookAt'](new Vec3(_0x471593['entity']['position']['x'],_0x471593['entity']['position']['y']+1.6,_0x471593['entity']['position']['z']+0x1),![]);else{if(_0xf4a637>0x2d&&_0xf4a637<0x87)_0x471593['lookAt'](new Vec3(_0x471593['entity']['position']['x']-0x1,_0x471593['entity']['position']['y']+1.6,_0x471593['entity']['position']['z']),![]);else _0xf4a637>-0x87&&_0xf4a637<-0x2d?_0x471593['lookAt'](new Vec3(_0x471593['entity']['position']['x']+0x1,_0x471593['entity']['position']['y']+1.6,_0x471593['entity']['position']['z']),![]):_0x471593['lookAt'](new Vec3(_0x471593['entity']['position']['x'],_0x471593['entity']['position']['y']+1.6,_0x471593['entity']['position']['z']-0x1),![]);}}),_0x2827bb['channel']['send']({'embeds':[_0x314d02],'components':[_0x82d0f3,_0x1246d7]});});}};