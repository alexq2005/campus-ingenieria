# Módulo 03 — Estado con useState

> ⏱ ~60 min · Pre-req: Módulo 02

📖 **[Leer la lección (lecture.html)](./lecture.html)** · ⚛️ **[Ejemplo: contador.jsx](./ejemplos/contador.html)** · 🎮 **[Demo: useState Playground](../demos/usestate-playground.html)**

## Qué cubre

useState, el ciclo estado→render→evento→setState→re-render, e immutability.

## Conceptos clave

- `useState(inicial)` devuelve `[valor, setter]`.
- El setter dispara re-render; mutar la variable directamente NO.
- **3 reglas de oro**:
  1. Nunca mutar el estado directamente — usar el setter.
  2. Para estado que depende del anterior: forma updater `setX(prev => prev + 1)`.
  3. El estado es asíncrono: después de `setX(5)`, `x` sigue valiendo lo viejo en este render.
- **Objetos/arrays**: crear nuevos, no mutar (`{...obj}`, `[...arr]`, `map`, `filter`).
- **Lazy init**: `useState(() => calculoCaro())` corre solo al montar.
- **Estado derivado**: si podés calcularlo de otro estado, NO lo guardes.
- **Lifting state up**: estado al ancestro común de quienes lo necesitan.
- **Batching** (React 18+): varios setState en un handler = un solo re-render.

## Práctica

- Ejemplo: [`contador.jsx`](./ejemplos/contador.html) — updater fn, array, derivados.
- Demo interactivo: [useState Playground](../demos/usestate-playground.html) — batching y mutación en vivo.

**Siguiente:** [M04 — Eventos y Forms](../m04-eventos-y-forms/)
