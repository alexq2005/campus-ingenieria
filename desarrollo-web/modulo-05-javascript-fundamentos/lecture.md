# Módulo 5 — JavaScript: Fundamentos del lenguaje

> *"JavaScript is the world's most misunderstood programming language."* — Douglas Crockford

---

## 🎥 Multimedia

**Videos recomendados** — tour del lenguaje, closures, array methods:
[📺 Playlist del módulo 05 →](../multimedia/videos.html#m5)

> 💡 Cuando llegues a [closures](#513-scope-y-hoisting), volvé al video "Closures in 100 Seconds" — es el mejor resumen de este concepto en internet.

---

## 5.1 Historia y contexto

- **Mayo 1995**: Brendan Eich es contratado por Netscape. En **10 días** crea *Mocha*, después renombrado a *LiveScript*, después a **JavaScript** (puro marketing — Java estaba de moda).
- **1997**: se estandariza bajo el nombre **ECMAScript** (ECMA-262).
- **2008**: Google lanza el motor V8 (la VM que corre en Chrome y Node.js).
- **2009**: se crea Node.js — JavaScript sale del navegador.
- **2015**: ES6 / ES2015 — la revisión más grande de la historia (`let`, `const`, clases, módulos, arrow functions, destructuring, promises).
- **Desde 2015**: se publica una versión nueva **cada año** (ES2016, ES2017, ..., ES2025).

## 5.2 Dónde corre JavaScript

1. **Navegador**: el target original. DOM + Web APIs.
2. **Node.js** / Bun / Deno: runtime de servidor.
3. **Mobile**: React Native, Ionic.
4. **Desktop**: Electron, Tauri.
5. **Embedded**: controla Tesla, drones, microcontroladores (Espruino).

Aprender JS te abre todas las plataformas.

## 5.3 Cómo agregar JS a una página

```html
<!-- Externo (preferido) -->
<script src="app.js"></script>

<!-- Externo con defer (ejecuta después de parsear HTML, en orden) -->
<script src="app.js" defer></script>

<!-- Externo async (ejecuta en cuanto se descarga, puede bloquear parseo) -->
<script src="analytics.js" async></script>

<!-- Módulo ES (tiene defer implícito) -->
<script type="module" src="app.js"></script>

<!-- Inline (para ejemplos simples) -->
<script>
  console.log('Hola, mundo');
</script>
```

**Best practice**: `type="module"` o `defer`, y ponelo en el `<head>`. Evitá poner `<script>` al final del `<body>` (patrón viejo).

## 5.4 Variables: `let`, `const`, `var`

```js
const PI = 3.14159;     // no se puede reasignar
let contador = 0;       // se puede reasignar
contador = contador + 1;

var obsoleto = 'no uses';  // olvidate de var
```

**Regla 2026**:
- Usá `const` por default.
- Usá `let` solo si sabés que vas a reasignar.
- **Nunca uses `var`** — tiene *hoisting* raro y scoping por función (no por bloque).

## 5.5 Tipos de datos

### 7 primitivos

```js
const texto = 'hola';        // string
const numero = 42;            // number (no hay int vs float)
const grande = 9007199254740993n;  // bigint
const bool = true;            // boolean
const nada = null;            // null — valor intencional de "nada"
let noDefinido;               // undefined — valor default
const simbolo = Symbol('id'); // symbol — identificador único
```

### 1 no primitivo: `object`

```js
const obj = { nombre: 'Ada', edad: 30 };
const arr = [1, 2, 3];
const fn = function() {};
const fecha = new Date();
```

### Verificar el tipo

```js
typeof 'hola';        // 'string'
typeof 42;            // 'number'
typeof true;          // 'boolean'
typeof undefined;     // 'undefined'
typeof null;          // 'object'  ← bug histórico, nunca se arregló
typeof { a: 1 };      // 'object'
typeof [1, 2];        // 'object'
typeof function(){};  // 'function'

// Para arrays:
Array.isArray([1, 2]); // true
```

## 5.6 Operadores

### Aritméticos
`+`, `-`, `*`, `/`, `%` (módulo), `**` (potencia).

### Comparación
`===` (estricto, NO coerciona), `!==`, `<`, `>`, `<=`, `>=`.

**Nunca** uses `==` o `!=` — coercionan tipos y generan bugs:

```js
'0' == false;    // true  ← WTF
'' == 0;         // true  ← WTF
null == undefined; // true  ← usable, pero usá === salvo caso específico

'0' === false;   // false ← predecible
```

### Lógicos
`&&` (AND), `||` (OR), `!` (NOT), `??` (nullish coalescing).

```js
const nombre = input || 'Anónimo';       // si input es falsy → 'Anónimo'
const puntos = valor ?? 0;                // SOLO si valor es null/undefined → 0
const completo = usuario?.direccion?.calle; // optional chaining
```

**Valores falsy**: `false`, `0`, `''`, `null`, `undefined`, `NaN`. Todo lo demás es truthy.

### Asignación compuesta
`+=`, `-=`, `*=`, `/=`, `%=`, `**=`, `&&=`, `||=`, `??=`.

## 5.7 Strings

```js
const saludo = 'hola';
const nombre = "mundo";
const combo = `${saludo}, ${nombre}!`;   // template literal (backticks)
const multi = `línea 1
línea 2`;

// Propiedades y métodos
saludo.length;               // 4
saludo.toUpperCase();        // 'HOLA'
saludo.includes('ol');       // true
saludo.slice(0, 2);          // 'ho'
saludo.replace('h', 'p');    // 'pola'
saludo.split('');            // ['h','o','l','a']
' hola '.trim();             // 'hola'
saludo.padStart(10, '-');    // '------hola'
```

Strings son **inmutables**: todos los métodos devuelven un nuevo string.

## 5.8 Números

```js
42 + 0.1 + 0.2;     // 42.30000000000001 ← floats IEEE 754, cuidado
Number.isInteger(5); // true
Number.isNaN(NaN);   // true
Number.parseFloat('3.14px'); // 3.14
(3.14159).toFixed(2); // '3.14' (string!)

Math.floor(4.7);     // 4
Math.ceil(4.2);      // 5
Math.round(4.5);     // 5
Math.random();       // [0, 1)
Math.max(1, 5, 3);   // 5
Math.abs(-7);        // 7
Math.sqrt(16);       // 4
```

Para operaciones financieras exactas → **no** uses `number`; usá `bigint` o librerías como `decimal.js`.

## 5.9 Control de flujo

### `if / else if / else`

```js
if (edad >= 18) {
  console.log('adulto');
} else if (edad >= 13) {
  console.log('adolescente');
} else {
  console.log('niño');
}
```

### Operador ternario

```js
const mensaje = edad >= 18 ? 'adulto' : 'menor';
```

### `switch`

```js
switch (rol) {
  case 'admin':
    permitirTodo();
    break;
  case 'editor':
  case 'autor':    // fall-through intencional
    permitirEdicion();
    break;
  default:
    permitirLectura();
}
```

Modernamente se prefiere un **object lookup**:

```js
const acciones = {
  admin: permitirTodo,
  editor: permitirEdicion,
  autor: permitirEdicion,
};
(acciones[rol] ?? permitirLectura)();
```

### Loops

```js
// for clásico
for (let i = 0; i < 10; i++) { /* ... */ }

// for...of — ITERA VALORES (lo que vas a usar 90% del tiempo)
for (const item of [10, 20, 30]) {
  console.log(item);
}

// for...in — itera CLAVES de objetos (raramente — preferí Object.keys)
for (const key in { a: 1, b: 2 }) {
  console.log(key);
}

// while
let i = 0;
while (i < 5) { i++; }

// do...while (ejecuta al menos una vez)
do { ... } while (condicion);
```

## 5.10 Funciones

### Declaración (hoisted)

```js
function sumar(a, b) {
  return a + b;
}
```

### Expresión (no hoisted)

```js
const sumar = function(a, b) {
  return a + b;
};
```

### Arrow function (ES6)

```js
const sumar = (a, b) => a + b;
const doble = x => x * 2;
const saludo = () => 'hola';
const cuadrado = x => { return x * x; }; // con cuerpo explícito
```

Arrow functions:
- No tienen su propio `this` (heredan del scope exterior).
- No se pueden usar como constructores (`new`).
- No tienen `arguments`.

### Parámetros por default, rest, spread

```js
function saludar(nombre = 'amigo', ...resto) {
  console.log(`Hola ${nombre}`, resto);
}
saludar();                          // 'Hola amigo', []
saludar('Ada', 'hi', 'there');      // 'Hola Ada', ['hi', 'there']

// Spread al llamar
const nums = [1, 5, 3];
Math.max(...nums);                  // 5
```

### Funciones son valores de primera clase

```js
const operaciones = [x => x + 1, x => x * 2, x => x ** 2];
operaciones.forEach(fn => console.log(fn(5))); // 6, 10, 25
```

## 5.11 Arrays

```js
const frutas = ['manzana', 'banana', 'kiwi'];

frutas.length;              // 3
frutas[0];                  // 'manzana'
frutas[frutas.length - 1];  // 'kiwi'
frutas.at(-1);              // 'kiwi' (moderno, negativo OK)

// Mutantes (modifican el original)
frutas.push('uva');         // agrega al final → 4
frutas.pop();               // quita del final
frutas.unshift('pera');     // agrega al inicio
frutas.shift();             // quita del inicio
frutas.sort();
frutas.reverse();
frutas.splice(1, 1, 'nueva'); // quita 1 a partir del índice 1, inserta 'nueva'

// No mutantes (devuelven copia)
frutas.slice(0, 2);         // nuevo array con elementos 0..1
frutas.concat(['melón']);
[...frutas, 'uva'];         // spread es la forma moderna
frutas.includes('kiwi');
frutas.indexOf('banana');
frutas.join(', ');
```

### Los métodos de oro: `map`, `filter`, `reduce`

```js
const numeros = [1, 2, 3, 4, 5];

// map → transforma cada elemento
const dobles = numeros.map(n => n * 2);         // [2, 4, 6, 8, 10]

// filter → mantiene solo los que cumplen la condición
const pares = numeros.filter(n => n % 2 === 0); // [2, 4]

// reduce → colapsa el array a un solo valor
const suma = numeros.reduce((acc, n) => acc + n, 0); // 15

// Combinar
const sumaDePares = numeros
  .filter(n => n % 2 === 0)
  .map(n => n * n)
  .reduce((a, b) => a + b, 0); // 4 + 16 = 20
```

### Otros esenciales

```js
numeros.find(n => n > 3);       // 4 (primero que cumple)
numeros.findIndex(n => n > 3);  // 3
numeros.some(n => n > 4);       // true (al menos uno)
numeros.every(n => n > 0);      // true (todos)
numeros.flat();                 // aplana 1 nivel
numeros.flatMap(n => [n, n*2]); // map + flat
```

## 5.12 Objetos

```js
const persona = {
  nombre: 'Ada',
  edad: 30,
  saludar() {
    return `Hola, soy ${this.nombre}`;
  }
};

// Acceso
persona.nombre;         // 'Ada'
persona['nombre'];      // 'Ada'
persona.saludar();      // 'Hola, soy Ada'

// Modificar / agregar / eliminar
persona.edad = 31;
persona.email = 'ada@ejemplo.com';
delete persona.edad;

// Iterar
Object.keys(persona);    // ['nombre', 'saludar', 'email']
Object.values(persona);  // ['Ada', fn, 'ada@...']
Object.entries(persona); // [['nombre', 'Ada'], ...]

for (const [k, v] of Object.entries(persona)) {
  console.log(k, v);
}

// Copiar / mergear
const copia = { ...persona };
const actualizada = { ...persona, edad: 31, rol: 'admin' };

// Destructuring
const { nombre, edad = 0 } = persona;
const { nombre: nom } = persona;  // renombrado

// Shorthand
const x = 1, y = 2;
const punto = { x, y };           // { x: 1, y: 2 }

// Keys dinámicas
const campo = 'edad';
const obj = { [campo]: 42 };      // { edad: 42 }
```

### Objetos por referencia

```js
const a = { x: 1 };
const b = a;
b.x = 99;
console.log(a.x); // 99 — a y b apuntan al MISMO objeto

// Copia superficial
const copia = { ...a };

// Copia profunda
const profunda = structuredClone(a);
```

## 5.13 Scope y hoisting

```js
const global = 'puedo verme en todo el archivo';

function miFuncion() {
  const local = 'solo me veo dentro';
  if (true) {
    const deBloque = 'solo me veo en este if';  // let y const son de bloque
  }
  // deBloque no existe acá
}
```

### Closures: la superpotencia

```js
function contador() {
  let n = 0;
  return function() {
    n++;
    return n;
  };
}

const c = contador();
c(); // 1
c(); // 2
c(); // 3
```

La función interna **recuerda** el `n` del contexto donde fue creada. Eso es un closure — base del patrón módulo, hooks de React, memoización, etc.

## 5.14 Errores y debugging

```js
try {
  JSON.parse(cualquierCosa);
} catch (error) {
  console.error('Error:', error.message);
} finally {
  // siempre se ejecuta
}

// Throw
if (!email.includes('@')) {
  throw new Error('Email inválido');
}

// Tipos de Error integrados
throw new TypeError('...');
throw new RangeError('...');
```

### Console — tu mejor amigo

```js
console.log('normal');
console.warn('advertencia');
console.error('error');
console.info('info');
console.table([{a:1, b:2}, {a:3, b:4}]);
console.group('grupo'); console.log('dentro'); console.groupEnd();
console.time('fetch'); /* ... */ console.timeEnd('fetch');
console.trace();
```

## 5.15 Strict mode (siempre activo en módulos ES)

```js
'use strict';  // al inicio del archivo o función
```

Hace que errores silenciosos exploten ruidosamente (bueno). En `type="module"` está activado por default.

---

## 🧑‍🎓 Worked Example

> **Ejercicio**: "Dado un array de transacciones bancarias, calculá el balance final."
>
> ```js
> const tx = [
>   { tipo: 'deposito',  monto: 5000 },
>   { tipo: 'retiro',    monto: 1500 },
>   { tipo: 'transferencia', monto: 2000 },
>   { tipo: 'deposito',  monto: 3000 },
> ];
> ```

**Mi proceso:**

1. *¿Loop o funcional?* Para "colapsar un array a un valor", la herramienta es **`reduce`**.
2. *¿Qué hago con cada tipo?* Depósito suma, los otros restan.
3. *¿Objeto lookup o switch?* Para solo 2 ramas (depósito vs "resto"), un ternario es claro. Para más tipos, un objeto-lookup.

**Primera versión (limpia y leíble)**:

```js
const balance = tx.reduce((acc, t) => {
  return t.tipo === 'deposito' ? acc + t.monto : acc - t.monto;
}, 0);
console.log(balance);  // 5000 - 1500 - 2000 + 3000 = 4500
```

**Versión refinada si agregáramos más tipos**:

```js
const signo = { deposito: 1, retiro: -1, transferencia: -1, comision: -1 };
const balance = tx.reduce((acc, t) => acc + signo[t.tipo] * t.monto, 0);
```

**Refinamiento final con early validation**:

```js
function calcularBalance(tx, inicial = 0) {
  const signo = { deposito: 1, retiro: -1, transferencia: -1, comision: -1 };
  return tx.reduce((acc, t) => {
    if (!(t.tipo in signo)) throw new Error(`Tipo desconocido: ${t.tipo}`);
    if (typeof t.monto !== 'number' || t.monto < 0) throw new Error(`Monto inválido`);
    return acc + signo[t.tipo] * t.monto;
  }, inicial);
}
```

**Lección clave**: buen código evoluciona. Empezás con el algoritmo correcto, después agregás defensas. **No** empezás validando — validás cuando sabés que el código funciona.

## 🧠 Checkpoint Quiz

<details>
<summary><strong>1. ¿Por qué <code>0.1 + 0.2 !== 0.3</code>?</strong></summary>

IEEE 754 (punto flotante binario). Los números decimales como 0.1 no tienen representación exacta en binario (como 1/3 no la tiene en decimal: 0.333...). La suma acumula errores.

Resultado real: `0.30000000000000004`.

Soluciones:
- Comparar con tolerancia: `Math.abs((0.1 + 0.2) - 0.3) < Number.EPSILON`.
- Para dinero: usar centavos (enteros) o librerías como `decimal.js`.
</details>

<details>
<summary><strong>2. ¿Qué devuelve <code>[1, 2, 3].map(parseInt)</code>?</strong></summary>

`[1, NaN, NaN]`. Sorpresa clásica.

`map` pasa 3 args al callback: `(item, index, array)`. `parseInt` acepta `(string, radix)`. Entonces:
- `parseInt(1, 0)` → 1 (radix 0 = default 10)
- `parseInt(2, 1)` → NaN (radix 1 no existe)
- `parseInt(3, 2)` → NaN (3 no es válido en base 2)

Solución: `arr.map(x => parseInt(x, 10))` o `arr.map(Number)`.
</details>

<details>
<summary><strong>3. ¿Qué es un closure?</strong></summary>

Una función que "recuerda" las variables del scope donde fue creada, aún después de que ese scope haya terminado.

```js
function contador() {
  let n = 0;          // el scope de contador()
  return () => ++n;   // la función interna captura `n`
}
const c = contador();
c(); // 1 — `n` sigue vivo porque `c` lo captura
c(); // 2
```

Uso real: `useState` de React, debounce/throttle, módulos privados.
</details>

<details>
<summary><strong>4. ¿Cuándo usar <code>||</code> vs <code>??</code>?</strong></summary>

- `a || b` → `b` si `a` es **falsy** (`0`, `''`, `false`, `null`, `undefined`, `NaN`).
- `a ?? b` → `b` **solo** si `a` es `null` o `undefined`.

```js
const port = config.port || 3000;   // ❌ si config.port = 0 → 3000 (mal!)
const port = config.port ?? 3000;   // ✅ 0 es un valor válido
```

Regla: `??` para valores default; `||` cuando cualquier falsy debe ser reemplazado.
</details>

<details>
<summary><strong>5. ¿Mutá o no mutá este código?</strong></summary>

```js
const arr = [1, 2, 3];
arr.push(4);
```

**Sí muta** — `push` modifica el array original. `arr.length` ahora es 4.

**No mutan**: `map`, `filter`, `reduce`, `slice`, `concat`, `flat`, `flatMap`.
**Sí mutan**: `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`.

ES2023 agregó versiones **no mutantes**: `toSorted()`, `toReversed()`, `toSpliced()`, `with()`. Preferilas en React (los setters necesitan referencias nuevas).
</details>

---

## Resumen ejecutivo

- `const` > `let` > nunca `var`.
- `===` siempre, `==` nunca.
- Dominá `map`, `filter`, `reduce` — son el 80% del JS moderno.
- Entendé closures: son la base de React hooks y del patrón módulo.
- Objetos se pasan por referencia.
- DevTools Console es tu laboratorio.

## Ejemplos

Ver [`examples/`](./examples/):
- `01-playground.html` — abrí la consola y ejecutá cada línea.
- `02-array-methods.html` — problemas resueltos con map/filter/reduce.
- `03-closures-contador.html` — closures en acción.

## Ejercicios

Ver [`exercises.md`](./exercises.md).

---

**Siguiente módulo:** [`06 — DOM y eventos`](../modulo-06-dom-eventos/)
