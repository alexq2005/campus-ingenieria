# Módulo 14 — NumPy: Cómputo Numérico

La base para Ciencia de Datos e IA. Arrays, vectorización, broadcasting,
producto matricial (`@`), ufuncs y máscaras booleanas.

Alimenta los proyectos **P16** (Clasificador CNN), **P18** (Análisis de Datos)
y **P30** (Red Neuronal desde Cero).

- 📖 Lectura: [lecture.html](lecture.html)
- 🎯 Pre-requisitos: Módulos 03 (estructuras de datos), 05 (funciones), 06 (POO)
- 🔗 Aplicación: `../../proyectos/30-red-neuronal.html`

## Temas
- Por qué NumPy (vectorización vs bucles de Python)
- Crear arrays · `dtype`
- Números al azar reproducibles (`default_rng`)
- `shape`, `reshape`, el truco del `-1`
- Operaciones vectorizadas y **broadcasting**
- Producto matricial: `@` vs `*` (la distinción clave en IA)
- Funciones universales (`exp`, `tanh`, `log`, `maximum`)
- Reducciones con `axis` (`sum`, `mean`, `argmax`)
- Indexado y máscaras booleanas
- **Una capa neuronal en una línea**: `np.tanh(X @ W1 + b1)`
