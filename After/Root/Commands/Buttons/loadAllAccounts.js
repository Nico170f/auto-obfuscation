const AccountLoading=require('../Functions/AccountLoading.js'),fs=require('fs');module['exports']={'name':'loadAllAccounts','run':async(_0xbeedaf,_0x4967bb,_0x49eb78)=>{fs['readFile']('./Settings.json','utf8',async function(_0x5c7c59,_0x5fa59b){var _0x211b70=JSON['parse'](_0x5fa59b);let _0x3a78cf=AccountLoading['loggedIn'];if(_0x4967bb['user']['tag']!==_0x4967bb['message']['embeds'][0x0]['footer']['text'])return _0x4967bb['reply']({'content':'Please\x20use\x20`.load`\x20to\x20do\x20this.','ephemeral':!![]});let _0x15b073=_0x4967bb['message']['components'][0x0];_0x15b073['components'][0x0]['disabled']=!![],_0x15b073['components'][0x1]['disabled']=!![],_0x15b073['components'][0x2]['disabled']=![],await _0x4967bb['message']['edit']({'components':[_0x15b073]}),await _0x4967bb['deferReply'](),await AccountLoading['getLoadingStatus'](async function(_0x343a65){if(_0x343a65){await _0x4967bb['editReply']({'content':'<@!'+_0x4967bb['user']['id']+'>\x20-\x20\x20Bots\x20are\x20already\x20being\x20loaded.'});return;}else{try{credentials=JSON['parse'](fs['readFileSync']('./Accounts.json'));}catch(_0x1697c7){return console['log'](_0x1697c7);}setTimeout(async function(){await AccountLoading['startUp'](_0x4967bb,{'multiple':!![],'loaded':{'amount':credentials['length']-_0x3a78cf['length'],'currentlyLoaded':0x0}});},0x64);}});});}};