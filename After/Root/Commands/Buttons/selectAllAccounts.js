const AccountLoading=require('../Functions/AccountLoading.js'),fs=require('fs');module['exports']={'name':'selectAllAccountsButton','run':async(_0xcbfeee,_0x4471b9,_0x219f1d)=>{fs['readFile']('./Settings.json','utf8',async function(_0x538df1,_0x3f6671){var _0x4b3d67=JSON['parse'](_0x3f6671);let _0x2cf8f7=AccountLoading['loggedIn'];if(_0x4471b9['user']['tag']!==_0x4471b9['message']['embeds'][0x0]['footer']['text'])return _0x4471b9['reply']({'content':'Please\x20use\x20`.select`\x20to\x20do\x20this.','ephemeral':!![]});if(_0x2cf8f7['length']<0x1)return _0x4471b9['reply']({'content':'No\x20bots\x20are\x20currently\x20loaded.','ephemeral':!![]});const _0x3bb14e=new _0x219f1d['MessageActionRow']()['addComponents'](new _0x219f1d['MessageButton']()['setCustomId']('confirmSelectOrDeselectAllAccountsButton')['setLabel']('Confirm')['setStyle']('DANGER'));let _0x2079d4=new _0x219f1d['MessageEmbed']()['setColor']('RED')['setDescription']('Are\x20you\x20sure\x20you\x20wish\x20to\x20select\x20all\x20accounts?')['setFooter'](_0x4471b9['user']['tag']);_0x4471b9['update']({'embeds':[_0x2079d4],'components':[_0x3bb14e]});});}};