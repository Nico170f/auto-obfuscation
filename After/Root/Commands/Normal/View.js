const AccountLoading=require('../Functions/AccountLoading.js'),{Viewer,WorldView,getBufferFromStream}=require('prismarine-viewer')['viewer'];global['Worker']=require('worker_threads')['Worker'];const fs2=require('fs'),Canvas=require('canvas'),THREE=require('three'),{createCanvas}=require('node-canvas-webgl/lib'),fs=require('fs')['promises'],{Vec3}=require('vec3'),{EventEmitter}=require('events');module['exports']={'name':'view','aliases':['see','screenshot'],'run':async(_0x2c7810,_0x500f55,_0x40f8ac,_0x4f339f)=>{fs2['readFile']('./Settings.json','utf8',async function(_0x24ee69,_0x4734f2){var _0x2d5227=JSON['parse'](_0x4734f2);let _0x112dfc=AccountLoading['loggedIn'],_0x1da67e=[];_0x112dfc['forEach'](_0x516ae6=>{_0x516ae6['selected']&&_0x1da67e['push'](_0x516ae6);});let _0x34c9d8=new _0x4f339f['MessageEmbed']()['setColor'](_0x2d5227['embedColor'])['setDescription']('No\x20bots\x20are\x20currently\x20selected!\x20Use\x20`.select`\x20to\x20select\x20an\x20account.');if(_0x1da67e['length']==0x0)return _0x500f55['channel']['send']({'embeds':[_0x34c9d8]});let _0x431354=new _0x4f339f['MessageEmbed']()['setColor'](_0x2d5227['embedColor'])['setDescription']('You\x20can\x20only\x20use\x20the\x20`.view`\x20command\x20with\x20one\x20bot\x20selected.');if(_0x1da67e['length']>0x1)return _0x500f55['channel']['send']({'embeds':[_0x431354]});let _0x2607e3=new _0x4f339f['MessageEmbed']()['setColor'](_0x2d5227['embedColor'])['setDescription']('You\x20must\x20include\x20the\x20direction\x20(`North`,\x20`East`,\x20`South`,\x20`West`,\x20`Up`\x20or\x20`Down`).'),_0x1d4157=new _0x4f339f['MessageEmbed']()['setColor'](_0x2d5227['embedColor'])['setDescription']('Please\x20choose\x20a\x20valid\x20direction\x20(`North`,\x20`East`,\x20`South`,\x20`West`,\x20`Up`\x20or\x20`Down`).'),_0x27b90e=['north','east','south','west','up','down'];if(!_0x40f8ac[0x0])return _0x500f55['channel']['send']({'embeds':[_0x2607e3]});else{if(!_0x27b90e['includes'](_0x40f8ac[0x0]['toLowerCase']()))return _0x500f55['channel']['send']({'embeds':[_0x1d4157]});}let _0x4181c9=new _0x4f339f['MessageEmbed']()['setColor'](_0x2d5227['embedColor'])['setDescription']('Loading...\x20Please\x20wait.');const _0xecc25f=await _0x500f55['channel']['send']({'embeds':[_0x4181c9]});class _0x418ca0 extends EventEmitter{constructor(_0xc2e4d5){super(),this['bot']=_0xc2e4d5,this['viewDistance']=0x8,this['width']=0x780,this['height']=0x438,this['canvas']=createCanvas(this['width'],this['height']),this['renderer']=new THREE['WebGLRenderer']({'canvas':this['canvas']}),this['viewer']=new Viewer(this['renderer']),this['_init']()['then'](()=>{this['emit']('ready');let _0xfaea69=new _0x4f339f['MessageEmbed']()['setColor'](_0x2d5227['embedColor'])['setDescription']('🟩🟩🟩🟩⬛⬛');_0xecc25f['edit']({'embeds':[_0xfaea69]});});}async['_init'](){const _0x27a8cd=this['bot']['entity']['position'],_0x50a02d=new Vec3(_0x27a8cd['x'],_0x27a8cd['y']+0x2,_0x27a8cd['z']);this['viewer']['setVersion'](this['bot']['version']);let _0x3e13d6=new _0x4f339f['MessageEmbed']()['setColor'](_0x2d5227['embedColor'])['setDescription']('🟩⬛⬛⬛⬛⬛');_0xecc25f['edit']({'embeds':[_0x3e13d6]});const _0x39b717=new WorldView(this['bot']['world'],this['viewDistance'],_0x50a02d);this['viewer']['listen'](_0x39b717),this['viewer']['camera']['position']['set'](_0x50a02d['x'],_0x50a02d['y'],_0x50a02d['z']),await _0x39b717['init'](_0x50a02d);let _0x2446db=new _0x4f339f['MessageEmbed']()['setColor'](_0x2d5227['embedColor'])['setDescription']('🟩🟩⬛⬛⬛⬛');_0xecc25f['edit']({'embeds':[_0x2446db]});}async['takePicture'](_0x16815d,_0x4471fe){let _0x24be23=new _0x4f339f['MessageEmbed']()['setColor'](_0x2d5227['embedColor'])['setDescription']('🟩🟩🟩⬛⬛⬛');_0xecc25f['edit']({'embeds':[_0x24be23]}),this['bot']['look'](0x0,0x0,![]);let _0x33d3d8;if(_0x40f8ac[0x0]['toLowerCase']()=='north')_0x33d3d8=new Vec3(this['viewer']['camera']['position']['x'],this['viewer']['camera']['position']['y'],this['viewer']['camera']['position']['z']-0x5a);else{if(_0x40f8ac[0x0]['toLowerCase']()=='east')_0x33d3d8=new Vec3(this['viewer']['camera']['position']['x']+0x5a,this['viewer']['camera']['position']['y'],this['viewer']['camera']['position']['z']);else{if(_0x40f8ac[0x0]['toLowerCase']()=='south')_0x33d3d8=new Vec3(this['viewer']['camera']['position']['x'],this['viewer']['camera']['position']['y'],this['viewer']['camera']['position']['z']+0x5a);else{if(_0x40f8ac[0x0]['toLowerCase']()=='west')_0x33d3d8=new Vec3(this['viewer']['camera']['position']['x']-0x5a,this['viewer']['camera']['position']['y'],this['viewer']['camera']['position']['z']);else{if(_0x40f8ac[0x0]['toLowerCase']()=='up')_0x33d3d8=new Vec3(this['viewer']['camera']['position']['x'],this['viewer']['camera']['position']['y']+0x5a,this['viewer']['camera']['position']['z']);else _0x40f8ac[0x0]['toLowerCase']()=='down'&&(_0x33d3d8=new Vec3(this['viewer']['camera']['position']['x'],this['viewer']['camera']['position']['y']-0x5a,this['viewer']['camera']['position']['z']));}}}}const _0x34fb72=_0x33d3d8['add'](_0x16815d);this['viewer']['camera']['lookAt'](_0x34fb72['x'],_0x34fb72['y'],_0x34fb72['z']),await new Promise(_0x2cd858=>setTimeout(_0x2cd858,0x1f4)),this['renderer']['render'](this['viewer']['scene'],this['viewer']['camera']);let _0x1c880b=new _0x4f339f['MessageEmbed']()['setColor'](_0x2d5227['embedColor'])['setDescription']('🟩🟩🟩🟩🟩⬛');_0xecc25f['edit']({'embeds':[_0x1c880b]});const _0x58168b=this['canvas']['createJPEGStream']({'bufsize':0x1000,'quality':0x64,'progressive':![]}),_0x2a2aad=await getBufferFromStream(_0x58168b);await fs['writeFile']('./'+_0x4471fe+'.jpg',_0x2a2aad);const _0x5418e1=Canvas['createCanvas'](0x780/0x2,0x438/0x2),_0x31c9d5=_0x5418e1['getContext']('2d'),_0x401c07=await Canvas['loadImage']('./'+_0x4471fe+'.jpg');_0x31c9d5['drawImage'](_0x401c07,0x0,0x0,_0x5418e1['width'],_0x5418e1['height']),_0x31c9d5['save'](),_0x31c9d5['globalAlpha']=0x1,_0x31c9d5['font']='20px\x20Calibri',_0x31c9d5['globalAlpha']=0.9,_0x31c9d5['shadowOffsetX']=0x1,_0x31c9d5['shadowOffsetY']=0x1,_0x31c9d5['shadowBlur']=0x2,_0x31c9d5['shadowColor']='#000000',_0x31c9d5['fillStyle']='#ffffff',_0x31c9d5['fillText']('IGN:\x20'+_0x1da67e[0x0]['username'],0x1e,0x28);let _0x635dc0=_0x1da67e[0x0]['botUser']['entity']['position']['x']['toString']()['split']('.')[0x0],_0x4d3be3=_0x1da67e[0x0]['botUser']['entity']['position']['y']['toString']()['split']('.')[0x0],_0x41f1f4=_0x1da67e[0x0]['botUser']['entity']['position']['z']['toString']()['split']('.')[0x0];_0x31c9d5['fillText']('Coords:\x20X:\x20'+_0x635dc0+',\x20Y:\x20'+_0x4d3be3+',\x20Z:\x20'+_0x41f1f4,0x1e,0x46);let _0xb8014b=parseInt(_0x1da67e[0x0]['botUser']['entity']['yaw']['toString']()['split']('.')[0x0]);if(_0x40f8ac[0x0]){if(_0x40f8ac[0x0]['toLowerCase']()=='north')_0x31c9d5['fillText']('Facing:\x20North',0x1e,0x64);else{if(_0x40f8ac[0x0]['toLowerCase']()=='east')_0x31c9d5['fillText']('Facing:\x20East',0x1e,0x64);else{if(_0x40f8ac[0x0]['toLowerCase']()=='south')_0x31c9d5['fillText']('Facing:\x20South',0x1e,0x64);else _0x40f8ac[0x0]['toLowerCase']()=='west'&&_0x31c9d5['fillText']('Facing:\x20West',0x1e,0x64);}}}_0x31c9d5['restore']();let _0x3d3c7a=new _0x4f339f['MessageEmbed']()['setColor']('GREEN')['setDescription']('🟩🟩🟩🟩🟩🟩');_0xecc25f['edit']({'embeds':[_0x3d3c7a]});const _0x54253d=new _0x4f339f['MessageAttachment'](_0x5418e1['toBuffer'](),'onlineList.png');await _0x500f55['channel']['send']({'files':[_0x54253d]}),await _0xecc25f['delete'](),fs2['stat']('./'+_0x4471fe+'.jpg',function(_0x157da9,_0x1b51bd){if(_0x157da9)return console['error'](_0x157da9);fs2['unlink']('./'+_0x4471fe+'.jpg',function(_0x2fb0ce){if(_0x2fb0ce)return console['log'](_0x2fb0ce);});});}}const _0x2654e7=new _0x418ca0(_0x1da67e[0x0]['botUser']);_0x2654e7['on']('ready',async()=>{await _0x2654e7['takePicture'](new Vec3(0x1,-0.2,0x0),'screenshot');});});}};