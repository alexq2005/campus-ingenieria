# Módulo 05 — Listas y Keys

> ⏱ ~45 min · Pre-req: Módulo 03

📖 **[Leer la lección (lecture.html)](./lecture.html)** · ⚛️ **[Ejemplo: lista-tareas.jsx](./ejemplos/lista-tareas.html)**

## Qué cubre

Renderizar arrays con `.map()`, el rol de las keys, y conditional rendering.

## Conceptos clave

- `array.map(item => <li key={item.id}>{item.texto}</li>)`.
- **Keys**: identificador único por item. React las usa para reconciliation.
  - Deben ser **únicas entre hermanos** y **estables**.
  - **NUNCA usar el index** si la lista puede reordenarse/agregar/quitar.
  - Generar id al crear: `crypto.randomUUID()`.
- **Conditional rendering**: `{cond && <X/>}`, `{cond ? <X/> : <Y/>}`, early return.
- **Trampa falsy**: `{count && ...}` renderiza "0" si count=0. Usar `{count > 0 && ...}`.
- Encadenar `filter` → `sort` → `map` (sin mutar: `[...arr].sort()`).
- Estados vacío / loading antes de renderizar la lista.
- Fragments con key: usar `<React.Fragment key={...}>` (el shorthand `<>` no acepta key).

## Ejemplo ejecutable

[`lista-tareas.jsx`](./ejemplos/lista-tareas.html) — CRUD con keys, filter/map/spread, conditional rendering.

**Siguiente:** [M06 — useEffect](../m06-useeffect/)
