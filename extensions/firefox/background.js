const api=globalThis.browser||chrome;
api.action.onClicked.addListener(async tab=>{
 if(!tab.url?.startsWith('https://mail.google.com/'))return;
 try{await api.scripting.executeScript({target:{tabId:tab.id},files:['i18n.js','content.js']});}catch(e){console.error(e);}
});

const zipUrls=new Map();
function releaseZip(id){const url=zipUrls.get(id);if(url){URL.revokeObjectURL(url);zipUrls.delete(id);}}
api.downloads.onChanged.addListener(delta=>{
 if(delta.state?.current==='complete'||delta.state?.current==='interrupted')releaseZip(delta.id);
});
api.runtime.onMessage.addListener((message,sender,sendResponse)=>{
 if(!sender.tab?.url?.startsWith('https://mail.google.com/'))return;
 if(message.type==='save-draft-zip'){
  if(!(message.blob instanceof Blob)||message.blob.type!=='application/zip'){
   sendResponse({ok:false,error:'Invalid ZIP file.'});return;
  }
  const url=URL.createObjectURL(message.blob);
  api.downloads.download({url,filename:'adjuntos-borrador.zip',saveAs:true,conflictAction:'uniquify'})
   .then(async id=>{
    zipUrls.set(id,url);
    sendResponse({ok:true,id});
    // The download can finish before its promise resolves.
    try{const [item]=await api.downloads.search({id});if(item&&item.state!=='in_progress')releaseZip(id);}catch{}
   }).catch(e=>{URL.revokeObjectURL(url);sendResponse({ok:false,error:e.message});});
  return true;
 }
 if(message.type==='draft-zip-status'&&Number.isInteger(message.id)){
  api.downloads.search({id:message.id}).then(items=>sendResponse({state:items[0]?.state,error:items[0]?.error})).catch(e=>sendResponse({error:e.message}));return true;
 }
});
