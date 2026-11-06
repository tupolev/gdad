from pathlib import Path
import json
rows=[
('title','GDAD · Adjuntos del borrador','GDAD · Draft attachments','GDAD · Entwurfsanhänge'),
('note','Espera a que Gmail termine de guardar el borrador. Selecciona sus archivos y descarga el ZIP.','Wait for Gmail to save the draft. Select its files and download the ZIP.','Warte, bis Gmail den Entwurf gespeichert hat. Wähle die Dateien aus und lade die ZIP-Datei herunter.'),
('one','Abre un único borrador (puedes usar la ventana emergente de redacción) y vuelve a detectar.','Open a single draft (you can use the pop-out compose window) and detect again.','Öffne einen einzelnen Entwurf (ggf. im separaten Fenster) und suche erneut nach Anhängen.'),
('empty','Gmail no expone enlaces descargables en este borrador. No se puede exportar con esta versión; no se ha descargado nada.','Gmail does not expose downloadable links in this draft. This version cannot export it; nothing was downloaded.','Gmail stellt für diesen Entwurf keine Downloadlinks bereit. Diese Version kann ihn nicht exportieren; es wurde nichts heruntergeladen.'),
('detect','Detectar adjuntos','Detect attachments','Anhänge erkennen'),
('download','Descargar selección en ZIP','Download selection as ZIP','Auswahl als ZIP herunterladen'),
('select','Detecta y selecciona adjuntos primero.','Detect and select attachments first.','Erkenne und wähle zuerst Anhänge aus.'),
('retry','Guardar ZIP preparado (reintentar)','Save prepared ZIP (retry)','Erstellte ZIP-Datei speichern (erneut versuchen)'),
('failed','No se pudo iniciar la descarga.','The download could not be started.','Der Download konnte nicht gestartet werden.'),
('started','Descarga iniciada. El enlace permite volver a guardar el ZIP.','Download started. Use the link to save the ZIP again.','Download gestartet. Über den Link kannst du die ZIP-Datei erneut speichern.'),
('complete','ZIP descargado. Puedes encontrarlo en las descargas del navegador.','ZIP downloaded. You can find it in your browser downloads.','ZIP heruntergeladen. Du findest sie in den Downloads des Browsers.'),
('detail','sin detalle','no details','keine Details'),
('close','Cerrar','Close','Schließen'),
('large','Archivo demasiado grande para este ZIP.','File too large for this ZIP.','Datei zu groß für diese ZIP-Datei.'),
('selectionLarge','Selección demasiado grande para este ZIP.','Selection too large for this ZIP.','Auswahl zu groß für diese ZIP-Datei.'),
('tooltip','Descargar adjuntos de este borrador','Download attachments from this draft','Anhänge dieses Entwurfs herunterladen'),
('attachment','adjunto','attachment','Anhang'),
('count','{n} archivos detectados. Comprueba que están todos.','{n} files detected. Check that none are missing.','{n} Dateien erkannt. Prüfe, ob alle vorhanden sind.'),
('reading','Leyendo {name}','Reading {name}','{name} wird gelesen'),
('denied','Gmail no permitió descargar {name}','Gmail did not allow downloading {name}','Gmail hat den Download von {name} nicht zugelassen'),
('html','Gmail devolvió una página en lugar del archivo {name}','Gmail returned a page instead of the file {name}','Gmail hat eine Webseite statt der Datei {name} zurückgegeben'),
('interrupted','Descarga cancelada o interrumpida: {error}. Usa el enlace para reintentar.','Download cancelled or interrupted: {error}. Use the link to retry.','Download abgebrochen oder unterbrochen: {error}. Versuche es erneut über den Link.'),
('prepared','ZIP preparado, pero la descarga no se inició: {error} Pulsa el enlace para guardarlo.','ZIP prepared, but download did not start: {error} Click the link to save it.','ZIP erstellt, aber Download nicht gestartet: {error} Klicke auf den Link zum Speichern.'),
]
messages={lang:{r[0]:r[i+1] for r in rows} for i,lang in enumerate(['es','en','de'])}
script='''(()=>{
const messages=MESSAGES;
function detectLanguage(){
 // Gmail's document language describes the current interface, unlike browser locale.
 const declared=document.documentElement.getAttribute('lang')||document.body?.getAttribute('lang');
 const code=(declared||'').toLowerCase().split(/[-_]/)[0];
 if(code)return messages[code]?code:'en';
 // Some Gmail compose windows omit lang; inspect Gmail's own accessible controls.
 const labels=[...document.querySelectorAll('[role="button"][aria-label], [role="button"][data-tooltip]')].map(e=>e.getAttribute('aria-label')||e.getAttribute('data-tooltip')||'');
 if(labels.some(s=>/^(Redactar|Enviar|Buscar correo)(?:\\s|$)/i.test(s)))return 'es';
 if(labels.some(s=>/^(Schreiben|Senden|In E-Mails suchen)(?:\\s|$)/i.test(s)))return 'de';
 return 'en';
}
function t(key,args={}){const text=messages[detectLanguage()][key]||messages.en[key]||key;return text.replace(/\\{(\\w+)\\}/g,(_,k)=>String(args[k]??''));}
globalThis.GDAD_I18N={t,detectLanguage};
})();
'''.replace('MESSAGES',json.dumps(messages,ensure_ascii=False))
for browser in ['chrome','firefox']:
 d=Path('extensions')/browser;(d/'i18n.js').write_text(script,encoding='utf-8')
 for lang in messages:
  folder=d/'_locales'/lang;folder.mkdir(parents=True,exist_ok=True)
  descriptions={'en':'Download available attachments from an open Gmail draft as a ZIP, directly from its editor.','es':'Descarga en ZIP los adjuntos disponibles de un borrador abierto en Gmail, directamente desde su editor.','de':'Lade verfügbare Anhänge eines geöffneten Gmail-Entwurfs direkt im Editor als ZIP herunter.'}
  (folder/'messages.json').write_text(json.dumps({'extensionDescription':{'message':descriptions[lang]},'actionTitle':{'message':'GDAD · '+messages[lang]['tooltip']}},ensure_ascii=False,indent=2),encoding='utf-8')
