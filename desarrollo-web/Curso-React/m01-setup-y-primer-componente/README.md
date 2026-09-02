# Módulo 01 — Setup + Primer Componente

> ⏱ ~50 min · Pre-req: Módulo 00

📖 **[Leer la lección (lecture.html)](./lecture.html)** · ⚛️ **[Ejemplo: hello.jsx](./ejemplos/hello.html)**

## Qué cubre

Crear un proyecto con Vite, entender JSX, escribir tu primer componente, ver el HMR en acción.

## Conceptos clave

- **Vite**: bundler moderno (reemplazó a Create React App). `npm create vite@latest`.
- **JSX**: azúcar sintáctico sobre `React.createElement()`. No es HTML.
- Reglas de JSX: `className` (no `class`), un solo elemento raíz, tags cerrados, `{}` para expresiones, `style` como objeto camelCase.
- **Componente** = función JS que devuelve JSX. Nombre con **Mayúscula inicial**.
- **Fragments** (`<>...</>`) para devolver varios elementos sin wrapper extra.
- **StrictMode**: modo dev que detecta side effects (llama componentes 2 veces).
- React DevTools: extensión obligatoria para inspeccionar el árbol.

## Ejemplo ejecutable

[`hello.jsx`](./ejemplos/hello.html) — primer componente con props, expresiones y reuso.

**Siguiente:** [M02 — Props y Composición](../m02-props-y-composicion/)
