const AccountLoading=require('../Functions/AccountLoading.js'),fs=require('fs');module['exports']={'name':'stopLoadingAccounts','run':async(_0x5f0762,_0x2a46d8,_0x2dcc23)=>{fs['readFile']('./Settings.json','utf8',async function(_0x842b30,_0x37f622){var _0x1c633d=JSON['parse'](_0x37f622);let _0x5d6838=AccountLoading['loggedIn'];if(_0x2a46d8['user']['tag']!==_0x2a46d8['message']['embeds'][0x0]['footer']['text'])return _0x2a46d8['reply']({'content':'Please\x20use\x20`.load`\x20to\x20do\x20this.','ephemeral':!![]});await AccountLoading['getLoadingStatus'](async function(_0x1682c7){if(!_0x1682c7){let _0x19e6a3=_0x2a46d8['message']['components'][0x0];return _0x19e6a3['components'][0x0]['disabled']=![],_0x19e6a3['components'][0x1]['disabled']=![],_0x19e6a3['components'][0x2]['disabled']=!![],await _0x2a46d8['message']['edit']({'components':[_0x19e6a3]}),await _0x2a46d8['editReply']({'content':'Bots\x20are\x20not\x20currently\x20loading.'})['then'](_0x87eb40=>{setTimeout(function(){_0x87eb40['delete']();},0x1f4);});}else AccountLoading['checkStatus'](!![]),_0x2a46d8['deferUpdate']();});});}};