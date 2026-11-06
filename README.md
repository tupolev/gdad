# GDAD — Gmail Draft Attachment Downloader

Extensiones para Chrome y Firefox que añaden un botón **ZIP** al editor de borradores de Gmail para guardar sus adjuntos localmente.

## Instalación de desarrollo

- **Chrome:** abre `chrome://extensions`, activa Modo de desarrollador y carga la carpeta `extensions/chrome` como extensión descomprimida.
- **Firefox:** abre `about:debugging#/runtime/this-firefox`, pulsa Cargar complemento temporal y selecciona `extensions/firefox/manifest.json`. Requiere Firefox 140 o posterior. La instalación temporal desaparece al cerrar Firefox.

Recarga Gmail después de instalar o actualizar. Abre un borrador guardado, pulsa ZIP, revisa la selección y descarga el archivo. Los nombres repetidos reciben un número antes de su extensión. No necesita servidor ni configurar OAuth.

## Proyecto

- `extensions/chrome` y `extensions/firefox`: código y manifiestos de cada navegador.
- `release`: paquetes de instalación, política de privacidad e instrucciones de publicación.
- `tools`: generación de iconos, empaquetado y pruebas.

Paquetes actuales: Chrome 0.3.3 y Firefox 0.3.4. Los paquetes de Firefox no están firmados por Mozilla. Para instalación permanente se requiere su firma.

## Desarrollo

Node.js permite ejecutar las comprobaciones JavaScript. Python permite empaquetar; Pillow es necesario solo para regenerar iconos.

```text
node tools/test-filenames.mjs
node tools/test-duplicate-filenames.mjs
node tools/test-firefox-download.mjs
python tools/package-extensions.py
npx --yes web-ext lint --source-dir extensions/firefox --warnings-as-errors
```

## Privacidad y límites

Procesamiento local; sin analítica, publicidad ni envío de adjuntos al desarrollador. Las peticiones para recuperar archivos van a Gmail usando la sesión del navegador. Consulta [la política de privacidad](release/PRIVACY.md).

Depende de los enlaces que Gmail exponga en su interfaz. No descarga enlaces de Drive ni archivos que aún estén subiendo. Los ZIP se crean en memoria sin compresión. Gmail puede cambiar su interfaz y requerir ajustes en la extensión.

Proyecto independiente, sin afiliación con Google o Mozilla. Consulta [las instrucciones de publicación](release/PUBLISHING.md) antes de enviar los paquetes a las tiendas.

## Languages
GDAD 0.4.0 supports English, Spanish and German. The panel follows Gmail's current interface language (English fallback for other languages). Browser extension metadata follows the browser language. Reopen the ZIP panel after changing Gmail's language. Run `node tools/test-i18n.mjs` to check language detection and translations. Current packages: Chrome and Firefox 0.4.0.
