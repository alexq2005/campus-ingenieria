# Módulo 11 — Estado Global

> ⏱ ~55 min · Pre-req: M03, M07

📖 **[Leer la lección (lecture.html)](./lecture.html)**

## Qué cubre

Cuándo necesitás estado global y cuál herramienta usar: Zustand, Context, Redux Toolkit, Jotai.

## Decisión jerárquica de estado

1. useState local (1 componente).
2. Lifting state (2-3 hermanos).
3. Composición / children.
4. useContext (subárbol: theme, user, locale).
5. Zustand / Redux (muchas partes, cambia seguido).
6. URL params (estado de navegación).
7. TanStack Query (server state).

## Conceptos clave

- **Context**: built-in, pero re-renderiza todo el subárbol al cambiar value.
- **Zustand** ⭐: ~3KB, sin Provider, selectors granulares. Default 2026 cuando context no alcanza.
  - `create((set) => ({ count: 0, inc: () => set(s => ({count: s.count+1})) }))`.
  - persist middleware para localStorage.
- **Redux Toolkit**: más boilerplate, devtools potentes, equipos grandes.
- **Jotai**: estado atómico, granular.

## Regla de oro

Server state (TanStack Query) y client state (Zustand/useState) son cosas distintas. NUNCA mezclarlos en el mismo store.

**Siguiente:** [M12 — Performance y Testing](../m12-performance-y-testing/)
