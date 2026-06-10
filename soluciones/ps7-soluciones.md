# Soluciones — PS7: JavaScript moderno

## Sección A — Destructuring

### 1. Primer, último, medio

```js
const arr = [1, 2, 3, 4, 5];
const [primero, ...rest] = arr;
const ultimo = rest.pop();
const medio = rest;
// primero=1, medio=[2,3,4], ultimo=5
```

O en una línea con `at()`:

```js
const primero = arr.at(0);
const ultimo = arr.at(-1);
const medio = arr.slice(1, -1);
```

### 2. Destructuring anidado

```js
const config = {
  server: { host: 'localhost', port: 3000 },
  db: { name: 'app', user: 'admin' }
};
const { server: { host, port }, db: { user } } = config;
// host='localhost', port=3000, user='admin'
```

### 3. merge

```js
const merge = (...objs) => objs.reduce((acc, o) => ({ ...acc, ...o }), {});
merge({ a: 1 }, { b: 2 }, { a: 99 });  // { a: 99, b: 2 }
```

### 4. omit

```js
const omit = (obj, ...keys) => {
  const result = { ...obj };
  for (const k of keys) delete result[k];
  return result;
};
omit({a:1, b:2, c:3}, 'a', 'c');  // { b: 2 }
```

**Alternativa FP**:

```js
const omit = (obj, ...keys) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)));
```

### 5. pick

```js
const pick = (obj, ...keys) =>
  Object.fromEntries(keys.filter(k => k in obj).map(k => [k, obj[k]]));

pick({a:1, b:2, c:3}, 'a', 'c');  // { a: 1, c: 3 }
```

## Sección B — Clases

### 6. Vehículo → Auto → AutoElectrico

```js
class Vehiculo {
  constructor(marca) { this.marca = marca; }
  describir() { return `Vehículo: ${this.marca}`; }
}

class Auto extends Vehiculo {
  constructor(marca, puertas = 4) {
    super(marca);
    this.puertas = puertas;
  }
  describir() { return `${super.describir()}, ${this.puertas} puertas`; }
}

class AutoElectrico extends Auto {
  #bateria = 100;
  constructor(marca, puertas, bateria = 100) {
    super(marca, puertas);
    this.#bateria = bateria;
  }
  get bateria() { return this.#bateria; }
  cargar(pct) {
    this.#bateria = Math.min(100, this.#bateria + pct);
    return this;
  }
  describir() { return `${super.describir()} — batería ${this.#bateria}%`; }
}

const tesla = new AutoElectrico('Tesla', 4, 60);
console.log(tesla.cargar(30).describir());
// "Vehículo: Tesla, 4 puertas — batería 90%"
```

### 7. Pila (Stack)

```js
class Pila {
  #items = [];
  push(v) { this.#items.push(v); return this; }
  pop() { return this.#items.pop(); }
  peek() { return this.#items.at(-1); }
  get size() { return this.#items.length; }
  clear() { this.#items = []; }
}
```

### 8. Cola (Queue)

```js
class Cola {
  #items = [];
  enqueue(v) { this.#items.push(v); }
  dequeue() { return this.#items.shift(); }
  front() { return this.#items[0]; }
  get size() { return this.#items.length; }
}
```

**Nota de performance**: `shift()` es O(n) porque reacomoda todo el array. Para colas grandes, usá una deque real con dos índices (head/tail).

### 9. EventEmitter

```js
class EventEmitter {
  #listeners = new Map();

  on(event, cb) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, new Set());
    this.#listeners.get(event).add(cb);
    return () => this.off(event, cb);  // devuelve unsubscribe
  }

  off(event, cb) {
    this.#listeners.get(event)?.delete(cb);
  }

  emit(event, ...args) {
    this.#listeners.get(event)?.forEach(cb => cb(...args));
  }
}

const em = new EventEmitter();
const unsub = em.on('tick', n => console.log('tick', n));
em.emit('tick', 1);  // → 'tick 1'
unsub();
em.emit('tick', 2);  // nada
```

## Sección C — Módulos

### 10. TODO app modularizada

`storage.js`:
```js
const KEY = 'todos_v1';
export const load = () => JSON.parse(localStorage.getItem(KEY) ?? '[]');
export const save = (todos) => localStorage.setItem(KEY, JSON.stringify(todos));
```

`todos.js`:
```js
export class TodoList {
  constructor(initial = []) { this.items = [...initial]; }
  add(texto)     { this.items.unshift({ id: Date.now(), texto, done: false }); }
  remove(id)     { this.items = this.items.filter(t => t.id !== id); }
  toggle(id)     { const t = this.items.find(t => t.id === id); if (t) t.done = !t.done; }
  filter(kind)   {
    if (kind === 'pending') return this.items.filter(t => !t.done);
    if (kind === 'done')    return this.items.filter(t => t.done);
    return this.items;
  }
}
```

`ui.js`:
```js
export function render(list, container) {
  container.replaceChildren(...list.map(t => {
    const li = document.createElement('li');
    li.textContent = t.texto;
    if (t.done) li.classList.add('done');
    return li;
  }));
}
```

`main.js` (entry):
```js
import { load, save } from './storage.js';
import { TodoList } from './todos.js';
import { render } from './ui.js';

const list = new TodoList(load());
render(list.items, document.querySelector('ul'));

// ... bindear eventos ...
```

### 11. utils.js

```js
// utils.js
export function debounce(fn, ms) { /* ... */ }
export function throttle(fn, ms) { /* ... */ }
export function memoize(fn) { /* ... */ }
export function formatDate(d, locale = 'es-AR') {
  return new Date(d).toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' });
}
```

```js
// main.js
import { debounce, formatDate } from './utils.js';
```

## Sección D — Map, Set, tipos especiales

### 12. Contar palabras con Map

```js
function contarPalabras(palabras) {
  const map = new Map();
  for (const p of palabras) {
    map.set(p, (map.get(p) ?? 0) + 1);
  }
  return map;
}
contarPalabras(['a', 'b', 'a', 'a', 'c']);
// Map { 'a' => 3, 'b' => 1, 'c' => 1 }
```

### 13. Desduplicar conservando el último

```js
const usuarios = [
  { id: 1, nombre: 'Ada', v: 1 },
  { id: 2, nombre: 'Lin', v: 1 },
  { id: 1, nombre: 'Ada', v: 2 },  // duplicado, versión nueva
];

const unicos = [...new Map(usuarios.map(u => [u.id, u])).values()];
// [{id:1,nombre:'Ada',v:2}, {id:2,nombre:'Lin',v:1}]
```

Truco: Map usa la última asignación por clave. Convertir array → Map → array filtra duplicados conservando el último.

### 14. LRU Cache

```js
class LRU {
  #map = new Map();
  constructor(capacity) { this.capacity = capacity; }

  get(key) {
    if (!this.#map.has(key)) return undefined;
    const value = this.#map.get(key);
    this.#map.delete(key);        // re-insertar mueve al final
    this.#map.set(key, value);
    return value;
  }

  set(key, value) {
    if (this.#map.has(key)) this.#map.delete(key);
    this.#map.set(key, value);
    if (this.#map.size > this.capacity) {
      const firstKey = this.#map.keys().next().value;
      this.#map.delete(firstKey);  // elimina el más viejo
    }
  }
}

const cache = new LRU(3);
cache.set('a', 1); cache.set('b', 2); cache.set('c', 3);
cache.get('a');             // mueve 'a' al final (más reciente)
cache.set('d', 4);          // 'b' es ahora el más viejo → se elimina
```

**Clave**: `Map` preserva el orden de inserción. Delete + set = "refrescar" la posición.

## Sección E — Generators

### 15. range

```js
function* range(start, end, step = 1) {
  if (step > 0) for (let i = start; i < end; i += step) yield i;
  else          for (let i = start; i > end; i += step) yield i;
}

[...range(1, 10, 2)];   // [1, 3, 5, 7, 9]
[...range(10, 0, -1)];  // [10, 9, 8, ..., 1]
```

### 16. fibonacci + take

```js
function* fibonacci() {
  let a = 0, b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

function take(n, iter) {
  const result = [];
  for (const v of iter) {
    if (result.length >= n) break;
    result.push(v);
  }
  return result;
}

take(10, fibonacci());  // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

**Magia**: `fibonacci()` es un iterable **infinito** que ocupa memoria O(1). `take` decide cuándo parar.

## Sección F — Refactor

### 17. Modernizar

```js
// Antes
var users = [ /* ... */ ];
function getNames(arr) {
  var names = [];
  for (var i = 0; i < arr.length; i++) names.push(arr[i].name);
  return names;
}
function findByName(arr, name) {
  for (var i = 0; i < arr.length; i++) if (arr[i].name === name) return arr[i];
  return null;
}

// Después
const users = [ /* ... */ ];
const getNames = (arr) => arr.map(u => u.name);
const findByName = (arr, name) => arr.find(u => u.name === name) ?? null;
```

Gan: cero loops manuales, inmutabilidad por default, código más leíble.

## Desafío

### 18. State Machine

```js
class StateMachine extends EventEmitter {
  constructor({ initial, transitions }) {
    super();
    this.state = initial;
    this.transitions = transitions;
  }

  fire(event) {
    const t = this.transitions.find(t => t.from === this.state && t.on === event);
    if (!t) throw new Error(`No transition: ${this.state} + ${event}`);

    this.emit(`leave:${this.state}`);
    this.state = t.to;
    this.emit(`enter:${t.to}`);
    this.emit('change', this.state);
    return this.state;
  }
}

const tsm = new StateMachine({
  initial: 'idle',
  transitions: [
    { from: 'idle', on: 'start', to: 'running' },
    { from: 'running', on: 'pause', to: 'paused' },
    { from: 'paused', on: 'resume', to: 'running' },
    { from: 'running', on: 'stop', to: 'idle' },
  ]
});

tsm.on('enter:running', () => console.log('corriendo!'));
tsm.fire('start');   // → corriendo!
tsm.fire('pause');   // (no log)
```

### 19. pipe + compose

Ver PS5 ej. 25.

---

**Patrones aprendidos**:
- Campos privados con `#` son PRIVADOS de verdad (error en runtime si se accede desde afuera)
- `Map` preserva orden de inserción → base de LRU
- Generators = streams lazy, memoria constante
- Modernizar "loops manuales" a `map/filter/reduce/find` reduce bugs y mejora legibilidad
