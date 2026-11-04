# MEL Club · BlackMamba Corp 🐍

**Explorador urbano y comercial** para Veracruz, Córdoba y otras ciudades mexicanas.

> **Estado:** prototipo funcional / validación técnica. Sin comercios afiliados ni descuentos reales. GPS opcional, sin seguimiento continuo.

## Objetivo
Ayudar a descubrir comida, playas, plazas y servicios mediante búsqueda, categorías, puntuaciones sobre seis estrellas y un radar tipo videojuego. La operación local puede generar ingresos a través de acuerdos comerciales verificables, sin vender datos de localización.

## Demo web
La carpeta `web/` contiene una aplicación estática independiente de frameworks. Puedes probarla con:

```sh
cd web
python3 -m http.server 8000
# visitar http://localhost:8000
```

La demo incluye:
- Búsqueda y filtros por ciudad y categoría.
- Calificaciones de **0 a 6 estrellas** (solo de ejemplo).
- Promociones ficticias identificadas como DEMO.
- Radar direccional controlado manualmente para experimentar con ángulos.
- Interfaz adaptable para celulares.

## Etapas
1. **v0.1 (demo):** interfaz con datos sintéticos y pruebas automáticas de utilidades.
2. **v0.2:** catálogo de negocios reales obtenidos de fuentes permitidas, con validación de ubicación, procedencia y horarios.
3. **v0.3:** brújula y geolocalización opt-in, manejo de errores y precisión.
4. **v0.4:** QR para cupones verificables, panel de comercios y eventos de conversión.
5. **v0.5:** panel de operador local e ingresos sujetos a acuerdos.
6. **v0.6:** MEL Family con invitación/consentimiento individual, controles de revocación y protección de menores.
7. **v0.7:** experimentos de AR con soporte por dispositivo.

## Principios técnicos y comerciales
- Una calificación no se compra; las posiciones patrocinadas deben indicarse como tales.
- No inferir una visita o venta a partir de una simple impresión.
- No presentar lugares o descuentos ficticios como acuerdos vigentes.
- Ubicación familiar **desactivada por defecto**, consentida, limitada y revocable. No comercializar datos de ubicación.
- Registro de eventos con minimización de datos y protección antifraude.

## Propiedad y operación
Tecnología: **BlackMamba Corp**. La operación comercial de **MEL Club Veracruz** es una posibilidad, no un acuerdo existente. Los porcentajes o roles dependerán de consentimiento y negociación.

## Licencia
No se ha elegido una licencia de distribución; no se concede una licencia adicional de reutilización por este README.

---
Desarrollado como prototipo exploratorio de BlackMamba Corp.

## Google Maps y GPS

Ejecuta `npm start` y abre http://127.0.0.1:8000. La sección Google Maps permite:
- Abrir la ciudad seleccionada en Google Maps sin clave.
- Obtener ubicación bajo permiso con «Usar mi ubicación» y eliminarla con «Olvidar ubicación». No se guarda en disco ni se envía a nuestro servidor. Si conectas el mapa, las coordenadas se comparten con Google para dibujar tu marcador.
- Conectar un mapa interactivo introduciendo una clave en «Conectar Google Maps». La clave solo se conserva en la pestaña y se envía a Google para cargar su API; no se incorpora al repositorio.

En Google Cloud, habilita **Maps JavaScript API** y facturación. Restringe la clave a esa API y a los referentes HTTP `http://127.0.0.1:8000/*`, `http://localhost:8000/*` y tu dominio de producción. Configura cuotas y alertas de presupuesto. La ubicación requiere localhost o HTTPS y permiso del navegador.

Los negocios actuales siguen siendo ficticios: no se les asignan coordenadas reales ni rutas. Para incorporar un lugar verificado, añade `lat`, `lng` y `locationVerified: true` al registro, documentando su fuente. Entonces aparecerá su marcador y «Cómo llegar»; con GPS se calculará la distancia en línea recta. El radar sigue siendo una simulación y no representa la orientación física del teléfono. Places API aún no está integrada.

Documentación: [carga de Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/load-maps-js-api) · [Maps URLs](https://developers.google.com/maps/documentation/urls/get-started).


## Catálogo real y fichas

La vista inicial **Lugares reales** carga los 49 candidatos de `web/data/veracruz-places.json`, con búsqueda sin distinción de acentos, categorías y fuentes institucionales. Córdoba muestra un estado vacío hasta tener catálogo documentado. **Radar DEMO** conserva la simulación por separado.

Cada ficha muestra dirección, horario publicado, contacto y fecha de revisión cuando existen; los campos desconocidos se indican como pendientes. No se asignan puntuaciones, descuentos o fotos ficticias. Casa Museo Salvador Díaz Mirón tiene coordenadas publicadas por SIC y admite ruta exacta, marcador y distancia en línea recta. Las fichas sin coordenadas ofrecen **Buscar en Google Maps**, que requiere confirmar el resultado. **Ordenar cerca de mí** requiere GPS y excluye lugares sin coordenadas verificadas; no representa distancia por calles ni apertura en tiempo real.

Para añadir ubicaciones al catálogo JSON usa `coordinates: {"lat": ..., "lng": ...}`, `verifiedCoordinates: true` y `coordinateSourceUrl`. La integración convierte estos campos al formato del mapa. Los datos de visita se acompañan de `detailsCheckedOn` y `sourceUrl`. Las fotos se añadirán cuando exista permiso de uso.
