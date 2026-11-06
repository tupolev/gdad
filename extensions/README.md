# Extensiones para Chrome y Firefox

## Chrome
Abre chrome://extensions, activa Modo de desarrollador, pulsa Cargar descomprimida y selecciona la carpeta chrome de este directorio.

## Firefox
Abre about:debugging#/runtime/this-firefox, pulsa Cargar complemento temporal y selecciona firefox/manifest.json. Esta instalación dura hasta reiniciar Firefox; una instalación permanente requiere firmar el complemento con Mozilla.

## Uso
Abre Gmail, abre un único borrador, espera a que se guarde y pulsa el icono de la extensión. Pulsa Detectar adjuntos, comprueba la lista y descarga el ZIP. Para elegir dónde se guarda, activa en tu navegador la opción de preguntar dónde guardar cada descarga. No necesitas servidor, OAuth ni claves.

## Estado y límites
Prototipo sin verificar en una sesión real de Gmail. Depende de que Gmail publique enlaces de descarga de los adjuntos en el borrador. Algunas versiones de su interfaz no los exponen: en ese caso muestra un aviso y NO puede recuperar los adjuntos. No debe considerarse compatible con todos los borradores hasta probarlo con tu cuenta. No utiliza endpoints internos no documentados ni extrae credenciales.

Solo se inspecciona el borrador abierto al pulsar Detectar. No descarga enlaces de Drive, ni archivos que aún estén subiendo. El ZIP es sin compresión y se construye en memoria. Se requiere espacio de memoria suficiente. La descarga solo comienza cuando todos los archivos seleccionados se han recuperado. Los borradores no se envían ni se eliminan.

Permisos: activeTab y scripting permiten leer la pestaña seleccionada al pulsar el icono. No se envían datos a servicios externos ni se incluyen bibliotecas remotas.

## Versión 0.2
Las dos extensiones insertan automáticamente un botón «↧ ZIP» en la barra del borrador; si no encuentran la barra, lo colocan junto al editor. Cada botón selecciona su propio borrador, incluso con varios abiertos, y detecta los adjuntos al abrir el panel. No hay campo de búsqueda obligatorio. El icono de la extensión también sigue disponible.

Después de actualizar, recarga la extensión y la pestaña de Gmail. Chrome pedirá acceso a mail.google.com para insertar el botón automáticamente. En Firefox vuelve a cargar el complemento temporal. La interfaz de Gmail y la descarga real siguen pendientes de verificar con una cuenta real.

## Versión 0.2.3
Solo aparece el botón ZIP junto al editor o en la barra del borrador. Se ha eliminado el botón flotante. Se conserva el enlace para reintentar guardar un ZIP preparado y el seguimiento de la descarga. Recarga la extensión y Gmail para actualizar; acepta el permiso de descargas si el navegador lo solicita.

## Versión 0.3.2
Al detectar los adjuntos, los nombres repetidos reciben un sufijo numérico antes de la extensión: foto.webp, foto (1).webp, foto (2).webp. La comparación ignora mayúsculas para evitar conflictos en Windows. Los nombres mostrados en la lista son los que se guardan en el ZIP; también se evitan colisiones con nombres que ya contienen números. Verificación: node tools/test-filenames.mjs y node tools/test-duplicate-filenames.mjs.

## Firefox 0.3.4
Se envía el Blob del ZIP al proceso de fondo de Firefox y allí se crea su URL temporal. Firefox deniega downloads.download con una URL blob creada en Gmail (Mozilla bug 1696174). Se libera la URL de la extensión al terminar o interrumpirse la descarga, o si falla su inicio. El enlace manual de reintento se conserva. Verificación simulada: node tools/test-firefox-download.mjs. Pendiente de comprobar la descarga real en Firefox/Gmail.
