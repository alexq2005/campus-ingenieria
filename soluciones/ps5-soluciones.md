# Soluciones — PS5: JavaScript fundamentos

## Sección A — Predicción

```js
// 1.
typeof NaN                       // → 'number'  ← sí, NaN es un número ("not-a-number" pero del tipo number)

// 2.
[] + []                          // → ''  (ambos se convierten a string vacío, concatenan)
[] + {}                          // → '[object Object]'
{} + []                          // → 0   (en consola, {} es interpretado como bloque vacío, luego +[] → +'' → 0)

// 3.
0.1 + 0.2 === 0.3                // → false (0.30000000000000004 !== 0.3) — IEEE 754

// 4.
let x = 1;
(function() { let x = 2; console.log(x); })();   // 2
console.log(x);                                   // 1

// 5.
const arr = [1, 2, 3];
const copia = arr;               // mismo objeto
copia.push(4);
arr.length                       // → 4 (es el mismo array)

// 6.
null == undefined                // → true  (caso especial del ==)
null === undefined               // → false (tipos distintos)

// 7.
'Ada' || 'default'               // → 'Ada'
0 || 18                          // → 18  (0 es falsy)
0 ?? 10                          // → 0   (?? solo reemplaza null/undefined)
```

## Sección B — Funciones

### 8. promedio

```js
function promedio(...nums) {
  if (nums.length === 0) return NaN;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}
promedio(1, 2, 3, 4);  // 2.5
```

### 9. factorial

```js
// Recursivo
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

// Iterativo
function factorialIterativo(n) {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

factorial(10);           // 3628800
factorial(20);           // 2432902008176640000 (cerca del límite de Number)

// Para n grande, usar BigInt:
function factBig(n) {
  let r = 1n;
  for (let i = 2n; i <= BigInt(n); i++) r *= i;
  return r;
}
factBig(50);             // 30414093201713378043612608166064768844377641568960512000000000000n
```

**Trampa**: la recursión tiene límite de stack (~10_000 llamadas). Para n grande, iterativo.

### 10. capitalizar

```js
const capitalizar = (texto) =>
  texto
    .split(' ')
    .map(w => w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : '')
    .join(' ');

capitalizar('hola mundo de js');  // 'Hola Mundo De Js'
```

### 11. esPalindromo

```js
function esPalindromo(texto) {
  const limpio = texto
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // quitar acentos
    .replace(/\s+/g, '');
  return limpio === [...limpio].reverse().join('');
}
esPalindromo('Anita lava la tina');  // true
esPalindromo('No lo sabes lo son');  // true
```

Truco clave: `normalize('NFD')` + regex para sacar acentos es el canon en español.

## Sección C — Arrays

### 12. Ventas

```js
const ventas = [ /* ... */ ];

// Total vendido
const total = ventas.reduce((t, v) => t + v.monto, 0);  // 6100

// Total por producto
const porProducto = ventas.reduce((acc, v) => {
  acc[v.producto] = (acc[v.producto] ?? 0) + v.monto;
  return acc;
}, {});
// { A: 2700, B: 1400, C: 2000 }

// Producto más vendido
const topProducto = Object.entries(porProducto)
  .reduce((max, [p, m]) => m > max[1] ? [p, m] : max, ['', 0])[0];
// 'A'

// Ventas de febrero ordenadas desc
const febDesc = ventas
  .filter(v => v.mes === 'feb')
  .sort((a, b) => b.monto - a.monto);
```

### 13. chunk

```js
function chunk(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
chunk([1,2,3,4,5], 2);  // [[1,2],[3,4],[5]]
```

### 14. Reimplementar map, filter, reduce

```js
function miMap(arr, fn) {
  const r = [];
  for (let i = 0; i < arr.length; i++) r.push(fn(arr[i], i, arr));
  return r;
}

function miFilter(arr, fn) {
  const r = [];
  for (let i = 0; i < arr.length; i++) if (fn(arr[i], i, arr)) r.push(arr[i]);
  return r;
}

function miReduce(arr, fn, initial) {
  let acc = initial !== undefined ? initial : arr[0];
  let start = initial !== undefined ? 0 : 1;
  for (let i = start; i < arr.length; i++) acc = fn(acc, arr[i], i, arr);
  return acc;
}
```

## Sección D — Objetos

### 15. Indexar por id

```js
const usuarios = [{ id: 1, nombre: 'Ada' }, { id: 2, nombre: 'Lin' }];

const porId = usuarios.reduce((acc, u) => {
  acc[u.id] = u;
  return acc;
}, {});

// Alternativa con Object.fromEntries
const porId2 = Object.fromEntries(usuarios.map(u => [u.id, u]));
```

### 16. mezclar

```js
function mezclar(...objs) {
  return objs.reduce((acc, o) => ({ ...acc, ...o }), {});
}
mezclar({ a: 1 }, { b: 2 }, { a: 99 });  // { a: 99, b: 2 }
```

### 17. get por ruta

```js
function get(obj, ruta, fallback = undefined) {
  return ruta.split('.').reduce((o, k) => o?.[k], obj) ?? fallback;
}
get({ a: { b: { c: 42 } } }, 'a.b.c');       // 42
get({ a: { b: { c: 42 } } }, 'a.x.c');       // undefined
get({ a: { b: { c: 42 } } }, 'a.x.c', '—');  // '—'
```

## Sección E — Closures

### 18. multiplicador

```js
const multiplicador = factor => valor => valor * factor;
const triplicar = multiplicador(3);
triplicar(10);  // 30
```

### 19. memoize + fibonacci

```js
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const fib = memoize(function self(n) {
  if (n < 2) return n;
  return self(n - 1) + self(n - 2);
});
fib(40);  // 102334155 (instantáneo con memo; ~20s sin memo)
```

**Nota**: sin memo, `fib(40)` recalcula el mismo valor millones de veces. Con memo, cada n se calcula 1 vez.

### 20. debounce / throttle

```js
function debounce(fn, ms) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

function throttle(fn, ms) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= ms) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}
```

**Cuándo cuál**:
- `debounce`: "esperá a que termine" — buscar mientras tipea, autosave.
- `throttle`: "máximo 1 vez por segundo" — scroll, resize, drag.

## Sección F — Mini-apps

### 21. Adivina el número

```js
function adivinar() {
  const target = Math.floor(Math.random() * 100) + 1;
  let intentos = 0, guess;
  while (guess !== target) {
    guess = Number(prompt('Adiviná (1-100):'));
    intentos++;
    if (guess < target) alert('Más alto');
    else if (guess > target) alert('Más bajo');
  }
  alert(`¡Acertaste en ${intentos} intentos!`);
}
```

### 22. TODO en memoria

```js
const todos = (() => {
  const items = [];
  return {
    agregar: (texto) => items.push({ id: Date.now(), texto, done: false }),
    completar: (id) => { const t = items.find(x => x.id === id); if (t) t.done = true; },
    borrar: (id) => {
      const i = items.findIndex(x => x.id === id);
      if (i >= 0) items.splice(i, 1);
    },
    listar: () => console.table(items),
  };
})();
```

**Patrón**: IIFE + closure = módulo privado (patrón pre-ES6).

### 23. Rock-Paper-Scissors

```js
function rps() {
  const opts = ['rock', 'paper', 'scissors'];
  let score = { yo: 0, maq: 0 };
  for (let i = 0; i < 5; i++) {
    const yo = prompt(`Ronda ${i+1}: ${opts.join('/')}?`);
    const maq = opts[Math.floor(Math.random() * 3)];
    if (yo === maq) continue;
    // yo gana si: (rock vs scissors) || (paper vs rock) || (scissors vs paper)
    const gano =
      (yo === 'rock' && maq === 'scissors') ||
      (yo === 'paper' && maq === 'rock') ||
      (yo === 'scissors' && maq === 'paper');
    score[gano ? 'yo' : 'maq']++;
  }
  alert(`Final: vos ${score.yo} — máquina ${score.maq}`);
}
```

## Desafío

### 24. Calculadora postfija

```js
function postfix(expr) {
  const stack = [];
  for (const token of expr.split(/\s+/)) {
    if (['+','-','*','/'].includes(token)) {
      const b = stack.pop(), a = stack.pop();
      stack.push({ '+': a+b, '-': a-b, '*': a*b, '/': a/b }[token]);
    } else {
      stack.push(Number(token));
    }
  }
  return stack[0];
}
postfix('3 4 + 2 *');  // 14
postfix('5 1 2 + 4 * + 3 -');  // 14
```

### 25. pipe y compose

```js
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);
const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);

const f = pipe(x => x + 1, x => x * 2, x => x - 3);
f(5);  // ((5+1)*2)-3 = 9
```

Técnica: `reduce` para pipe (aplicar de izquierda a derecha), `reduceRight` para compose (derecha a izquierda, la de matemáticas).

---

**Patrones aprendidos**:
- `reduce` es el destornillador universal (todo se reduce a reduce)
- Closures = privacidad sin clases
- Memoización cambia performance radicalmente
- `JSON.stringify(args)` es una clave de caché simple pero imperfecta (no para funciones, Dates, Symbols)
