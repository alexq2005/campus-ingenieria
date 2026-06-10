# Problem Set 7 — JavaScript moderno

## Sección A — Destructuring y spread

1. Dado `const arr = [1, 2, 3, 4, 5]`, extraé el primero, el último, y todos los del medio en 3 variables con **una sola línea** de destructuring.

2. Dado:
```js
const config = {
  server: { host: 'localhost', port: 3000 },
  db: { name: 'app', user: 'admin' }
};
```
Extraé `host`, `port`, y `user` en variables separadas con una sola línea.

3. Escribí una función `merge(...objs)` que combine N objetos. El último pisa al primero. **Sin `Object.assign`**, usando spread.

4. Implementá `omit(obj, ...claves)` que devuelva una copia del objeto sin las claves indicadas. Ej: `omit({a:1, b:2, c:3}, 'a', 'c') → { b: 2 }`.

5. Implementá `pick(obj, ...claves)` que devuelva solo las claves indicadas.

## Sección B — Clases

6. Modelá `Vehiculo → Auto → AutoElectrico` con herencia. El último debe tener un campo privado `#bateria` (0-100%) y método `cargar(pct)`.

7. Implementá una clase `Pila` (stack, LIFO) con `push`, `pop`, `peek`, `size`, `clear`. Con campos privados.

8. Implementá una clase `Cola` (queue, FIFO) con `enqueue`, `dequeue`, `front`, `size`.

9. Implementá `EventEmitter` (patrón observer): métodos `on(evento, cb)`, `off(evento, cb)`, `emit(evento, ...args)`. Usá `Map<string, Set<fn>>`.

## Sección C — Módulos

10. Separá el TODO app del módulo 6 en archivos:
   - `storage.js` — funciones `load()` y `save(todos)`.
   - `todos.js` — clase `TodoList` con métodos `add`, `remove`, `toggle`, `filter`.
   - `ui.js` — funciones `render(todos)` y bindeo de eventos.
   - `main.js` — entry point que importa los 3.

   Serví con Live Server o `npx serve`.

11. Creá un módulo `utils.js` con funciones de ayuda: `debounce`, `throttle`, `memoize`, `formatDate`. Usalo con `import { ... } from './utils.js'`.

## Sección D — Map, Set, y tipos especiales

12. Dado un array de palabras, contá las ocurrencias de cada una **sin usar un objeto plano** — usá `Map`. Devolvé un `Map<string, number>`.

13. Dado un array con duplicados de objetos (usuarios por `id`), desduplicá conservando el más reciente. Usá `Map` indexado por `id`.

14. Implementá una "caché LRU" (Least Recently Used) de tamaño N: cuando la caché está llena y se inserta uno nuevo, se elimina el menos recientemente usado. Pista: `Map` mantiene el orden de inserción — eso es la mitad del trabajo.

## Sección E — Iteradores y generators

15. Escribí un generator `range(start, end, step = 1)` que funcione con `for...of` y `[...range(1, 10, 2)]`.

16. Escribí un generator `fibonacci()` **infinito**. Usá `take(n, iter)` para tomar los primeros N.

## Sección F — Refactor con ES modernos

17. Tomá este código "viejo" y modernizalo:
```js
var users = [
  { name: 'Ada', age: 30 },
  { name: 'Lin', age: 25 }
];
function getNames(arr) {
  var names = [];
  for (var i = 0; i < arr.length; i++) {
    names.push(arr[i].name);
  }
  return names;
}
function findByName(arr, name) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].name === name) return arr[i];
  }
  return null;
}
```

## Desafío

18. Implementá una **state machine mínima** con clases:
```js
const tsm = new StateMachine({
  initial: 'idle',
  transitions: [
    { from: 'idle',   on: 'start',  to: 'running' },
    { from: 'running', on: 'pause', to: 'paused' },
    { from: 'paused', on: 'resume', to: 'running' },
    { from: 'running', on: 'stop',  to: 'idle' },
  ]
});
tsm.fire('start');  // running
tsm.fire('pause');  // paused
tsm.on('enter:running', () => console.log('corriendo!'));
```

19. **Pipe + compose**: `pipe(f, g, h)(x) = h(g(f(x)))` y `compose(f, g, h)(x) = f(g(h(x)))`. Escribilos como funciones variádicas.

## Entregable

Un repo en GitHub con carpetas `ps7/` + `modulos/`. Readme explicando cómo ejecutarlo (`npx serve`).
