# MEL Club · BlackMamba Corp 🐍

**Explorador urbano y comercial** para Veracruz, Córdoba y otras ciudades mexicanas.

> **Estado:** prototipo funcional / validación técnica. Sin comercios afiliados, descuentos reales ni rastreo activo.

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
