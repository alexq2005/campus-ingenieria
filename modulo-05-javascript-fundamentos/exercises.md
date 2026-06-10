# Problem Set 5 — JavaScript fundamentos

## Sección A — Predicción

Sin ejecutar el código, decí qué imprime cada uno. Después verificá en la consola.

```js
// 1
console.log(typeof NaN);

// 2
console.log([] + []);
console.log([] + {});
console.log({} + []);

// 3
console.log(0.1 + 0.2 === 0.3);

// 4
let x = 1;
(function() { let x = 2; console.log(x); })();
console.log(x);

// 5
const arr = [1, 2, 3];
const copia = arr;
copia.push(4);
console.log(arr.length);

// 6
console.log(null == undefined);
console.log(null === undefined);

// 7
const nombre = 'Ada' || 'default';
const edad = 0 || 18;
const puntos = 0 ?? 10;
console.log(nombre, edad, puntos);
```

## Sección B — Funciones

8. Escribí una función `promedio(...numeros)` que reciba cualquier cantidad de argumentos y devuelva su promedio.

9. Escribí `factorial(n)` **con recursión** y `factorialIterativo(n)` con loop. Comparalos con `n = 10`, `n = 20`.

10. Escribí `capitalizar(texto)` que convierta `'hola mundo de js'` en `'Hola Mundo De Js'`. Usá `split`, `map`, `join`.

11. Escribí `esPalindromo(texto)` que ignore mayúsculas y espacios. `'Anita lava la tina' → true`.

## Sección C — Arrays

12. Dado:
```js
const ventas = [
  { producto: 'A', mes: 'ene', monto: 1200 },
  { producto: 'B', mes: 'ene', monto: 800 },
  { producto: 'A', mes: 'feb', monto: 1500 },
  { producto: 'B', mes: 'feb', monto: 600 },
  { producto: 'C', mes: 'feb', monto: 2000 },
];
```
Resolvé **con `map`/`filter`/`reduce`** (sin loops `for`):
- Total vendido.
- Total por producto (objeto `{ A: ..., B: ..., C: ... }`).
- Producto más vendido.
- Ventas del mes de febrero, ordenadas de mayor a menor.

13. Implementá `chunk(arr, tamaño)` que parta el array en chunks: `chunk([1,2,3,4,5], 2) → [[1,2],[3,4],[5]]`.

14. Implementá tu propio `map`, `filter` y `reduce` como funciones que reciban un array y un callback. (Para entender cómo funcionan por dentro).

## Sección D — Objetos

15. Dado un array de usuarios con `{ id, nombre, rol }`, construí un objeto indexado por id: `{ 1: {...}, 2: {...} }`.

16. Escribí `mezclar(a, b)` que combine dos objetos. Si hay claves en conflicto, gana el de la derecha. No debe mutar los originales.

17. Dado `{ a: { b: { c: 42 } } }`, escribí una función `get(obj, ruta)` que reciba `'a.b.c'` y devuelva `42`. Si la ruta no existe, devolvé `undefined`.

## Sección E — Closures e higher-order functions

18. Escribí `multiplicador(factor)` que retorne una función que multiplique por ese factor:
```js
const triplicar = multiplicador(3);
triplicar(10); // 30
```

19. Implementá `memoize(fn)`: una función que recibe otra función, y devuelve una versión "memoizada" que cachea resultados para argumentos repetidos. Úsala para acelerar `fibonacci(40)`.

20. Implementá `debounce(fn, ms)` y `throttle(fn, ms)` — patrones clave para performance en UI.

## Sección F — Mini-aplicaciones de consola

21. **Adivina el número**: el programa piensa un número del 1 al 100, el usuario intenta adivinar (via `prompt()`). Al final muestra cuántos intentos usó. Con "pista" de mayor/menor.

22. **TODO en memoria**: un objeto con métodos `agregar`, `completar`, `borrar`, `listar`. Que funcione desde la consola del navegador.

23. **Rock-Paper-Scissors**: función que juega mejor de 5 rondas contra el usuario (random del programa vs prompt del usuario). Lleva cuenta del score.

## Desafío

24. **Calculadora de expresiones con pila** (sin `eval`): dada una expresión postfija como `'3 4 + 2 *'`, calcular el resultado (respuesta: 14). Útil para entender parsing y estructuras de datos.

25. **Implementá `pipe(...fns)`**: función que reciba varias funciones y las combine:
```js
const f = pipe(x => x + 1, x => x * 2, x => x - 3);
f(5); // ((5 + 1) * 2) - 3 = 9
```

## Entregable

Todo en un solo archivo `ps5.js`. Ejecutalo con Node (`node ps5.js`) o pegalo en la consola del navegador. Comentá cada ejercicio con su número.
