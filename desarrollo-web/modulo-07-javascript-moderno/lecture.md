# Módulo 7 — JavaScript moderno (ES6+)

> *"ES6 saved JavaScript from itself."*

---

## 🎥 Multimedia

**Videos recomendados** — destructuring, spread, classes, prototype inheritance:
[📺 Playlist del módulo 07 →](../multimedia/videos.html#m7)

**Ejemplo ejecutable** del curso — app completa con módulos ES reales:
[▶ Abrir `examples/02-modulos/index.html`](./examples/02-modulos/index.html)

---

## 7.1 Por qué importa

ES6 (2015) y sus sucesoras (ES2016–ES2025) transformaron JavaScript en un lenguaje moderno. En este módulo consolidamos **las features que vas a usar TODOS los días**.

## 7.2 let, const, y scope de bloque (repaso)

Ya vimos esto en el módulo 5. Repaso rápido:

```js
var  // ❌ scope por función, hoisted, se puede redeclarar
let  // ✅ scope por bloque, se puede reasignar
const // ✅ scope por bloque, no se puede reasignar (pero sus propiedades sí si es objeto)
```

## 7.3 Destructuring — desestructurar objetos y arrays

```js
// Arrays
const [primero, segundo, ...resto] = [1, 2, 3, 4, 5];
// primero=1, segundo=2, resto=[3,4,5]

const [, , tercero] = [1, 2, 3]; // saltear elementos

// Swap sin variable temporal
let a = 1, b = 2;
[a, b] = [b, a];

// Objetos
const user = { name: 'Ada', age: 30, city: 'Londres' };
const { name, age } = user;

// Renombrar
const { name: nombre } = user;

// Default
const { country = 'UK' } = user;

// Anidado
const api = { data: { users: [{ id: 1, name: 'Ada' }] } };
const { data: { users: [{ name: firstUser }] } } = api;

// En parámetros de función
function saludar({ name, age = 0 }) {
  return `${name} tiene ${age} años`;
}
saludar(user);

// Array en parámetros
function distancia([x1, y1], [x2, y2]) {
  return Math.hypot(x2 - x1, y2 - y1);
}
distancia([0, 0], [3, 4]); // 5
```

## 7.4 Spread y rest

```js
// Spread en arrays
const nums = [1, 2, 3];
const mas = [0, ...nums, 4];  // [0,1,2,3,4]
const copia = [...nums];
Math.max(...nums); // 3

// Spread en objetos (ES2018)
const persona = { nombre: 'Ada' };
const extendida = { ...persona, edad: 30 };
const fusion = { ...obj1, ...obj2 }; // las claves de obj2 ganan

// Rest en parámetros
function sumar(...args) {
  return args.reduce((a, b) => a + b, 0);
}
sumar(1, 2, 3, 4); // 10
```

## 7.5 Template literals

```js
const nombre = 'Ada';
const saludo = `Hola, ${nombre}!`;
const multi = `línea 1
línea 2
${1 + 1}`;

// Tagged templates (avanzado)
function sanitize(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const val = values[i - 1]?.toString().replace(/</g, '&lt;') ?? '';
    return result + val + str;
  });
}
const user = '<script>';
sanitize`Usuario: ${user}`; // "Usuario: &lt;script>"
```

## 7.6 Arrow functions

```js
// Sin parámetros
const saludar = () => 'hola';

// Un parámetro
const doble = x => x * 2;

// Varios parámetros
const sumar = (a, b) => a + b;

// Cuerpo con múltiples líneas
const factorial = (n) => {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
};

// Devolver objeto: ojo con los paréntesis
const crear = (nombre) => ({ nombre, id: Date.now() });
```

### Diferencias clave con funciones normales

1. **No tienen `this` propio** — heredan del scope exterior.
2. No se pueden usar con `new` (no son constructores).
3. No tienen `arguments` (usá `...rest`).
4. No se pueden "hoistear".

```js
// Diferencia que importa:
const obj = {
  nombre: 'Ada',
  saludar: function() { console.log(this.nombre); },    // 'Ada'
  saludarArrow: () => console.log(this.nombre),          // undefined — this es el global
};
```

**Regla**: usá arrow para callbacks; usá function normal para métodos de objetos.

## 7.7 Clases (syntactic sugar sobre prototipos)

```js
class Persona {
  // Propiedades públicas
  nombre;
  edad;

  // Propiedades privadas (ES2022) — el # es parte del nombre
  #secreto;

  // Propiedades estáticas
  static especie = 'Homo sapiens';

  constructor(nombre, edad) {
    this.nombre = nombre;
    this.edad = edad;
    this.#secreto = 'contraseña';
  }

  // Método
  saludar() {
    return `Hola, soy ${this.nombre}`;
  }

  // Getter / setter
  get descripcion() {
    return `${this.nombre}, ${this.edad} años`;
  }
  set edad(valor) {
    if (valor < 0) throw new Error('Edad inválida');
    this.edad = valor;
  }

  // Método estático
  static crearAnonimo() {
    return new Persona('Anónimo', 0);
  }
}

class Estudiante extends Persona {
  constructor(nombre, edad, carrera) {
    super(nombre, edad);       // llama al constructor padre
    this.carrera = carrera;
  }

  saludar() {
    return `${super.saludar()} y estudio ${this.carrera}`;
  }
}

const ada = new Estudiante('Ada', 30, 'CS');
console.log(ada.saludar());
console.log(ada instanceof Persona); // true
```

**Realidad**: por debajo, JS usa **herencia prototípica**. Las clases son azúcar sintáctico. No tenés herencia múltiple — un padre por clase.

## 7.8 Módulos ES (import / export)

### Export

```js
// utils.js

// Named exports
export function sumar(a, b) { return a + b; }
export const PI = 3.14;
export class Calculadora { /* ... */ }

// Default export (un solo export default por módulo)
export default function() { /* ... */ }

// Reexport
export { otraCosa } from './otro-modulo.js';
```

### Import

```js
// app.js

// Named
import { sumar, PI } from './utils.js';

// Renombrar
import { sumar as agregar } from './utils.js';

// Todo
import * as utils from './utils.js';
utils.sumar(1, 2);

// Default
import miFuncion from './utils.js';

// Mezcla
import miFuncion, { sumar } from './utils.js';

// Dinámico (devuelve promesa)
const mod = await import('./utils.js');
```

### En el HTML

```html
<script type="module" src="app.js"></script>
```

Diferencias importantes de `type="module"` vs script normal:
- Tiene `defer` implícito.
- Scope propio (no polluciona `window`).
- `'use strict'` automático.
- Requiere servirse por HTTP (no `file://` directo) — necesitás un dev server.

## 7.9 Map y Set

### Map — como un objeto, pero con claves de cualquier tipo

```js
const m = new Map();
m.set('clave', 'valor');
m.set(1, 'uno');
m.set({ obj: 'key' }, 'objeto como clave');

m.get('clave');   // 'valor'
m.has('clave');   // true
m.delete('clave');
m.size;
m.clear();

// Iterar
for (const [k, v] of m) { console.log(k, v); }

// De objeto
const obj = { a: 1, b: 2 };
const mapa = new Map(Object.entries(obj));
```

**Map vs Object**: usá `Map` cuando:
- Las claves son dinámicas o no son strings.
- Necesitás iteración ordenada.
- El tamaño es importante (`.size`).

### Set — conjunto sin duplicados

```js
const s = new Set([1, 2, 2, 3]);
s.size;           // 3
s.add(4);
s.has(2);         // true
s.delete(1);

// Uso típico: desduplicar
const unicos = [...new Set([1, 2, 2, 3, 3])]; // [1, 2, 3]
```

### WeakMap / WeakSet

Como Map/Set pero las claves deben ser objetos, y no bloquean el garbage collector. Útiles para metadata.

## 7.10 Iteradores y generators

### Protocolos iterable e iterator

Cualquier objeto con un `[Symbol.iterator]` que devuelva un iterador es "iterable". Arrays, Strings, Maps, Sets — todos lo son.

```js
for (const x of 'hola') console.log(x); // h, o, l, a
```

### Generators — funciones pausables

```js
function* contar() {
  yield 1;
  yield 2;
  yield 3;
}
const g = contar();
g.next(); // { value: 1, done: false }
g.next(); // { value: 2, done: false }
g.next(); // { value: 3, done: false }
g.next(); // { value: undefined, done: true }

// Iterable infinito
function* idGenerator() {
  let id = 1;
  while (true) yield id++;
}
const ids = idGenerator();
ids.next().value; // 1
ids.next().value; // 2
```

Poco usados en el día a día, pero fundamentales en librerías (Redux-saga, async iteration, etc.).

## 7.11 Optional chaining y nullish coalescing

```js
// Optional chaining (?.)
const ciudad = usuario?.direccion?.ciudad; // undefined si falta algún paso
const primero = arr?.[0];
const resultado = fn?.();

// Nullish coalescing (??)
const puerto = config.puerto ?? 3000;  // SOLO si es null o undefined

// Asignación con ?? (ES2021)
config.timeout ??= 5000;
```

## 7.12 Object methods modernos

```js
// Object.entries / fromEntries
const obj = { a: 1, b: 2 };
const pares = Object.entries(obj);                // [['a',1],['b',2]]
const reconstruido = Object.fromEntries(pares);

// Transformar un objeto
const dobles = Object.fromEntries(
  Object.entries(obj).map(([k, v]) => [k, v * 2])
);

// Object.freeze — inmutabilidad superficial
const constante = Object.freeze({ x: 1 });
constante.x = 99; // silencioso en non-strict, error en strict

// Comparar
Object.is(NaN, NaN); // true (=== da false)
```

## 7.13 Symbol y propiedades especiales

```js
const id = Symbol('id');
const user = { [id]: 42, name: 'Ada' };

user[id];   // 42
// No aparece en Object.keys, for...in, JSON.stringify
```

Usos típicos: identificadores únicos, simbolos bien conocidos (`Symbol.iterator`, `Symbol.asyncIterator`).

## 7.14 BigInt

```js
const n = 9007199254740993n;     // con n al final
const big = BigInt(Number.MAX_SAFE_INTEGER) + 1n;
n + 1n; // OK
n + 1;  // ERROR: no se puede mezclar con number
```

Para cuando los `number` (IEEE 754) se quedan cortos.

## 7.15 Features 2022–2025 importantes

```js
// Numeric separators (ES2021)
const millon = 1_000_000;

// Array.at() (ES2022)
[1,2,3].at(-1); // 3

// Object.hasOwn() (ES2022) — reemplaza obj.hasOwnProperty
Object.hasOwn(obj, 'clave');

// Error cause (ES2022)
throw new Error('falló', { cause: errorOriginal });

// Top-level await (ES2022) — solo en módulos
const data = await fetch('/api').then(r => r.json());

// structuredClone (ES2022)
const copia = structuredClone(obj); // deep clone

// Array.prototype.findLast / findLastIndex (ES2023)
[1,2,3,4].findLast(n => n < 3); // 2

// Array.prototype.toSorted / toReversed / toSpliced (ES2023) — no mutantes
const ord = [3,1,2].toSorted(); // [1,2,3], original queda intacto

// Promise.withResolvers (ES2024)
const { promise, resolve, reject } = Promise.withResolvers();
```

---

## 🧑‍🎓 Worked Example

> **Ejercicio**: "Refactorizá este código 'viejo' a ES moderno."
>
> ```js
> var util = {};
> util.fetchUser = function(id, callback) {
>   var req = new XMLHttpRequest();
>   req.open('GET', '/api/users/' + id);
>   req.onload = function() {
>     var data = JSON.parse(req.responseText);
>     var name = data.name;
>     var email = data.email;
>     callback(null, { name: name, email: email });
>   };
>   req.onerror = function() { callback(new Error('failed')); };
>   req.send();
> };
> module.exports = util;
> ```

**Mi análisis, paso a paso:**

1. *`var` → `const`*. Inmutable por default; `var` tiene scoping raro.
2. *XMLHttpRequest → fetch*. Más limpio, devuelve Promise.
3. *Callback → async/await*. Se lee como sync.
4. *`function(x) {}` → arrow function* donde no necesito `this`.
5. *Concatenación con `+` → template literal*.
6. *Destructuring* del response para extraer `name` y `email`.
7. *`module.exports` → `export`* (ES modules).
8. *Manejo de HTTP errors* (fetch no rechaza en 4xx/5xx — hay que chequear `r.ok`).

Resultado:

```js
export async function fetchUser(id) {
  const r = await fetch(`/api/users/${id}`);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const { name, email } = await r.json();
  return { name, email };
}
```

De **13 líneas** a **5**. Más leíble, sin callbacks, sin bugs de `this`, sin prototype pollution.

**Lo que ganamos**:
- Si `/api/users/` cambia, el template literal es más fácil de modificar.
- `throw` en vez de callback con error → flow natural con try/catch.
- Destructuring documenta qué campos consumimos del response.
- Un llamador hace: `const u = await fetchUser(42);` — sync-looking.

## 🧠 Checkpoint Quiz

<details>
<summary><strong>1. ¿Qué imprime? <code>const { a = 10, b = 20 } = { a: 5 };</code></strong></summary>

`a = 5, b = 20`. Los defaults **solo aplican si la clave es `undefined`**.

`null` **no** dispara el default: `const { x = 1 } = { x: null }` → `x = null`.
</details>

<details>
<summary><strong>2. ¿Cuál es la diferencia entre <code>...spread</code> y <code>...rest</code>?</strong></summary>

Sintácticamente iguales, pero:
- **Spread** → **expande** un iterable/objeto. Aparece en llamadas, literales:
  - `fn(...arr)`, `[...arr]`, `{ ...obj }`.
- **Rest** → **recolecta** en un parámetro o variable. Aparece en destructuring y parámetros:
  - `function(...args)`, `const [a, ...rest] = arr`.

Tip mnemónico: spread **sale** hacia afuera, rest **junta** hacia adentro.
</details>

<details>
<summary><strong>3. ¿Arrow functions tienen <code>this</code>?</strong></summary>

**No**, no tienen su propio `this`. Heredan el del scope **léxico** (donde se definieron).

Por eso **no las uses como métodos de objetos** si necesitás `this`:

```js
const obj = {
  name: 'Ada',
  saludarNormal() { return this.name; },        // 'Ada'
  saludarArrow: () => this.name,                 // undefined (this es el global)
};
```

Regla: arrow functions para callbacks (dentro de métodos); methods clásicos para propiedades de objetos.
</details>

<details>
<summary><strong>4. ¿Cuál es la diferencia entre <code>Map</code> y <code>Object</code>?</strong></summary>

| | Object | Map |
|-|-|-|
| Claves | string / symbol | cualquier tipo (objetos, funciones, primitives) |
| Orden | no garantizado (histórico) | orden de inserción |
| `.size` | ❌ hay que contar keys | ✅ directo |
| Iterable | no (solo Object.entries) | sí (`for...of`) |
| Prototype | tiene (puede haber colisiones con `.hasOwnProperty`) | no |
| Performance | rápido para leer por key | mejor para muchas inserts/deletes |

Usá Map para datos dinámicos; Object para estructuras fijas (config, schemas).
</details>

<details>
<summary><strong>5. ¿Cuándo usarías una clase vs un objeto literal?</strong></summary>

**Objeto literal** cuando:
- Necesitás **una** instancia (singleton, config).
- Es un "record" sin comportamiento complejo.

**Clase** cuando:
- Necesitás **múltiples** instancias con el mismo shape y métodos.
- Vas a usar herencia.
- Necesitás campos privados (`#`).
- El objeto tiene "vida" (estado interno, lifecycle).

**Alternativa moderna**: factory functions con closures. Misma funcionalidad, sin `this`:

```js
function crearContador() {
  let n = 0;
  return {
    inc: () => ++n,
    get: () => n,
  };
}
```
</details>

---

## Resumen ejecutivo

- Destructuring + spread + template literals = 80% del código moderno.
- Arrow para callbacks, function para métodos.
- Clases son azúcar sobre prototipos — cuidado con `this`.
- `import`/`export` son el estándar; CommonJS es legado.
- `Map`, `Set` cuando tenga sentido semántico.
- `?.` y `??` son tus aliados contra `undefined`.

## Ejemplos

Ver [`examples/`](./examples/):
- `01-destructuring.js` — ejemplos ejecutables.
- `02-modulos/` — mini app con módulos ES reales.
- `03-clases.js` — herencia y encapsulamiento.

## Ejercicios

Ver [`exercises.md`](./exercises.md).

---

**Siguiente módulo:** [`08 — Asincronía y APIs`](../modulo-08-async-apis/)
