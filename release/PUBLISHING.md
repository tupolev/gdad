# GDAD — preparación de publicación 0.3.0

Nombre: GDAD (Gmail Draft Attachment Downloader)
Resumen: Descarga en ZIP los adjuntos disponibles de un borrador abierto en Gmail, directamente desde su editor.
Categoría sugerida: Productividad.
Idioma de la interfaz: Español.

## Descripción para las tiendas
GDAD añade un botón ZIP al editor de borradores de Gmail. Abre un borrador guardado, pulsa ZIP, comprueba los adjuntos detectados y descarga la selección en un archivo ZIP. No requiere configurar OAuth ni un servidor. Puedes elegir dónde guardar el archivo y reintentar con el enlace del panel.

Procesa los archivos localmente en el navegador. No incorpora publicidad, telemetría ni código remoto. No envía ni elimina borradores. Solo admite adjuntos cuyos enlaces de descarga estén disponibles en la interfaz de Gmail; no descarga enlaces de Google Drive ni archivos que aún se estén subiendo. Los ZIP se preparan en memoria y sin compresión.

GDAD es una extensión independiente y no está afiliada a Google, Gmail, Mozilla ni sus productos.

## Justificación de permisos (formularios de ambas tiendas)
- Acceso a mail.google.com mediante content_scripts: insertar el botón ZIP y leer los enlaces de adjuntos del borrador seleccionado.
- activeTab: habilitar la apertura manual del panel desde el icono de la extensión sobre Gmail.
- scripting: cargar el panel al pulsar el icono si la pestaña ya estaba abierta.
- downloads: abrir Guardar como, iniciar la descarga y comprobar si terminó o fue interrumpida. No analiza el historial general de descargas; consulta únicamente el ID iniciado por GDAD.
- Código remoto: no se utiliza. Todo el JavaScript está incluido en el paquete.

## Privacidad en Chrome
Propósito único: guardar localmente en ZIP los adjuntos de un borrador de Gmail elegido por el usuario.
Declarar de manera transparente el acceso/procesamiento local de contenido de comunicaciones, archivos y sus nombres. No confundir ausencia de transmisión al desarrollador con ausencia de acceso a datos. No se venden, comparten ni utilizan para publicidad o solvencia. Revisar las definiciones del formulario vigente y enlazar la política pública.

## Notas para revisores
No hay cuenta propia de GDAD ni credenciales de demostración. Usar una cuenta Gmail de prueba del revisor. Crear un borrador con dos archivos pequeños, esperar a que Gmail lo guarde, pulsar ZIP en el editor, verificar los nombres, seleccionar ambos y descargar. Comprobar el contenido del ZIP. Probar también cancelar Guardar como y el enlace de reintento. Si Gmail no expone enlaces de descarga, aparece un aviso: esta limitación impide exportar ese borrador.
Fuentes legibles completas en el ZIP. Sin compilación, minificación ni dependencias externas de ejecución.

## Pendiente antes de enviar
1. Validar en Chrome y Firefox con Gmail real: borrador nuevo y reabierto, varios borradores, archivos de nombre repetido, ZIP grande, cancelación y reintento. La sintaxis y el validador no prueban estos casos. Actualmente no están verificados.
2. Capturar la interfaz REAL sin información personal. Chrome: al menos una captura, por ejemplo 1280×800, e imagen promocional pequeña 440×280. No presentar un montaje como captura real. Subir icono 128 incluido. Firefox: aportar capturas reales e icono incluido.
3. Publicar PRIVACY.md como página accesible por HTTPS y pegar su URL en los formularios. Añadir un contacto de soporte real en los perfiles de las tiendas; no se ha inventado identidad ni dominio.
4. Crear/configurar cuentas de desarrollador de Chrome Web Store y Mozilla AMO, aceptar sus condiciones y completar los datos de editor y declaraciones que soliciten.
5. Chrome: subir gdad-chrome-0.3.0.zip, completar ficha, privacidad, distribución y enviar a revisión.
6. Firefox: subir gdad-firefox-0.3.0.zip a AMO, elegir listado público, completar ficha, privacidad y notas de revisión, y solicitar firma/revisión. El ZIP local no está firmado.
7. Conservar el ID de Firefox gdad@extensions.local para todas las actualizaciones tras la primera publicación. No necesita ser una dirección real. Chrome asigna su ID en la tienda: no incluir key ni update_url artificiales.

Los paquetes son candidatos para revisión, no una garantía de aprobación ni de funcionamiento con todas las variantes de Gmail. No se ha enviado ni publicado nada.

## Referencias oficiales consultadas
https://developer.chrome.com/docs/webstore/publish/
https://developer.chrome.com/docs/webstore/images/
https://developer.chrome.com/docs/webstore/program-policies/user-data-faq
https://extensionworkshop.com/documentation/develop/firefox-builtin-data-consent/
