# Módulo 02 — Props y Composición

> ⏱ ~50 min · Pre-req: Módulo 01

📖 **[Leer la lección (lecture.html)](./lecture.html)** · ⚛️ **[Ejemplo: tarjeta-perfil.jsx](./ejemplos/tarjeta-perfil.html)**

## Qué cubre

Las props como contrato entre componentes, children, composición vs herencia, y el problema de props drilling.

## Conceptos clave

- **Props** = argumentos del componente. Se pasan como atributos: `<Hijo nombre="Ana" edad={30} />`.
- **Destructuring**: `function Saludo({ nombre, edad })` — sintaxis moderna.
- Props pueden ser cualquier tipo: string, number, boolean, array, object, función, JSX.
- **children**: prop especial con lo que va entre las tags. Base de componentes contenedor.
- **Composición** > herencia: React no tiene herencia de componentes.
- Props son **read-only**: nunca mutarlas.
- **Props drilling**: prop que atraviesa muchos componentes. Soluciones: composición, useContext (M07), Zustand (M11).
- Defaults: `function Boton({ texto = 'Click' })`.

## Ejemplo ejecutable

[`tarjeta-perfil.jsx`](./ejemplos/tarjeta-perfil.html) — props complejas, children, JSX como prop, callbacks.

**Siguiente:** [M03 — Estado con useState](../m03-estado-usestate/)
