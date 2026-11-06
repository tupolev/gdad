import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
for(const browser of ['chrome','firefox']){
 let lang='es-ES',labels=[];
 const document={documentElement:{getAttribute:()=>lang},body:{getAttribute:()=>null},querySelectorAll:()=>labels.map(text=>({getAttribute:()=>text}))};
 const context=vm.createContext({document});
 vm.runInContext(readFileSync(`extensions/${browser}/i18n.js`,'utf8'),context);
 const {t,detectLanguage}=context.GDAD_I18N;
 assert.equal(t('close'),'Cerrar');lang='de-DE';assert.equal(t('close'),'Schließen');lang='en-GB';assert.equal(t('close'),'Close');
 assert.equal(t('count',{n:3}),'3 files detected. Check that none are missing.');
 lang='fr';assert.equal(detectLanguage(),'en');lang='';labels=['Redactar'];assert.equal(detectLanguage(),'es');labels=['Senden'];assert.equal(detectLanguage(),'de');
 for(const code of ['en','es','de']){
  lang=code;
  for(const key of ['title','note','one','empty','detect','download','select','retry','failed','started','complete','detail','close','large','selectionLarge','tooltip','attachment','count','reading','denied','html','interrupted','prepared'])assert.ok(t(key)&&(!t(key).includes('undefined')));
  const locale=JSON.parse(readFileSync(`extensions/${browser}/_locales/${code}/messages.json`));assert.ok(locale.extensionDescription.message);
 }
 const manifest=JSON.parse(readFileSync(`extensions/${browser}/manifest.json`));assert.equal(manifest.content_scripts[0].js[0],'i18n.js');
}
console.log('Gmail language detection, live locale changes, fallback and translations passed in both versions.');
