const mineflayer=require('mineflayer'),c=require('chalk'),AccountLoading=require('../Functions/AccountLoading.js'),fs=require('fs');module['exports']={'name':'unfollow','aliases':['uf'],'run':async(_0x1af990,_0x18770e,_0x14576e,_0x2eed07)=>{fs['readFile']('./Settings.json','utf8',function(_0x595f47,_0x587535){var _0x8a1acc=JSON['parse'](_0x587535);let _0x5471f4=AccountLoading['loggedIn'],_0x122727=[],_0x2fb42a=![];_0x5471f4['forEach'](_0x1c77b3=>{if(_0x1c77b3['selected']){_0x122727['push'](_0x1c77b3['username']);if(_0x1c77b3['occupation']['follow']['followingPlayer'])_0x2fb42a=!![];}});let _0x5a7d32=new _0x2eed07['MessageEmbed']()['setColor'](_0x8a1acc['embedColor'])['setDescription']('No\x20bots\x20are\x20currently\x20selected!\x20Use\x20`.select`\x20to\x20select\x20an\x20account.');if(_0x122727['length']<0x1)return _0x18770e['channel']['send']({'embeds':[_0x5a7d32]});let _0x430484=new _0x2eed07['MessageEmbed']()['setColor'](_0x8a1acc['embedColor'])['setDescription']('No\x20accounts\x20are\x20currently\x20following.');if(!_0x2fb42a)return _0x18770e['channel']['send']({'embeds':[_0x430484]});_0x122727['splice'](0x0),_0x5471f4['forEach'](_0xabb29e=>{if(_0xabb29e['selected'])_0xabb29e['occupation']['follow']['followingPlayer']=![];});});}};