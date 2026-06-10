# Soluciones — PS6: DOM y eventos

## Sección A — Manipulación

### 1. Pintar `<li>`

```js
const items = document.querySelectorAll('ul li');
items[0].style.color = 'blue';
items[items.length - 1].style.color = 'red';
items.forEach((li, i) => {
  if ((i + 1) % 2 === 0) li.style.color = 'gold';
  if (li.textContent.length > 10) li.classList.add('long');
});
```

### 2. Ordenar por data-priority

```js
const ul = document.querySelector('.cards');
const ordenados = [...ul.children].sort(
  (a, b) => Number(a.dataset.priority) - Number(b.dataset.priority)
);
ul.replaceChildren(...ordenados);  // NO muta el HTML original, solo el DOM vivo
```

Patrón clave: `[...ul.children]` convierte `HTMLCollection` a array para poder `sort()`.

## Sección B — Eventos

### 3. Contador

```html
<div>
  <button id="dec">−1</button>
  <span id="val">0</span>
  <button id="inc">+1</button>
  <button id="rst">reset</button>
</div>

<script>
  const val = document.getElementById('val');
  let n = 0;
  const render = () => {
    val.textContent = n;
    val.style.color = n < 0 ? 'red' : n > 0 ? 'green' : 'black';
  };
  inc.onclick = () => { n++; render(); };
  dec.onclick = () => { n--; render(); };
  rst.onclick = () => { n = 0; render(); };
</script>
```

### 4. Modal con múltiples formas de cerrar

```js
const modal = document.getElementById('modal');
document.getElementById('open').onclick = () => modal.classList.add('open');
const cerrar = () => modal.classList.remove('open');

modal.querySelector('.close').onclick = cerrar;

// Click fuera (en el backdrop)
modal.addEventListener('click', (e) => {
  if (e.target === modal) cerrar();  // clic en el backdrop, no en el contenido
});

// Tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('open')) cerrar();
});
```

### 5. Validación en vivo

```html
<input type="email" id="email" required>
<small id="fb"></small>

<script>
  email.addEventListener('input', (e) => {
    if (!e.target.value) { fb.textContent = ''; return; }
    fb.textContent = e.target.validity.valid ? '✅ válido' : '❌ inválido';
    fb.style.color = e.target.validity.valid ? 'green' : 'red';
  });
</script>
```

## Sección C — Event delegation

### 6. Galería con 1 solo listener

```js
const gallery = document.querySelector('.gallery');
const preview = document.querySelector('#preview');

gallery.addEventListener('click', (e) => {
  const img = e.target.closest('img');
  if (!img) return;
  preview.src = img.src;
});
```

Clave: `e.target.closest('img')` sube del target hasta encontrar un `<img>`. Si cliqueás fuera, devuelve null.

### 7. Tabla 100 filas

```js
const tabla = document.querySelector('tbody');
let seleccionadas = 0;

tabla.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const fila = btn.closest('tr');

  if (btn.dataset.action === 'del') {
    fila.remove();
  }
});

tabla.addEventListener('change', (e) => {
  if (e.target.matches('input[type=checkbox]')) {
    seleccionadas += e.target.checked ? 1 : -1;
    document.getElementById('count').textContent = seleccionadas;
  }
});
```

Un listener maneja 200+ elementos (100 botones + 100 checkboxes) sin performance hit.

## Sección D — Formularios y storage

### 8. Formulario autosave

```js
const form = document.querySelector('form');
const KEY = 'form_draft_v1';

// Restaurar
const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
for (const [k, v] of Object.entries(saved)) {
  const input = form.elements[k];
  if (input) input.value = v;
}

// Guardar con debounce
let timer;
form.addEventListener('input', () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    const data = Object.fromEntries(new FormData(form));
    localStorage.setItem(KEY, JSON.stringify(data));
  }, 300);
});

// Limpiar
document.getElementById('clear').onclick = () => {
  form.reset();
  localStorage.removeItem(KEY);
};
```

### 9. App de notas

Arquitectura recomendada:

```js
const STORAGE = 'notas_v1';
let notas = JSON.parse(localStorage.getItem(STORAGE) || '[]');

const render = () => {
  contenedor.innerHTML = '';
  for (const n of notas) {
    const article = document.createElement('article');
    article.dataset.id = n.id;
    article.innerHTML = `
      <h3></h3>
      <p></p>
      <time></time>
      <button data-action="edit">Editar</button>
      <button data-action="del">Borrar</button>
    `;
    article.querySelector('h3').textContent = n.titulo;
    article.querySelector('p').textContent = n.contenido;
    article.querySelector('time').textContent =
      new Date(n.creada).toLocaleDateString('es-AR');
    contenedor.appendChild(article);
  }
};

const guardar = () => localStorage.setItem(STORAGE, JSON.stringify(notas));

form.onsubmit = (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  notas.unshift({ id: crypto.randomUUID(), ...data, creada: Date.now() });
  guardar(); render(); form.reset();
};

contenedor.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const id = btn.closest('article').dataset.id;
  if (btn.dataset.action === 'del') {
    notas = notas.filter(n => n.id !== id);
    guardar(); render();
  }
});
```

**`crypto.randomUUID()`** es la forma moderna de IDs únicos (disponible en todos los navegadores modernos desde 2022).

## Sección E — Patterns

### 10. debounce + throttle con mousemove

Ver PS5 ej. 20. Demo de uso:

```js
let count = 0;
const naive = () => console.log('naive', ++count);
const debounced = debounce(naive, 200);
const throttled = throttle(naive, 200);

document.addEventListener('mousemove', debounced);
// Mové el mouse rápido: 1 log cuando parás.
```

### 11. Tabla ordenable

```js
const tabla = document.querySelector('table');
const thead = tabla.querySelector('thead');
const tbody = tabla.querySelector('tbody');
let sortBy = null, asc = true;

thead.addEventListener('click', (e) => {
  const th = e.target.closest('th[data-key]');
  if (!th) return;
  if (sortBy === th.dataset.key) asc = !asc;
  else { sortBy = th.dataset.key; asc = true; }

  // Actualizar indicador
  thead.querySelectorAll('th').forEach(t => t.textContent = t.textContent.replace(/[▲▼]/, ''));
  th.textContent += asc ? ' ▲' : ' ▼';

  // Reordenar
  const filas = [...tbody.children];
  const idx = [...th.parentNode.children].indexOf(th);
  filas.sort((a, b) => {
    const av = a.children[idx].textContent, bv = b.children[idx].textContent;
    const cmp = isNaN(av) ? av.localeCompare(bv) : Number(av) - Number(bv);
    return asc ? cmp : -cmp;
  });
  tbody.replaceChildren(...filas);
});
```

### 12. Drag & drop entre listas

```js
document.querySelectorAll('li').forEach(li => li.draggable = true);

document.addEventListener('dragstart', (e) => {
  if (e.target.matches('li')) {
    e.dataTransfer.setData('id', e.target.id);
    e.target.classList.add('dragging');
  }
});
document.addEventListener('dragend', (e) => e.target.classList.remove('dragging'));

document.querySelectorAll('ul').forEach(ul => {
  ul.addEventListener('dragover', e => e.preventDefault());  // necesario para permitir drop
  ul.addEventListener('drop', (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('id');
    const li = document.getElementById(id);
    ul.appendChild(li);
    persistir();
  });
});
```

## Sección F — Apps

### 13. Carrito

Arquitectura mínima con patrón pub/sub:

```js
const carrito = (() => {
  let items = [];
  const subs = new Set();
  return {
    agregar(prod) {
      const existente = items.find(i => i.id === prod.id);
      if (existente) existente.cant++;
      else items.push({ ...prod, cant: 1 });
      subs.forEach(fn => fn(items));
    },
    quitar(id) {
      items = items.filter(i => i.id !== id);
      subs.forEach(fn => fn(items));
    },
    get total() {
      return items.reduce((t, i) => t + i.precio * i.cant, 0);
    },
    suscribir(fn) { subs.add(fn); return () => subs.delete(fn); },
  };
})();

// Renderizador se suscribe a cambios
carrito.suscribir(items => {
  // Re-render de sidebar del carrito
});
```

## Desafío

### 16. Virtual DOM mini con keys

```js
let prevItems = [];
function render(items) {
  const ul = document.querySelector('ul');
  const prevMap = new Map(prevItems.map(p => [p.id, p]));
  const newMap  = new Map(items.map(p => [p.id, p]));

  // Quitar los que ya no están
  for (const [id, _] of prevMap) {
    if (!newMap.has(id)) ul.querySelector(`[data-id="${id}"]`)?.remove();
  }

  // Agregar/actualizar
  for (const item of items) {
    let li = ul.querySelector(`[data-id="${item.id}"]`);
    if (!li) {
      li = document.createElement('li');
      li.dataset.id = item.id;
      ul.appendChild(li);
    }
    if (li.textContent !== item.texto) li.textContent = item.texto;
  }
  prevItems = items;
}
```

Es el núcleo conceptual de React en ~15 líneas.

### 17. Reactividad con Proxy

```js
function observable(obj) {
  const listeners = new Set();
  const proxy = new Proxy(obj, {
    set(t, k, v) {
      t[k] = v;
      listeners.forEach(fn => fn(k, v));
      return true;
    }
  });
  proxy.__subscribe = (fn) => listeners.add(fn);
  return proxy;
}

const state = observable({ nombre: 'Ada' });
state.__subscribe((k, v) => {
  if (k === 'nombre') document.querySelector('#titulo').textContent = v;
});
state.nombre = 'Lin';  // el título se actualiza solo
```

---

**Patrones aprendidos**:
- `closest()` es delegation de oro
- `crypto.randomUUID()` para IDs
- `Object.fromEntries(new FormData(form))` convierte form → objeto
- `localStorage` + debounce = autosave trivial
- Pub/sub con `Set` de callbacks = reactividad manual
