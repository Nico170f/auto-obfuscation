module['exports']=async function(_0x35e9cd,_0x5e3419,_0xed9ace){if(!_0x5e3419['clientPermissions'])return![];let _0x1c664e=[];_0x5e3419['clientPermissions']['forEach'](_0x3710e8=>{if(!_0x35e9cd['guild']['me']['permissions']['has'](_0x3710e8))_0x1c664e['push'](_0x3710e8);});if(_0x1c664e['length']==0x0)return![];else{if(_0x5e3419['returnClientPermissions']==![]||_0x5e3419['returnNoErrors'])return!![];else _0x35e9cd['reply']({'embeds':[new _0xed9ace['MessageEmbed']()['setAuthor'](_0x35e9cd['member']['user']['tag'],_0x35e9cd['member']['user']['displayAvatarURL']({'dynamic':!![]}))['setColor']('RANDOM')['setTimestamp']()['setDescription']('I\x20require\x20these\x20permissions\x20to\x20be\x20able\x20to\x20run\x20this\x20command.\x0a•'+_0x1c664e['join']('\x0a•'))],'allowedMentions':{'repliedUser':![]}});return!![];}};