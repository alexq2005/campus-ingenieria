# Soluciones — PS8: Asincronía y APIs

## Sección A — Predicción

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

**Salida**: `A, D, F, C, E, B`

Razón:
1. `A` — sync.
2. IIFE async arranca: imprime `D`. `await null` pausa y **encola la continuación como microtask**.
3. `F` — sync.
4. Stack vacío → vaciar microtasks: primero `C` (fue encolada antes), después `E`.
5. Macrotask: `B`.

Truco: `await null` no es "no hacer nada" — siempre genera al menos 1 microtask.

## Sección B — Promises

### 2. delay

```js
const delay = (ms) => new Promise(r => setTimeout(r, ms));
await delay(1000);
```

### 3. timeout

```js
function timeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))
  ]);
}

await timeout(fetch('/api'), 5000).catch(e => console.error(e));
```

### 4. retry

```js
async function retry(fn, veces) {
  let ultimoError;
  for (let i = 0; i < veces; i++) {
    try {
      return await fn();
    } catch (e) {
      ultimoError = e;
      await delay(2 ** i * 100);  // exponential backoff
    }
  }
  throw ultimoError;
}

const data = await retry(() => fetch('/api').then(r => r.json()), 3);
```

### 5. Reporte con allSettled

```js
async function reporteDeUrls(urls) {
  const results = await Promise.allSettled(urls.map(u => fetch(u)));
  return {
    exitosos: results.filter(r => r.status === 'fulfilled').length,
    fallidos: results.filter(r => r.status === 'rejected').length,
    errores: results.filter(r => r.status === 'rejected').map(r => r.reason.message),
  };
}
```

## Sección C — Fetch

### 6. Listar usuarios

```js
async function cargarUsuarios() {
  const ul = document.querySelector('ul');
  try {
    const r = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const users = await r.json();
    ul.replaceChildren(...users.map(u => {
      const li = document.createElement('li');
      li.textContent = `${u.name} · ${u.email}`;
      return li;
    }));
  } catch (e) {
    ul.innerHTML = `<li style="color:red">${e.message}</li>`;
  }
}
```

### 7. App del clima

```js
async function getClima(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m`;
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    return data.current;
  } catch (e) {
    if (!navigator.onLine) throw new Error('Sin conexión');
    throw e;
  }
}

// Uso
const buenos_aires = await getClima(-34.6, -58.4);
console.log(`BA: ${buenos_aires.temperature_2m}°C`);
```

### 8. Buscador de GitHub con AbortController

```js
const input = document.querySelector('#user');
const out = document.querySelector('#result');

let ctrl = null;  // guarda el controller activo
const debounced = debounce(buscar, 300);
input.addEventListener('input', (e) => debounced(e.target.value));

async function buscar(username) {
  if (!username) return;

  // Cancelar el fetch anterior (si existe)
  ctrl?.abort();
  ctrl = new AbortController();

  try {
    const r = await fetch(`https://api.github.com/users/${username}`, { signal: ctrl.signal });
    if (!r.ok) throw new Error(`${r.status}`);
    const u = await r.json();
    out.innerHTML = `
      <img src="${u.avatar_url}" width="80">
      <h3>${u.name || u.login}</h3>
      <p>${u.bio ?? ''}</p>
    `;
  } catch (e) {
    if (e.name !== 'AbortError') out.innerHTML = `<p style="color:red">${e.message}</p>`;
    // AbortError se ignora — es esperado cuando cancelamos
  }
}
```

Patrón clave: guardar el `AbortController` en closure / variable externa y llamar `.abort()` en la próxima búsqueda.

### 9. POST con JSON

```js
const r = await fetch('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'mi post', body: '...', userId: 1 })
});
const nuevo = await r.json();
// { id: 101, title: '...', ... }  ← el servidor generó un id
```

## Sección D — Patterns

### 10. Paginación

```js
let start = 0;
const LIMIT = 10;

async function cargarMas() {
  const r = await fetch(`https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${LIMIT}`);
  const posts = await r.json();
  start += LIMIT;
  return posts;
}

// Uso
btnMas.addEventListener('click', async () => {
  const posts = await cargarMas();
  for (const p of posts) { /* append al DOM */ }
});
```

### 11. Infinite scroll

```js
const obs = new IntersectionObserver(async (entries) => {
  if (entries[0].isIntersecting) {
    const posts = await cargarMas();
    if (posts.length === 0) obs.disconnect();  // no hay más
    // append al DOM...
  }
});
obs.observe(document.querySelector('#sentinel'));
// sentinel = un div invisible al final de la lista
```

### 12. Lazy loading de imágenes

```html
<img data-src="/foto.jpg" alt="..." class="lazy">
```

```js
const imgObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.src = entry.target.dataset.src;
      imgObs.unobserve(entry.target);
    }
  });
});
document.querySelectorAll('img.lazy').forEach(img => imgObs.observe(img));
```

**Nota**: desde 2020 hay `<img loading="lazy">` nativo. Usá IntersectionObserver solo si necesitás control fino (ej: placeholder blur).

## Sección E — Estado async

### 13. useFetch (sin React)

```js
function useFetch(url, onChange) {
  const state = { data: null, loading: true, error: null };
  fetch(url)
    .then(r => r.json())
    .then(data => { state.data = data; state.loading = false; onChange(state); })
    .catch(error => { state.error = error; state.loading = false; onChange(state); });
  onChange(state);  // estado inicial
  return state;
}

// Uso
useFetch('/api/users', ({ data, loading, error }) => {
  if (loading) renderLoading();
  else if (error) renderError(error);
  else renderUsers(data);
});
```

### 14. Cache con TTL

```js
const cache = new Map();

async function fetchCached(url, ttl = 60_000) {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.at < ttl) {
    return cached.data;
  }
  const r = await fetch(url);
  const data = await r.json();
  cache.set(url, { data, at: Date.now() });
  return data;
}
```

**Mejora**: usar `WeakRef` o LRU para evitar memory leaks si la caché crece indefinidamente.

## Sección F — Proyecto

### 15. Galería con debounce + skeleton

Estructura recomendada (Pexels API):

```js
const API = 'https://api.pexels.com/v1/search';
const HEADERS = { Authorization: 'TU_API_KEY' };
let ctrl = null;

const buscar = debounce(async (q) => {
  if (!q) { grid.innerHTML = ''; return; }
  ctrl?.abort();
  ctrl = new AbortController();

  // Mostrar 6 skeletons mientras carga
  grid.innerHTML = Array(6).fill('<div class="skeleton"></div>').join('');

  try {
    const r = await fetch(`${API}?query=${encodeURIComponent(q)}&per_page=12`, {
      headers: HEADERS, signal: ctrl.signal,
    });
    const { photos } = await r.json();

    if (photos.length === 0) {
      grid.innerHTML = '<p>Sin resultados</p>';
      return;
    }

    grid.replaceChildren(...photos.map(p => {
      const el = document.createElement('img');
      el.src = p.src.medium;
      el.alt = p.alt;
      el.loading = 'lazy';
      return el;
    }));
  } catch (e) {
    if (e.name !== 'AbortError') grid.innerHTML = `<p>Error: ${e.message}</p>`;
  }
}, 400);

input.addEventListener('input', (e) => buscar(e.target.value));
```

Con skeletons CSS:

```css
.skeleton {
  aspect-ratio: 3 / 2;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

## Desafío

### 16. Polyfill de fetch con XHR

```js
function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(options.method || 'GET', url);
    for (const [k, v] of Object.entries(options.headers || {})) xhr.setRequestHeader(k, v);

    xhr.onload = () => resolve({
      ok: xhr.status >= 200 && xhr.status < 300,
      status: xhr.status,
      text: () => Promise.resolve(xhr.responseText),
      json: () => Promise.resolve(JSON.parse(xhr.responseText)),
    });
    xhr.onerror = () => reject(new TypeError('Network error'));
    xhr.send(options.body);
  });
}
```

Explica por qué fetch devuelve `Promise<Response>` y por qué `.json()` también devuelve Promise (lectura del body es asíncrona).

### 17. Web Worker

```js
// main.js
const worker = new Worker('worker.js');
worker.postMessage({ n: 100000 });
worker.onmessage = (e) => console.log('resultado:', e.data);

// Mientras tanto, la UI no se congela.
```

```js
// worker.js
self.onmessage = (e) => {
  let result = 1n;
  for (let i = 2n; i <= BigInt(e.data.n); i++) result *= i;
  self.postMessage(result.toString());
};
```

Sin worker: el navegador se congela al calcular `factorial(100000)`. Con worker: la UI sigue respondiendo.

---

**Patrones aprendidos**:
- `AbortController` es la forma moderna de cancelar fetches
- Exponential backoff (`2 ** i * 100`) en retry es mejor que delay fijo
- `Promise.allSettled` para "al menos reportar"; `Promise.all` solo si todo debe funcionar
- IntersectionObserver reemplaza muchos scroll listeners tradicionales
- Web Workers para cálculo pesado fuera del main thread
