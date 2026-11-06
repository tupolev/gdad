import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
for(const browser of ['chrome','firefox']){
const source=readFileSync(`extensions/${browser}/content.js`,'utf8');
const helper=source.slice(source.indexOf('function attachmentName('),source.indexOf('function rootFor('));
const fn=vm.runInNewContext(`(${helper})`);
const element=(text,attrs={})=>({textContent:text,getAttribute:key=>attrs[key]??null,querySelector:()=>null});
for(const [label,expected] of [['photo.webp (144 K)','photo.webp'],['photo.webp (1,4 MB)','photo.webp'],['a.pdf (23 bytes)','a.pdf'],['report (final).pdf','report (final).pdf'],['photo (144 K).webp','photo (144 K).webp']])assert.equal(fn(element(label,{href:'url'}),'url',0),expected);
assert.equal(fn(element('wrong (144 K)',{download:'original (144 K)',href:'url'}),'url',0),'original (144 K)');
assert.equal(fn(element('wrong (144 K)',{download_url:'x'}),'image/webp:original.webp:https://mail.google.com/',25),'original.webp');
}
console.log('Filename regression checks passed for both browsers.');
