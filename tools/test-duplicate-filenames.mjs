import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
for(const browser of ['chrome','firefox']){
 const source=readFileSync(`extensions/${browser}/content.js`,'utf8');
 const helper=source.slice(source.indexOf('function uniqueAttachmentName('),source.indexOf('function attachmentName('));
 const unique=vm.runInNewContext(`(${helper})`);
 const used=new Set();
 const names=['foto.webp','foto.webp','foto (1).webp','FOTO.webp','sin-extension','sin-extension','.oculto','.oculto'];
 assert.deepEqual(names.map(n=>unique(n,used)),['foto.webp','foto (1).webp','foto (1) (1).webp','FOTO (2).webp','sin-extension','sin-extension (1)','.oculto','.oculto (1)']);
 assert.equal(new Set([...used]).size,names.length);
 assert.ok(source.indexOf('name=uniqueAttachmentName(name,usedNames)')<source.indexOf("const box=document.createElement('input')"));
}
console.log('Duplicate filename regression checks passed for both browsers.');
