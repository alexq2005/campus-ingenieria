# Módulo 08 — Custom Hooks

> ⏱ ~50 min · Pre-req: M03, M06, M07

📖 **[Leer la lección (lecture.html)](./lecture.html)** · ⚛️ **[Ejemplo: use-local-storage.jsx](./ejemplos/use-local-storage.html)**

## Qué cubre

Extraer lógica reutilizable en funciones propias — lo que separa al junior del mid-level.

## Conceptos clave

- Un custom hook es **una función con prefijo `use`** que usa otros hooks adentro.
- Encapsula lógica reutilizable entre componentes (NO comparte estado — cada uso es independiente).
- El prefijo `use` es obligatorio para que ESLint aplique las reglas de hooks.
- Patrones de retorno: array `[valor, setter]` (como useState) u objeto `{ data, loading, error }`.

## Custom hooks populares

- `useLocalStorage(key, default)` — persistir estado.
- `useDebounce(value, delay)` — diferir un valor.
- `useToggle(initial)` — boolean + toggle.
- `useFetch(url)` — `{ data, loading, error }`.
- `usePrevious(value)` — recordar valor anterior.
- `useWindowSize()`, `useOnlineStatus()`, `useCopyToClipboard()`.

## Cuándo NO crear uno

Lógica trivial (2-3 líneas), un solo uso, nombre difícil de encontrar. Esperá 2-3 usos reales.

## Ejemplo ejecutable

[`use-local-storage.jsx`](./ejemplos/use-local-storage.html) — un hook reusado en 3 componentes.

## Recursos

- [usehooks.com](https://usehooks.com) · [react-use](https://github.com/streamich/react-use)

**Siguiente:** [M09 — React Router 7](../m09-react-router/)
