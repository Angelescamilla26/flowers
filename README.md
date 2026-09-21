# Amarillo — Un jardín para ti

Un jardín nocturno ilustrado con 40 flores amarillas: girasoles, margaritas, tulipanes y cosmos. Incluye pasto, helechos, hierbas, mariposas, abejas, un conejo, un caracol y luciérnagas.

## Abrir

Abre `index.html` directamente en el navegador. No necesita instalación ni conexión a internet.

Para una vista local con Node.js:

```sh
node dev-server.cjs
```

Visita **http://localhost:4173**.

## Interacciones

- **Haz florecer el jardín:** crea una nueva composición, conservando la especie destacada.
- **Filtros:** destacan cada variedad sin ocultar la vegetación ni los animales.
- **Sonido:** activa una brisa y pequeños sonidos generados con Web Audio; empieza desactivado.
- **Pausa:** detiene el movimiento. También se respeta la preferencia de movimiento reducido del sistema.
- **Pantalla completa:** amplía el jardín en navegadores compatibles.
- **Sus habitantes:** presenta a los pequeños animales del jardín.

## Archivos

- `index.html`: contenido y controles accesibles.
- `style.css`: diseño adaptable y animaciones.
- `garden-art.js`: ilustración SVG procedural, sin dependencias.
- `garden.js`: filtros, regeneración, sonido y controles.
- `dev-server.cjs`: servidor opcional de vista previa local.
