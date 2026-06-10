# Módulo 06 — useEffect y Efectos Secundarios

> ⏱ ~65 min · Pre-req: Módulo 03

📖 **[Leer la lección (lecture.html)](./lecture.html)** · ⚛️ **[Ejemplo: clock.jsx](./ejemplos/clock.html)** · 🎮 **[Demo: useEffect Visualizer](../demos/useeffect-visualizer.html)**

## Qué cubre

useEffect para sincronizar con sistemas externos — y, crucialmente, cuándo NO usarlo.

## Conceptos clave

- Un **side effect** ocurre fuera del render puro: fetch, listeners, timers, DOM, storage.
- **Regla #1**: a veces NO lo necesitás. Antes preguntate si podés derivar/calcular en el render o ponerlo en un handler.
- Anatomía: `useEffect(fn, deps)` + cleanup vía `return () => {...}`.
- Array de deps:
  - `useEffect(fn)` — cada render (raro).
  - `useEffect(fn, [])` — solo al montar.
  - `useEffect(fn, [a, b])` — al montar + cuando a o b cambian.
- **Cleanup**: corre antes del próximo effect y al desmontar. Obligatorio para listeners/timers/subscriptions.
- Dependencias completas: ESLint `exhaustive-deps` te avisa.
- Race conditions en fetch: patrón `let cancelled = false`.
- StrictMode corre effects 2× en dev (detecta falta de cleanup).
- Anti-patrón: usar effect para reaccionar a eventos de usuario (eso va en handlers).
- En producción, para data fetching real → TanStack Query (M10).

## Práctica

- Ejemplo: [`clock.jsx`](./ejemplos/clock.html) — timer, listeners, doc.title, todos con cleanup.
- Demo interactivo: [useEffect Visualizer](../demos/useeffect-visualizer.html) — ver cuándo corre effect/cleanup según deps.

**Siguiente:** [M07 — Hooks Avanzados](../m07-hooks-avanzados/)
