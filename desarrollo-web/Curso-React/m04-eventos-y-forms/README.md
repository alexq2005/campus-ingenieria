# Módulo 04 — Eventos y Forms

> ⏱ ~55 min · Pre-req: Módulo 03

📖 **[Leer la lección (lecture.html)](./lecture.html)** · ⚛️ **[Ejemplo: form-login.jsx](./ejemplos/form-login.html)**

## Qué cubre

Synthetic events, inputs controlados, validación, y useActionState de React 19.

## Conceptos clave

- Eventos en camelCase: `onClick`, `onChange`, `onSubmit`. Pasás la función, no la llamás.
- `onClick={fn}` ✅ vs `onClick={fn()}` ❌ (ejecuta al render).
- Pasar argumentos: `onClick={() => eliminar(id)}`.
- `e.preventDefault()` en form submit (evita reload). `e.stopPropagation()` para no propagar.
- **Input controlado**: `value={estado}` + `onChange={e => setEstado(e.target.value)}`.
- Checkbox usa `checked` y `e.target.checked` (no value).
- **Uncontrolled** con `useRef` + `defaultValue`: para forms grandes o file inputs.
- Form con un objeto: `setForm(prev => ({ ...prev, [name]: value }))`.
- Validación derivada (no en estado): mostrar errores solo tras input del user.
- **React Hook Form**: estándar para forms grandes (uncontrolled, re-renders mínimos).
- **useActionState** (React 19): forms con async actions.

## Ejemplo ejecutable

[`form-login.jsx`](./ejemplos/form-login.html) — controlado, validación en vivo, submit async.

**Siguiente:** [M05 — Listas y Keys](../m05-listas-y-keys/)
