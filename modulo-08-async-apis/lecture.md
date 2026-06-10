# Módulo 8 — Asincronía, Promises, async/await y Fetch API

> *"JavaScript is single-threaded. The event loop is why your browser doesn't freeze."*

---

## 🎥 Multimedia de este módulo

**Visualizador del event loop** — mirá cómo call stack, microtasks y macrotasks ejecutan paso a paso. 4 escenarios seleccionables:

<iframe
  src="../multimedia/event-loop-visualizer.html"
  width="100%" height="1000"
  style="border: 1px solid #334155; border-radius: 10px;"
  loading="lazy"
  title="Event Loop Visualizer — interactivo"></iframe>

> Si el iframe no renderiza, abrí directamente [`multimedia/event-loop-visualizer.html`](../multimedia/event-loop-visualizer.html).

**Video imprescindible:** Philip Roberts — *"What the heck is the event loop anyway?"* (JSConf EU 2014, charla más icónica del event loop, embebida en [📺 Playlist del módulo 08](../multimedia/videos.html#m8)).

---

## 8.1 El modelo de ejecución de JavaScript

JavaScript tiene **un solo thread** de ejecución. Si corriés un loop infinito, congelás el navegador entero — incluyendo los clicks del usuario.

Sin embargo, JavaScript puede "hacer cosas a la vez": fetch, timers, eventos. ¿Cómo?

La respuesta es el **event loop**:

```
  ┌─────────────┐
  │ Call Stack  │   ← acá corre tu código (sincrónico)
  └─────────────┘
        ▲
        │ (si el stack está vacío, entra el próximo callback)
        │
  ┌─────────────┐     ┌─────────────────────────┐
  │Microtask    │ <── │ Promises, queueMicrotask │
  │Queue        │     └─────────────────────────┘
  └─────────────┘
        │
  ┌─────────────┐     ┌─────────────────────────┐
  │Macrotask    │ <── │ setTimeout, setInterval, │
  │Queue        │     │ eventos DOM, I/O         │
  └─────────────┘     └─────────────────────────┘
```

Cuando el call stack está vacío, el event loop toma un callback de la cola y lo ejecuta. **Microtasks siempre antes que macrotasks**.

### Ejemplo para grabarte

```js
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');

// Salida: 1, 4, 3, 2
```

- `1` y `4` son sincrónicos → primero.
- `3` es microtask (Promise) → antes que timer.
- `2` es macrotask (setTimeout) → último.

## 8.2 La evolución: callbacks → promises → async/await

### 1. Callbacks (la era oscura)

```js
obtenerUsuario(id, (err, user) => {
  if (err) return console.error(err);
  obtenerPosts(user.id, (err, posts) => {
    if (err) return console.error(err);
    obtenerComentarios(posts[0].id, (err, comments) => {
      if (err) return console.error(err);
      // ...
    });
  });
});
```

Esto se llama **callback hell** o "pirámide de la muerte".

### 2. Promises (2015)

```js
obtenerUsuario(id)
  .then(user => obtenerPosts(user.id))
  .then(posts => obtenerComentarios(posts[0].id))
  .then(comments => console.log(comments))
  .catch(err => console.error(err));
```

### 3. async/await (2017)

```js
try {
  const user = await obtenerUsuario(id);
  const posts = await obtenerPosts(user.id);
  const comments = await obtenerComentarios(posts[0].id);
  console.log(comments);
} catch (err) {
  console.error(err);
}
```

**El código asíncrono se lee como sincrónico.** Esto es la característica más importante de JS moderno.

## 8.3 Anatomía de una Promise

Una **Promise** es un objeto que representa un valor **futuro**. Tiene 3 estados:

- `pending` — aún no sabemos el resultado.
- `fulfilled` — tiene un valor (éxito).
- `rejected` — hay un error.

Una vez que pasa a fulfilled o rejected, **no cambia más** — está "settled".

### Crear una Promise

```js
const miPromesa = new Promise((resolve, reject) => {
  setTimeout(() => {
    const exito = Math.random() > 0.5;
    if (exito) resolve('¡éxito!');
    else       reject(new Error('falló'));
  }, 1000);
});

miPromesa
  .then(valor => console.log(valor))
  .catch(err => console.error(err))
  .finally(() => console.log('terminó'));
```

### Static methods

```js
Promise.resolve(42);                  // ya resuelta
Promise.reject(new Error('...'));     // ya rechazada

// Esperar todas — si una falla, falla toda
Promise.all([p1, p2, p3]);

// Esperar todas, sin fallar aunque alguna rechace
Promise.allSettled([p1, p2, p3]);

// Primera en resolverse (o rechazarse)
Promise.race([p1, p2, p3]);

// Primera en resolverse (ignora las que rechazan)
Promise.any([p1, p2, p3]);
```

### Patrones comunes

```js
// Paralelo (arranca todas al mismo tiempo)
const [usuarios, posts] = await Promise.all([
  fetch('/api/users').then(r => r.json()),
  fetch('/api/posts').then(r => r.json()),
]);

// Secuencial (una después de otra — más lento, úsalo solo si son dependientes)
const user = await fetch('/api/users/1').then(r => r.json());
const posts = await fetch(`/api/users/${user.id}/posts`).then(r => r.json());
```

## 8.4 async/await: sintaxis

### `async`

Declarar una función como `async` hace que **siempre retorne una Promise**.

```js
async function hola() {
  return 42;  // equivale a Promise.resolve(42)
}
hola().then(v => console.log(v)); // 42

// Arrow
const hola = async () => 42;

// Método de clase
class X {
  async cargar() { /* ... */ }
}
```

### `await`

Solo funciona dentro de una `async function` (o en top-level de un módulo ES).

```js
async function fetchDatos() {
  const resp = await fetch('/api/datos');
  const datos = await resp.json();
  return datos;
}
```

`await` pausa la función hasta que la promise resuelva, **pero no bloquea el thread** — el event loop sigue procesando otros eventos.

### Manejo de errores

```js
async function cargar() {
  try {
    const resp = await fetch('/api');
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return await resp.json();
  } catch (error) {
    console.error('Falló:', error);
    return null;  // valor default
  } finally {
    ocultarSpinner();
  }
}
```

## 8.5 La Fetch API

`fetch` es la API moderna para hacer requests HTTP. Devuelve una Promise de un `Response`.

### GET básico

```js
const resp = await fetch('https://api.example.com/users');
if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
const users = await resp.json();
```

⚠️ **Trampa clásica**: `fetch` **no rechaza** en 4xx o 5xx — solo en errores de red. Siempre verificá `resp.ok`.

### POST con JSON

```js
const resp = await fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({ nombre: 'Ada', edad: 30 })
});
```

### PUT, PATCH, DELETE

```js
// Reemplazar
await fetch(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' }});

// Actualización parcial
await fetch(`/api/users/${id}`, { method: 'PATCH', body: JSON.stringify({ edad: 31 }), headers: { 'Content-Type': 'application/json' }});

// Eliminar
await fetch(`/api/users/${id}`, { method: 'DELETE' });
```

### El objeto Response

```js
const r = await fetch(url);

r.ok;           // true si status es 200-299
r.status;       // 200, 404, ...
r.statusText;   // 'OK', 'Not Found', ...
r.headers.get('content-type');
r.url;

await r.json();     // parsea JSON
await r.text();     // texto plano
await r.blob();     // binario (imágenes, archivos)
await r.formData();
await r.arrayBuffer();
```

**Un Response solo se puede consumir UNA vez.** Si llamás `.json()` dos veces explota.

### AbortController (cancelar requests)

```js
const controller = new AbortController();

setTimeout(() => controller.abort(), 3000);  // cancela a los 3s

try {
  const r = await fetch(url, { signal: controller.signal });
} catch (e) {
  if (e.name === 'AbortError') {
    console.log('Cancelado por timeout');
  }
}
```

Crítico para buscadores en vivo: cuando el usuario tipea de nuevo, cancelás el fetch anterior.

## 8.6 Headers, CORS y seguridad

### CORS (Cross-Origin Resource Sharing)

Por seguridad, el navegador **bloquea** requests a otros dominios salvo que el servidor lo permita con headers específicos:

```
Access-Control-Allow-Origin: https://miapp.com
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Content-Type, Authorization
```

Si ves un error `CORS policy`, es **del servidor** — no lo arreglás con más código en el cliente. Arreglá el backend o usá un proxy.

### Autenticación

```js
// Bearer token (JWT, API keys)
fetch('/api', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Cookies (se envían automáticamente si mismo origen)
fetch('/api', {
  credentials: 'include'  // 'same-origin' | 'include' | 'omit'
});
```

### Content types comunes

- `application/json` — JSON (lo más común).
- `multipart/form-data` — para uploads de archivos.
- `application/x-www-form-urlencoded` — formularios HTML clásicos.

## 8.7 Timers

```js
// Una vez
const id = setTimeout(() => console.log('1s'), 1000);
clearTimeout(id);

// Repetir
const intId = setInterval(() => console.log('tick'), 1000);
clearInterval(intId);

// Animación (sincronizado con repaint)
function loop() {
  // dibujar frame
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
```

### Promisificar un timer

```js
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function demo() {
  console.log('antes');
  await sleep(1000);
  console.log('después');
}
```

## 8.8 APIs del navegador útiles

### Geolocation

```js
navigator.geolocation.getCurrentPosition(
  pos => console.log(pos.coords.latitude, pos.coords.longitude),
  err => console.error(err),
  { enableHighAccuracy: true, timeout: 5000 }
);
```

### Notifications

```js
const perm = await Notification.requestPermission();
if (perm === 'granted') {
  new Notification('¡Hola!', { body: 'Soy una notificación' });
}
```

### Clipboard

```js
// Copiar
await navigator.clipboard.writeText('Hola!');
// Leer
const texto = await navigator.clipboard.readText();
```

### Intersection Observer (lazy load, infinite scroll)

```js
const obs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    }
  });
});
document.querySelectorAll('.lazy').forEach(el => obs.observe(el));
```

### Web Storage API (repaso)

Ya cubierto en módulo 6. Recordá: `localStorage.setItem`/`getItem`.

### History API (SPAs)

```js
history.pushState({ page: 1 }, '', '/ruta');
window.addEventListener('popstate', (e) => {
  console.log('usuario navegó atrás:', e.state);
});
```

## 8.9 WebSocket (comunicación bidireccional)

Para chats, dashboards en vivo, notificaciones push:

```js
const ws = new WebSocket('wss://chat.example.com');

ws.addEventListener('open', () => ws.send('hola'));
ws.addEventListener('message', (e) => console.log('recibí:', e.data));
ws.addEventListener('close', () => console.log('cerrado'));
ws.addEventListener('error', (e) => console.error(e));
```

## 8.10 Service Workers (PWA, offline)

Scripts que corren en background del navegador. Interceptan fetches — habilitan apps offline, push notifications, sincronización en background.

```js
// main.js
if ('serviceWorker' in navigator) {
  await navigator.serviceWorker.register('/sw.js');
}

// sw.js
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
```

Ver curso CS190 de PWAs si querés profundizar.

---

## 🧑‍🎓 Worked Example

> **Ejercicio**: "Un usuario en un buscador tipea muy rápido. Tu app hace 1 request por cada tecla → saturás el backend. ¿Cómo lo arreglás?"

**Mi análisis paso a paso:**

1. *Diagnóstico*: el problema es que cada `input` dispara `fetch` inmediatamente. Si el usuario tipea "JavaScript" (10 chars), son 10 requests.

2. *Solución 1 — debounce*: esperar 300ms después de que pare de tipear antes de disparar el request. Si tipea rápido, cancelamos el timer y volvemos a esperar.

3. *Problema nuevo*: después de 300ms se dispara el fetch. Si el usuario sigue tipeando mientras llega la respuesta anterior, tengo una **race condition**: puede llegar una respuesta vieja *después* de una nueva.

4. *Solución 2 — AbortController*: cancelar el fetch anterior cuando se dispara uno nuevo.

Resultado final:

```js
const input = document.getElementById('buscar');
const out = document.getElementById('resultados');

let controller = null;

function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

async function buscar(q) {
  if (!q) { out.innerHTML = ''; return; }

  // Cancelar el fetch anterior
  controller?.abort();
  controller = new AbortController();

  try {
    const r = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
      signal: controller.signal,
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    mostrar(data);
  } catch (e) {
    if (e.name === 'AbortError') return;  // cancelación esperada, silenciar
    console.error(e);
  }
}

input.addEventListener('input', debounce((e) => buscar(e.target.value), 300));
```

**Dos técnicas combinadas** convierten un código ineficiente y con bugs en algo production-ready. Y funcionó porque entendimos el problema (race condition no era obvio al principio).

## 🧠 Checkpoint Quiz

<details>
<summary><strong>1. ¿En qué orden sale esta salida?</strong></summary>

```js
console.log('1');
setTimeout(() => console.log('2'));
Promise.resolve().then(() => console.log('3'));
console.log('4');
```

**Respuesta: 1, 4, 3, 2.**

- `1` sync.
- `setTimeout` va a macrotask queue.
- `.then` va a microtask queue.
- `4` sync.
- Stack vacío → vaciar microtasks → `3`.
- Luego macrotasks → `2`.

Microtasks **siempre** antes de macrotasks.
</details>

<details>
<summary><strong>2. ¿Fetch rechaza con status 404?</strong></summary>

**No**. `fetch` solo rechaza con errores de red (DNS, CORS, offline). Status 4xx/5xx son respuestas "válidas" del servidor — resuelven.

Siempre chequeá `r.ok`:
```js
const r = await fetch(url);
if (!r.ok) throw new Error(`HTTP ${r.status}`);
```

Sorpresa para juniors todo el tiempo.
</details>

<details>
<summary><strong>3. Diferencia entre <code>Promise.all</code>, <code>Promise.race</code>, <code>Promise.allSettled</code>, <code>Promise.any</code>.</strong></summary>

- `Promise.all([p1, p2, p3])` → resuelve con `[v1, v2, v3]` cuando **todas** resolvieron. Rechaza apenas **una** rechaza (cortocircuito).
- `Promise.race([p1, p2, p3])` → se resuelve/rechaza con la **primera** que termina (sea éxito o error).
- `Promise.allSettled([...])` → espera a **todas**, resuelve con array de `{status, value/reason}`. **Nunca rechaza**.
- `Promise.any([...])` → resuelve con el primero que **resuelve con éxito** (ignora rechazos). Solo rechaza si **todas** fallan.

Uso:
- `all` cuando necesitás todas (dashboard con 3 endpoints).
- `race` para timeouts (`Promise.race([fetch(), timeout(5000)])`).
- `allSettled` cuando querés reporte de todos (cancel múltiple).
- `any` cuando cualquier CDN que responda sirve.
</details>

<details>
<summary><strong>4. ¿Qué hace <code>await</code>?</strong></summary>

Pausa la ejecución de la función `async` hasta que la Promise resuelva. **No bloquea el thread** — libera el event loop. Cuando la Promise resuelve, la continuación se encola como microtask.

Equivale a `.then`:
```js
// Estas dos son equivalentes
const a = await fetch(url);
fetch(url).then(a => { /* continuación */ });
```

`await` solo funciona dentro de funciones `async` o en top-level de módulos ES.
</details>

<details>
<summary><strong>5. ¿Cuándo CORS es "problema tuyo" (del cliente) vs del servidor?</strong></summary>

**Siempre** del servidor. CORS es una restricción del navegador que se relaja con headers que **el servidor** debe enviar.

Si tu API devuelve `Access-Control-Allow-Origin: https://miapp.com`, tu app puede pedirle data.
Si no, el navegador bloquea la respuesta.

Workarounds del lado del cliente (feos, para desarrollo):
- Proxy en Vite: `vite.config.js → server.proxy`.
- CORS Anywhere (solo para hobby).

Workaround real: arreglar el servidor o usar un proxy en tu backend.
</details>

---

## Resumen ejecutivo

- JS tiene un solo thread. El event loop es lo que permite asincronía.
- Microtasks (promises) antes que macrotasks (setTimeout).
- `async`/`await` es promises con cara de código sincrónico.
- `fetch` devuelve Promise; `resp.ok` falso ≠ throw — verificalo manualmente.
- Usá `Promise.all` para paralelo, `AbortController` para cancelar.
- CORS es del servidor; no lo arreglás en el cliente.

## Ejemplos

Ver [`examples/`](./examples/):
- `01-event-loop.html` — demostración del orden de ejecución.
- `02-fetch-api-reales.html` — consumo de PokéAPI y JSONPlaceholder.
- `03-promise-all-vs-sequential.html` — medición de performance.

## Ejercicios

Ver [`exercises.md`](./exercises.md).

---

**Siguiente módulo:** [`09 — Tooling`](../modulo-09-tooling/)
