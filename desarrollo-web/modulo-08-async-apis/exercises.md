# Problem Set 8 — Asincronía y APIs

## Sección A — Predicción del event loop

1. Predecí la salida sin ejecutar:
```js
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
(async () => {
  console.log('D');
  await null;
  console.log('E');
})();
console.log('F');
```

## Sección B — Promises

2. Escribí una función `delay(ms)` que devuelva una promesa que resuelve después de `ms`.

3. Implementá `timeout(promise, ms)` que rechace si la promesa original tarda más de `ms`. Usá `Promise.race`.

4. Implementá `retry(fn, veces)` que ejecute `fn` (una función async) y reintente hasta `veces` si falla.

5. Con `Promise.allSettled`, armá un reporte `{ exitosos: N, fallidos: N, errores: [...] }` para un array de 10 URLs.

## Sección C — Fetch

6. Consumí `https://jsonplaceholder.typicode.com/users` y mostrá cada usuario como una `<li>` con nombre y email.

7. Construí una **app del clima**: input de ciudad → fetch a `https://api.open-meteo.com/v1/forecast?latitude=-34.6&longitude=-58.4&current=temperature_2m` (o similar) → mostrar temperatura. Manejá errores y "sin red".

8. **Buscador de GitHub users**: input que al tipear (con debounce 300ms) consulta `https://api.github.com/users/{nombre}` y muestra avatar + nombre + bio. Con AbortController para cancelar el fetch anterior.

9. **POST con JSON**: usá `https://jsonplaceholder.typicode.com/posts` con `method: 'POST'`. Mostrá la respuesta (incluye un `id` generado).

## Sección D — Patrones reales

10. Implementá una **paginación** que cargue 10 items inicialmente. Botón "Cargar más" trae los siguientes 10. Endpoint sugerido: `https://jsonplaceholder.typicode.com/posts?_start=0&_limit=10`.

11. **Infinite scroll** con IntersectionObserver: carga más items cuando el usuario llega al fondo.

12. **Lazy loading de imágenes** con IntersectionObserver: las imágenes solo se descargan cuando están cerca del viewport.

## Sección E — Manejo de estado async

13. Construí una **abstracción `useFetch(url)`** (función que devuelve `{ data, loading, error }`). Cambiá el estado visible según `loading`. (Sin React, con clases o event emitter).

14. Implementá una **caché en memoria** para fetch: si ya pediste la URL X, devolvé la copia cacheada la segunda vez. Con invalidación por tiempo (TTL).

## Sección F — Proyecto mini

15. **Galería de Unsplash / Pexels / Pixabay** (alguna que tenga API pública gratuita):
    - Input de búsqueda con debounce.
    - Grid responsive de 3–6 columnas (Grid con `auto-fit`).
    - Click en imagen → modal con más info.
    - Infinite scroll o paginación.
    - Loading skeletons mientras se cargan.
    - Estado vacío / error prolijos.

## Desafío

16. **Polyfill de fetch** usando `XMLHttpRequest` bajo el capó. Respetá la misma API: `fetch(url, options).then(resp => ...)` con `resp.json()`, `resp.ok`, `resp.status`. Permite entender qué hace fetch por debajo.

17. **Worker thread**: mové un cálculo pesado (ej: factorial de BigInt grande) a un Web Worker (`new Worker('worker.js')`). Medí el freeze de la UI con y sin worker.

## Entregable

Repo en GitHub con 3 apps funcionando (ejercicios 8, 11, 15). Deploy a Netlify/Vercel (gratis).
