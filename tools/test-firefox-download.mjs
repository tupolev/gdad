// SPDX-License-Identifier: GPL-3.0-only
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
let listener,onChanged,options;const revoked=[];
const browser={action:{onClicked:{addListener(){}}},runtime:{onMessage:{addListener(fn){listener=fn;}}},downloads:{onChanged:{addListener(fn){onChanged=fn;}},async download(o){options=o;return 7;},async search(){return [{state:'in_progress'}];}}};
vm.runInNewContext(readFileSync('extensions/firefox/background.js','utf8'),{browser,Blob,console,URL:{createObjectURL:()=> 'blob:moz-extension://test/zip',revokeObjectURL:u=>revoked.push(u)}});
const sender={tab:{url:'https://mail.google.com/mail/u/0/'}};
const result=await new Promise(resolve=>listener({type:'save-draft-zip',blob:new Blob(['zip'],{type:'application/zip'})},sender,resolve));
assert.equal(result.ok,true);assert.equal(options.url,'blob:moz-extension://test/zip');assert.equal(options.saveAs,true);assert.equal(revoked.length,0);
onChanged({id:7,state:{current:'complete'}});assert.equal(revoked.length,1);
const bad=await new Promise(resolve=>listener({type:'save-draft-zip',url:'blob:https://mail.google.com/test'},sender,resolve));assert.equal(bad.ok,false);
browser.downloads.download=async()=>{throw Error('cancelled');};
const failed=await new Promise(resolve=>listener({type:'save-draft-zip',blob:new Blob(['zip'],{type:'application/zip'})},sender,resolve));assert.equal(failed.ok,false);assert.equal(revoked.length,2);
console.log('Firefox download: extension-owned URL, completion cleanup, invalid payload and cancellation checks passed.');
