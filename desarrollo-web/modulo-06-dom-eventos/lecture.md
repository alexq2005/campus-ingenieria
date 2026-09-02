# Módulo 6 — DOM, Eventos y programación interactiva

> *"The DOM is where HTML, CSS and JavaScript meet."*

---

## 🎥 Multimedia

**DOM Tree Explorer** — escribí HTML, cliqueá cualquier nodo y ve sus atributos, path completo, y el `querySelector` para alcanzarlo:

<iframe
  src="../multimedia/dom-tree-explorer.html"
  width="100%" height="900"
  style="border: 1px solid #334155; border-radius: 10px;"
  loading="lazy"
  title="DOM Tree Explorer — interactivo"></iframe>

> Si el iframe no renderiza, abrí directamente [`multimedia/dom-tree-explorer.html`](../multimedia/dom-tree-explorer.html).

**Videos recomendados:** [📺 Playlist del módulo 06 →](../multimedia/videos.html#m6)

**Ejemplo adicional** — propagación de eventos con las 3 fases visualizadas:
[▶ Abrir `examples/02-event-delegation.html`](./examples/02-event-delegation.html)

---

## 6.1 ¿Qué es el DOM?

El **DOM (Document Object Model)** es la representación **en memoria** de un documento HTML como un árbol de objetos. Cuando el navegador parsea tu HTML, construye ese árbol — y cada nodo del árbol es un objeto JavaScript manipulable.

```
document
  └─ html
      ├─ head
      │   └─ title ("Mi página")
      └─ body
          ├─ h1 ("Hola")
          └─ p ("Mundo")
```

**HTML es texto. DOM es objetos.** No son lo mismo.

## 6.2 Cómo seleccionar elementos

```js
// Por ID (raro hoy — preferí clases)
document.getElementById('navbar');

// Por selector CSS (la forma moderna y versátil)
document.querySelector('.card');               // primer match
document.querySelectorAll('.card');            // NodeList de todos

// Desde otro elemento (solo dentro de él)
const main = document.querySelector('main');
main.querySelectorAll('p');

// Helpers útiles
document.documentElement;  // <html>
document.head;
document.body;
document.title;
```

**Selectores soportan CSS completo**: `querySelector('nav ul li:first-child a[href^="/"]')` funciona.

## 6.3 NodeList vs HTMLCollection

- `querySelectorAll` devuelve **NodeList** (estática, iterable con `for...of`, tiene `.forEach`).
- `getElementsByClassName` devuelve **HTMLCollection** (viva, sin `.forEach` directo).

**Regla**: usá `querySelectorAll`. Convertí a array si necesitás métodos de array:

```js
const cards = document.querySelectorAll('.card');
const arr = [...cards]; // o Array.from(cards)
arr.map(...).filter(...);
```

## 6.4 Atravesar el árbol

```js
const el = document.querySelector('.item');

el.parentElement;          // padre
el.children;               // HTMLCollection de hijos (elementos)
el.childNodes;             // NodeList incluyendo text nodes (raramente útil)
el.firstElementChild;
el.lastElementChild;
el.nextElementSibling;
el.previousElementSibling;

// Buscar hacia arriba
el.closest('.tarjeta');    // ancestro más cercano que matchea
```

## 6.5 Leer y modificar contenido

```js
const el = document.querySelector('#saludo');

// Texto
el.textContent = 'Hola';        // texto plano (SEGURO)
el.innerText = 'Hola';          // texto visible (lento, trigger layout)
el.innerHTML = '<b>Hola</b>';   // parsea HTML (PELIGROSO con user input)

// Atributos
el.getAttribute('href');
el.setAttribute('data-id', '42');
el.removeAttribute('disabled');
el.hasAttribute('required');

// Propiedades directas
el.id;
el.className;        // string — viejo
el.classList;        // API moderna

el.classList.add('activo', 'grande');
el.classList.remove('inactivo');
el.classList.toggle('abierto');
el.classList.contains('activo');
el.classList.replace('viejo', 'nuevo');

// Data attributes
// HTML: <div data-user-id="42" data-role="admin">
el.dataset.userId;    // '42'
el.dataset.role;      // 'admin'
el.dataset.newFlag = 'yes'; // agrega data-new-flag="yes"

// Estilos inline
el.style.color = 'red';
el.style.backgroundColor = 'yellow';  // camelCase en JS
el.style.setProperty('--primary', 'blue'); // CSS variables
```

### `textContent` vs `innerHTML` — seguridad

```js
// ❌ INSEGURO: si userInput tiene "<script>...</script>" se ejecuta
el.innerHTML = userInput;

// ✅ SEGURO: el texto se muestra literal
el.textContent = userInput;
```

**Regla**: **jamás** uses `innerHTML` con input del usuario sin sanitizar. Es la causa #1 de XSS.

## 6.6 Crear y eliminar elementos

```js
// Crear
const div = document.createElement('div');
div.textContent = 'Nuevo';
div.className = 'tarjeta';
div.dataset.id = '1';

// Agregar al DOM
padre.appendChild(div);              // al final
padre.prepend(div);                  // al inicio
hermano.before(div);                 // antes de hermano
hermano.after(div);                  // después

// Moderno: insertar HTML en posición específica
el.insertAdjacentHTML('beforeend', '<p>texto</p>');
// beforebegin | afterbegin | beforeend | afterend

// Reemplazar / clonar
viejo.replaceWith(nuevo);
const clon = el.cloneNode(true); // true = incluir hijos

// Eliminar
el.remove();
padre.removeChild(hijo); // viejo
```

### Document Fragment (performance)

Si vas a insertar 100 elementos, **no** los agregues uno por uno (dispara re-layout cada vez). Usá `DocumentFragment`:

```js
const fragment = document.createDocumentFragment();
for (const item of items) {
  const li = document.createElement('li');
  li.textContent = item;
  fragment.appendChild(li);
}
ul.appendChild(fragment); // un solo re-layout
```

## 6.7 Eventos: la interactividad real

Un **evento** es algo que "sucede" en la página: un click, una tecla, un scroll, una carga de imagen.

### Registrar un event listener

```js
const btn = document.querySelector('#boton');

btn.addEventListener('click', function(evento) {
  console.log('clic!', evento);
});

// Arrow function (lo más común)
btn.addEventListener('click', (e) => {
  console.log('clic!');
});

// Remover
function handler(e) { /* ... */ }
btn.addEventListener('click', handler);
btn.removeEventListener('click', handler); // debe ser la MISMA referencia
```

### El objeto `event`

```js
btn.addEventListener('click', (e) => {
  e.target;             // elemento que disparó el evento
  e.currentTarget;      // elemento donde está el listener (= `this` en fn normal)
  e.type;               // 'click'
  e.preventDefault();   // cancela el comportamiento default (enviar form, seguir link)
  e.stopPropagation();  // detiene el bubbling
});
```

### Tipos de evento comunes

**Mouse**: `click`, `dblclick`, `contextmenu`, `mousedown`, `mouseup`, `mousemove`, `mouseenter`, `mouseleave`.

**Teclado**: `keydown`, `keyup`, `keypress` (deprecated).

**Formulario**: `submit`, `input`, `change`, `focus`, `blur`.

**Ventana**: `load`, `DOMContentLoaded`, `resize`, `scroll`, `beforeunload`.

**Touch**: `touchstart`, `touchmove`, `touchend`.

**Drag & Drop**: `dragstart`, `dragover`, `drop`.

### DOMContentLoaded vs load

```js
document.addEventListener('DOMContentLoaded', () => {
  // HTML parseado. CSS e imágenes pueden no estar listos.
});

window.addEventListener('load', () => {
  // Todo cargó (imágenes, CSS, iframes, fonts).
});
```

Si usás `<script defer>` o `type="module"`, el script corre después de `DOMContentLoaded` automáticamente — no necesitás envolverlo.

## 6.8 Las tres fases de un evento

Cuando hacés click en un `<button>` dentro de un `<div>` dentro del `<body>`, el evento viaja así:

```
  CAPTURE (de window hacia el target)
    window → document → body → div → button
                                      ↓
                                    TARGET
                                      ↓
  BUBBLE (del target hacia afuera)
    button → div → body → document → window
```

Por default, `addEventListener` escucha en **bubble**. Podés cambiar a capture:

```js
el.addEventListener('click', handler, true); // capture
el.addEventListener('click', handler, { capture: true });
el.addEventListener('click', handler, { once: true });   // dispara 1 vez
el.addEventListener('click', handler, { passive: true }); // no llama preventDefault
```

## 6.9 Event Delegation (patrón clave)

En lugar de poner un listener en cada `<li>`, poné **uno solo** en el `<ul>` y usá `e.target`:

```js
const lista = document.querySelector('ul');

lista.addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if (!li) return;  // clic fuera de un li
  console.log('clicaste:', li.dataset.id);
});
```

Ventajas:
- Menos listeners → menos memoria.
- Funciona para elementos **agregados dinámicamente** (que ni existían cuando pusiste el listener).
- Código más limpio.

## 6.10 Formularios

```js
const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();  // evita recargar la página

  // Leer valores
  const formData = new FormData(form);
  const datos = Object.fromEntries(formData);
  console.log(datos);  // { email: '...', password: '...' }

  // Enviar por fetch (módulo 8)
});

// Input en tiempo real
const input = document.querySelector('#buscar');
input.addEventListener('input', (e) => {
  console.log('el usuario escribió:', e.target.value);
});
```

### Debounce — patrón imprescindible

Si el usuario tipea rápido, no querés disparar una búsqueda por cada tecla:

```js
function debounce(fn, ms) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

input.addEventListener('input', debounce((e) => {
  buscar(e.target.value);
}, 300));
```

## 6.11 Eventos custom

Podés emitir tus propios eventos:

```js
const evento = new CustomEvent('carrito:agregar', {
  detail: { producto: 'Libro', precio: 1200 },
  bubbles: true
});
document.dispatchEvent(evento);

// En otro lugar:
document.addEventListener('carrito:agregar', (e) => {
  console.log('Agregaron:', e.detail);
});
```

Ideal para desacoplar componentes.

## 6.12 Storage: persistir datos en el cliente

### localStorage (persiste entre sesiones)

```js
localStorage.setItem('tema', 'oscuro');
const tema = localStorage.getItem('tema');
localStorage.removeItem('tema');
localStorage.clear();

// Objetos: serializá con JSON
localStorage.setItem('usuario', JSON.stringify({ nombre: 'Ada' }));
const u = JSON.parse(localStorage.getItem('usuario'));
```

### sessionStorage (se borra al cerrar pestaña)

Misma API que `localStorage`.

### Cookies (raramente en frontend puro)

Se mandan en cada request HTTP. Las setean usualmente los servidores.

### IndexedDB

Base de datos completa en el navegador (para datos grandes / offline). API asíncrona, más compleja.

## 6.13 Timers

```js
const id = setTimeout(() => {
  console.log('1 segundo después');
}, 1000);
clearTimeout(id);

const idInt = setInterval(() => {
  console.log('cada 2 segundos');
}, 2000);
clearInterval(idInt);

// Mejor para animaciones:
requestAnimationFrame(function tick() {
  // se ejecuta antes del próximo repaint (~60 fps)
  requestAnimationFrame(tick);
});
```

## 6.14 DevTools Elements panel — tu amigo

- Inspeccioná cualquier elemento (click derecho → Inspect).
- Editá el HTML y CSS en vivo.
- `$0` en la consola = el elemento seleccionado actualmente.
- Botón "Break on..." → detener el código cuando ese elemento cambie.

---

## 🧑‍🎓 Worked Example

> **Ejercicio**: "Tengo una lista de 1000 tarjetas, y cada una tiene 3 botones (editar, borrar, compartir). Sin performance hit, ¿cómo manejo los clicks?"

**Mi proceso:**

1. *Intuición primera*: no ponés 3000 listeners individuales. Vamos con **event delegation**.
2. *Estrategia*: un solo listener en el contenedor `<ul>`, y usamos `e.target` + `closest()` para saber qué botón y qué tarjeta.
3. *Decisión de datos*: cada tarjeta tiene un `data-id` para identificar. Cada botón tiene un `data-action`.

```html
<ul id="cards">
  <li data-id="1">
    <h3>Card 1</h3>
    <button data-action="edit">✏️</button>
    <button data-action="delete">🗑</button>
    <button data-action="share">🔗</button>
  </li>
  <!-- ... 999 más ... -->
</ul>
```

```js
const cards = document.getElementById('cards');

cards.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;  // click fuera de un botón

  const li = btn.closest('li[data-id]');
  const id = li?.dataset.id;
  const action = btn.dataset.action;

  const handlers = {
    edit:   () => editarCard(id),
    delete: () => borrarCard(id),
    share:  () => compartirCard(id),
  };
  handlers[action]?.();
});
```

**Ganancia de performance**: 1 listener en vez de 3000. En apps grandes (especialmente SPAs con listas virtualizadas), esto hace la diferencia entre smooth y janky.

**Bonus**: funciona para tarjetas agregadas **dinámicamente después** del listener — no hay que re-bindear.

## 🧠 Checkpoint Quiz

<details>
<summary><strong>1. ¿Cuál es la diferencia entre <code>textContent</code>, <code>innerText</code> y <code>innerHTML</code>?</strong></summary>

- `textContent` → texto puro, **todo** el texto del elemento y descendientes. Ignora CSS (muestra texto oculto). Rápido, seguro.
- `innerText` → solo texto **visible**. Dispara layout/reflow. Más lento.
- `innerHTML` → HTML parseado. **Peligroso con user input** (XSS).

**Regla**: `textContent` para leer/escribir texto. `innerHTML` solo con HTML confiable. Nunca `innerHTML = userInput`.
</details>

<details>
<summary><strong>2. ¿Qué diferencia hay entre <code>e.target</code> y <code>e.currentTarget</code>?</strong></summary>

- `e.target` → el elemento que **originó** el evento (donde el usuario hizo click).
- `e.currentTarget` → el elemento donde **está el listener**.

En event delegation son distintos: listener en `<ul>`, click en `<li>` adentro → `target` es el `<li>`, `currentTarget` es el `<ul>`.

Siempre usá `e.target` con `.closest()` para encontrar el elemento correcto.
</details>

<details>
<summary><strong>3. ¿Qué hace <code>e.preventDefault()</code>?</strong></summary>

Cancela el comportamiento **default** del navegador para ese evento.

Ejemplos:
- En `<form onsubmit>` → evita que el form se envíe (y recargue la página).
- En `<a onclick>` → evita que el link navegue.
- En `<input keydown>` → no siempre funciona; usá `e.key` para filtrar antes.

No cancela la propagación (para eso: `e.stopPropagation()`).
</details>

<details>
<summary><strong>4. Uso <code>addEventListener('click', fn)</code> dentro de un useEffect. ¿Qué olvido?</strong></summary>

El **cleanup**. Si el componente se desmonta o el efecto se re-ejecuta, el listener viejo queda vivo → memory leak.

```js
useEffect(() => {
  const h = (e) => console.log(e);
  window.addEventListener('scroll', h);
  return () => window.removeEventListener('scroll', h);  // ← clave
}, []);
```

Importante: la referencia pasada a `removeEventListener` debe ser **idéntica** a la pasada a `addEventListener` (misma variable, no una copia).
</details>

<details>
<summary><strong>5. ¿Cuándo usar <code>DocumentFragment</code>?</strong></summary>

Cuando vas a insertar **muchos** elementos de una vez. Cada `appendChild` al DOM vivo dispara re-layout. Con fragment, construís el árbol en memoria y hacés un solo `appendChild`:

```js
const frag = document.createDocumentFragment();
for (const item of 1000_items) {
  const li = document.createElement('li');
  li.textContent = item;
  frag.appendChild(li);   // no dispara layout
}
ul.appendChild(frag);     // 1 solo layout
```

Alternativa moderna: `ul.replaceChildren(...arrayDeElementos)` también es eficiente.
</details>

---

## Resumen ejecutivo

- DOM = árbol vivo de objetos que representa el HTML.
- `querySelector(All)` para seleccionar.
- `classList`, `dataset`, `textContent` para leer/escribir.
- `addEventListener` siempre; evitá `onclick=`.
- Event delegation para performance y elementos dinámicos.
- `innerHTML` con user input = XSS. Usá `textContent`.
- `localStorage` para persistir pequeños datos.

## Ejemplos

Ver [`examples/`](./examples/):
- `01-todo-app.html` — TODO list completa con delegation y localStorage.
- `02-event-delegation.html` — visualización de propagación.
- `03-live-search.html` — búsqueda con debounce.

## Ejercicios

Ver [`exercises.md`](./exercises.md).

---

**Siguiente módulo:** [`07 — JavaScript moderno`](../modulo-07-javascript-moderno/)
