const Canvas=require('canvas'),chalk=require('chalk'),AccountLoading=require('../Functions/AccountLoading.js'),fs=require('fs');module['exports']={'name':'status','aliases':['list','online'],'run':async(_0x5ec9d2,_0x95f0a8,_0x2849ee,_0x243a36)=>{fs['readFile']('./Settings.json','utf8',async function(_0x25ca79,_0x5e0256){var _0x29f4f3=JSON['parse'](_0x5e0256);let _0x22f7fd=AccountLoading['loggedIn'],_0x423e93=new _0x243a36['MessageEmbed']()['setColor'](_0x29f4f3['embedColor'])['setDescription']('No\x20bots\x20are\x20currently\x20loaded.');if(!_0x22f7fd['length'])return _0x95f0a8['channel']['send']({'embeds':[_0x423e93]});if(_0x22f7fd['length']<0x3){let _0x43c19e='';_0x22f7fd['forEach']((_0x54c23e,_0x3514cf=0x1)=>{let _0x21810f;if(_0x54c23e['selected'])_0x21810f='**'+_0x54c23e['username']+'**';else _0x21810f=_0x54c23e['username'];_0x43c19e=_0x43c19e+(_0x3514cf+0x1+'.\x20'+_0x21810f+'\x0a');});let _0x4645ac=new _0x243a36['MessageEmbed']()['setColor'](_0x29f4f3['embedColor'])['setDescription']('Here\x27s\x20a\x20list\x20of\x20accounts\x20who\x20successfully\x20logged\x20online.')['addField']('IGNS:',_0x43c19e,!![]);_0x95f0a8['channel']['send']({'embeds':[_0x4645ac]});}else{let _0x820dec='',_0x80694c='',_0x28998a='';_0x22f7fd['forEach']((_0x559fd6,_0x53f985=0x1)=>{let _0x10fb05;if(_0x559fd6['selected'])_0x10fb05='**'+_0x559fd6['username']+'**';else _0x10fb05=_0x559fd6['username'];if(_0x53f985<_0x22f7fd['length']/0x3)_0x820dec=_0x820dec+(_0x53f985+0x1+'.\x20'+_0x10fb05+'\x0a');else _0x53f985<_0x22f7fd['length']/0x3*0x2?_0x80694c=_0x80694c+(_0x53f985+0x1+'.\x20'+_0x10fb05+'\x0a'):_0x28998a=_0x28998a+(_0x53f985+0x1+'.\x20'+_0x10fb05+'\x0a');});let _0x592f8c=new _0x243a36['MessageEmbed']()['setColor'](_0x29f4f3['embedColor'])['setDescription']('Here\x27s\x20a\x20list\x20of\x20accounts\x20who\x20successfully\x20logged\x20online.')['addField']('IGNS:',_0x820dec,!![])['addField']('〰️',_0x80694c,!![])['addField']('〰️',_0x28998a,!![])['setThumbnail']('https://myminecraftbot.com/images/Headshot.png');_0x95f0a8['channel']['send']({'embeds':[_0x592f8c]});}let _0x46f357=await _0x95f0a8['channel']['send']('Waiting\x20for\x20image...');const _0x5b1fd3=Canvas['createCanvas'](0x160,0x108),_0x95049f=_0x5b1fd3['getContext']('2d'),_0x312251=await Canvas['loadImage']('http://45.140.185.240:8010/images/Doublechest_Background.png');_0x95049f['drawImage'](_0x312251,0x0,0x0,_0x5b1fd3['width'],_0x5b1fd3['height']);let _0x189fbf=await Canvas['loadImage']('http://45.140.185.240:8010/images/PlusSymbol.png'),_0x5ddb01=0x10,_0x355b75=0x24,_0x48c38d=0x0,_0x23e931=0x0;_0x22f7fd['forEach'](function(_0xa8a183){if(_0x23e931>=0x35)return _0x95049f['drawImage'](_0x189fbf,0x135,0xdd,0x14,0x14);_0x48c38d==0x9&&(_0x355b75+=0x24,_0x5ddb01=0x10,_0x48c38d=0x0),_0x95049f['drawImage'](_0xa8a183['avatar'],_0x5ddb01,_0x355b75,0x20,0x20),_0x5ddb01+=0x24,_0x48c38d++,_0x23e931++;});const _0x3037fb=new _0x243a36['MessageAttachment'](_0x5b1fd3['toBuffer'](),'bots.png');await _0x95f0a8['channel']['send']({'files':[_0x3037fb]}),await _0x46f357['delete']();});}};