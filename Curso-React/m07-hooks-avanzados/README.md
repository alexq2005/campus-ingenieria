# Módulo 07 — Hooks Avanzados

> ⏱ ~70 min · Pre-req: M03, M06

📖 **[Leer la lección (lecture.html)](./lecture.html)**

## Qué cubre

useContext, useRef, useReducer, useMemo, useCallback, useId, use(), y los hooks concurrentes.

## Conceptos clave

- **useContext**: compartir datos sin props drilling. Para subárboles (theme, user, locale).
- **useRef**: valor mutable que persiste sin causar re-render. Uso principal: acceder al DOM y guardar timers.
- **useReducer**: estado complejo con lógica encapsulada en función pura. Mejor que muchos useState dispersos.
- **useMemo**: cachear un cálculo caro entre renders.
- **useCallback**: cachear una función (útil con React.memo o deps de otro hook).
- **useId**: IDs estables para accesibilidad (label/input), compatible con SSR.
- **use()** (React 19): leer Promises (con Suspense) y contexts condicionalmente.
- **useTransition / useDeferredValue**: mantener la UI responsive en updates costosos.

## Las 2 reglas de los hooks

1. Solo en el top-level (nunca en if/for/callbacks).
2. Solo desde componentes React o custom hooks.

## Advertencia

useMemo/useCallback/memo tienen costo. Usalos solo cuando MEDISTE un problema — no "por las dudas".

**Siguiente:** [M08 — Custom Hooks](../m08-custom-hooks/)
