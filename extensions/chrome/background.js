const api=globalThis.browser||chrome;
api.action.onClicked.addListener(async tab=>{
 if(!tab.url?.startsWith('https://mail.google.com/'))return;
 try{await api.scripting.executeScript({target:{tabId:tab.id},files:['i18n.js','content.js']});}catch(e){console.error(e);}
});

api.runtime.onMessage.addListener((message,sender,sendResponse)=>{
 if(!sender.tab?.url?.startsWith('https://mail.google.com/'))return;
 if(message.type==='save-draft-zip'){
  if(typeof message.url!=='string'||!message.url.startsWith('blob:https://mail.google.com/')){sendResponse({ok:false,error:'Invalid file origin.'});return;}
  api.downloads.download({url:message.url,filename:'adjuntos-borrador.zip',saveAs:true,conflictAction:'uniquify'})
   .then(id=>sendResponse({ok:true,id})).catch(e=>sendResponse({ok:false,error:e.message}));
  return true;
 }
 if(message.type==='draft-zip-status'&&Number.isInteger(message.id)){
  api.downloads.search({id:message.id}).then(items=>sendResponse({state:items[0]?.state,error:items[0]?.error})).catch(e=>sendResponse({error:e.message}));return true;
 }
});
