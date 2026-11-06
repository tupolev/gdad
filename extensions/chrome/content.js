(()=>{
const {t}=globalThis.GDAD_I18N;
if(window.__draftExporter){window.__draftExporter.open();return;}
let selectedRoot=null;
function open(root=null){selectedRoot=root;document.getElementById('draft-export-panel')?.remove();showPanel();}
window.__draftExporter={open};
function showPanel(){
const panel=document.createElement('div');panel.id='draft-export-panel';panel.style.cssText='position:fixed;right:24px;top:24px;z-index:2147483647;background:white;color:#163b30;padding:24px;border:1px solid #b7cfc2;border-radius:14px;box-shadow:0 12px 48px #0004;font:14px system-ui;width:380px;max-height:85vh;overflow:auto';
const title=document.createElement('h2');title.textContent=t('title');panel.append(title);
const note=document.createElement('p');note.textContent=t('note');panel.append(note);
const list=document.createElement('div'),status=document.createElement('p');status.setAttribute('role','status');let files=[];
function button(text,fn){const b=document.createElement('button');b.textContent=text;b.style.cssText='padding:10px;margin:4px;border:1px solid #abc;border-radius:6px;cursor:pointer';b.onclick=fn;panel.append(b);return b;}
function visible(e){return e.getClientRects().length>0;}
function discover(){
files=[];list.replaceChildren();
const editors=[...document.querySelectorAll('[contenteditable="true"][role="textbox"], [contenteditable="true"][g_editable="true"], .Am[contenteditable="true"]')].filter(visible);
const roots=selectedRoot?.isConnected?[selectedRoot]:[...new Set(editors.map(rootFor).filter(Boolean))];
if(roots.length!==1){status.textContent=t('one');return;}
const seen=new Set();const usedNames=new Set();
for(const e of roots[0].querySelectorAll('[download_url],[data-download-url],a[href]')){
let raw=e.getAttribute('download_url')||e.getAttribute('data-download-url')||e.getAttribute('href')||'';
const match=raw.match(/https:\/\/[^\s]+/);if(!match)continue;
let url;try{url=new URL(match[0]);}catch{continue;}
if(url.origin!=='https://mail.google.com'||url.searchParams.get('view')!=='att')continue;
if(seen.has(url.href))continue;seen.add(url.href);
let name=attachmentName(e,raw,raw.indexOf(match[0]));
name=(name||t('attachment')).replace(/[<>:"/\\|?*\x00-\x1f]/g,'_').replace(/[. ]+$/g,'')||t('attachment');
name=uniqueAttachmentName(name,usedNames);
const box=document.createElement('input');box.type='checkbox';box.checked=true;const label=document.createElement('label');label.style.display='block';label.append(box,document.createTextNode(' '+name));list.append(label);files.push({url:url.href,name,box});
}
status.textContent=files.length?t('count',{n:files.length}):t('empty');
}
button(t('detect'),discover);panel.append(list);
const download=button(t('download'),async()=>{
const selected=files.filter(f=>f.box.checked);if(!selected.length){status.textContent=t('select');return;}download.disabled=true;
try{const entries=[],used=new Set();for(const f of selected){status.textContent=t('reading',{name:f.name});const response=await fetch(f.url,{credentials:'include'});if(!response.ok)throw Error(t('denied',{name:f.name}));if(response.headers.get('content-type')?.includes('text/html'))throw Error(t('html',{name:f.name}));const name=uniqueAttachmentName(f.name,used);entries.push({name,data:new Uint8Array(await response.arrayBuffer())});}
const blob=zip(entries);const url=URL.createObjectURL(blob);
const a=document.createElement('a');a.href=url;a.download='adjuntos-borrador.zip';a.textContent=t('retry');a.style.cssText='display:block;padding:12px;color:#176348;text-decoration:underline';panel.append(a);
// Keep the prepared file available for a real user click if automatic saving fails.
const api=globalThis.browser||chrome;
try{
 const result=await api.runtime.sendMessage({type:'save-draft-zip',url});
 if(!result?.ok)throw Error(result?.error||t('failed'));
 status.textContent=t('started');
 const timer=setInterval(async()=>{
  try{const state=await api.runtime.sendMessage({type:'draft-zip-status',id:result.id});
   if(state?.state==='complete'){clearInterval(timer);status.textContent=t('complete');}
   else if(state?.state==='interrupted'){clearInterval(timer);status.textContent=t('interrupted',{error:state.error||t('detail')});}
   else if(!panel.isConnected)clearInterval(timer);
  }catch{clearInterval(timer);}
 },1500);
}catch(e){status.textContent=t('prepared',{error:e.message});}

}catch(e){status.textContent=e.message;}finally{download.disabled=false;}
});button(t('close'),()=>panel.remove());panel.append(status);document.body.append(panel);discover();
function zip(entries){
const chunks=[],central=[];let offset=0,size=0;const encoder=new TextEncoder();
const header=n=>{const b=new Uint8Array(n);return {b,v:new DataView(b.buffer)};};
for(const e of entries){const name=encoder.encode(e.name),data=e.data;if(data.length>0xffffffff)throw Error(t('large'));let crc=0xffffffff;for(const x of data){crc^=x;for(let k=0;k<8;k++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}crc=(crc^0xffffffff)>>>0;
const h=header(30);h.v.setUint32(0,0x04034b50,true);h.v.setUint16(4,20,true);h.v.setUint16(6,0x800,true);h.v.setUint16(12,33,true);h.v.setUint32(14,crc,true);h.v.setUint32(18,data.length,true);h.v.setUint32(22,data.length,true);h.v.setUint16(26,name.length,true);
const c=header(46);c.v.setUint32(0,0x02014b50,true);c.v.setUint16(4,20,true);c.v.setUint16(6,20,true);c.v.setUint16(8,0x800,true);c.v.setUint16(14,33,true);c.v.setUint32(16,crc,true);c.v.setUint32(20,data.length,true);c.v.setUint32(24,data.length,true);c.v.setUint16(28,name.length,true);c.v.setUint32(42,offset,true);
chunks.push(h.b,name,data);central.push(c.b,name);offset+=30+name.length+data.length;size+=46+name.length;
}if(offset+size>0xffffffff||entries.length>65535)throw Error(t('selectionLarge'));const end=header(22);end.v.setUint32(0,0x06054b50,true);end.v.setUint16(8,entries.length,true);end.v.setUint16(10,entries.length,true);end.v.setUint32(12,size,true);end.v.setUint32(16,offset,true);return new Blob([...chunks,...central,end.b],{type:'application/zip'});
}
}
function uniqueAttachmentName(name, used) {
const dot=name.lastIndexOf('.');
const stem=dot>0?name.slice(0,dot):name;
const extension=dot>0?name.slice(dot):'';
let candidate=name, number=1;
while(used.has(candidate.toLowerCase()))candidate=stem+' ('+(number++)+')'+extension;
used.add(candidate.toLowerCase());
return candidate;
}
function attachmentName(element, raw, urlStart) {
// Explicit filename metadata takes precedence over Gmail's display labels.
const download=element.getAttribute('download');
if(download)return download;
if(raw!==(element.getAttribute('href')||'')){
 const prefix=raw.slice(0,urlStart),colon=prefix.indexOf(':');
 if(colon>=0){const name=prefix.slice(colon+1).replace(/:$/,'');if(name)return name;}
}
const filename=element.getAttribute('data-filename')||element.querySelector('[data-filename]')?.getAttribute('data-filename')||element.querySelector('.vI')?.textContent;
if(filename)return filename.trim();
const label=element.getAttribute('data-tooltip')||element.getAttribute('aria-label')||element.textContent||'';
// Only remove a trailing size annotation from display text, never from explicit filenames.
return label.trim().replace(/\s+\(\s*\d+(?:[.,]\d+)?\s*(?:[KMGT](?:i?B)?|bytes?|B|octets?)\s*\)$/i,'').trim();
}
function rootFor(editor){
return editor.closest('.M9')||editor.closest('[role="dialog"]')||editor.closest('.AD')||editor.closest('form')||editor.parentElement;
}
function installButtons(){
for(const editor of document.querySelectorAll('[contenteditable="true"][role="textbox"], [contenteditable="true"][g_editable="true"], .Am[contenteditable="true"]')){
 const root=rootFor(editor);if(!root)continue;
 const existing=root.querySelector('[data-draft-export-button]');if(existing){existing.title=t('tooltip');existing.setAttribute('aria-label',existing.title);continue;}
 const toolbar=root.querySelector('.aDh')||root.querySelector('[role="toolbar"]');
 const b=document.createElement('button');b.type='button';b.dataset.draftExportButton='true';
 b.textContent='ZIP';b.title=t('tooltip');b.setAttribute('aria-label',b.title);
 b.style.cssText='display:inline-flex;align-items:center;padding:6px 10px;margin:4px;border:1px solid #b7cfc2;border-radius:6px;background:#fff;color:#163b30;cursor:pointer;font:13px system-ui';
 b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();open(root);});
 if(toolbar)toolbar.append(b);else editor.parentElement.insertBefore(b,editor);
}
}
let pending=false;
new MutationObserver(()=>{if(pending)return;pending=true;setTimeout(()=>{pending=false;installButtons();},200);}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['lang']});
installButtons();
})();
