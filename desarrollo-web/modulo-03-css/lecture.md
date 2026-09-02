# Módulo 3 — CSS: Cascada, especificidad y box model

> *"CSS isn't magic. It's a precise language you don't understand yet."*

---

## 🎥 Multimedia de este módulo

**Laboratorio 1 — Cascada y especificidad** (calculadora + guerra de reglas):

<iframe
  src="../multimedia/css-cascade-game.html"
  width="100%" height="900"
  style="border: 1px solid #334155; border-radius: 10px;"
  loading="lazy"
  title="CSS Cascade & Specificity — calculadora interactiva"></iframe>

**Laboratorio 2 — Box Model Playground** (sliders para ver la matemática en vivo):

<iframe
  src="../multimedia/box-model-playground.html"
  width="100%" height="720"
  style="border: 1px solid #334155; border-radius: 10px; margin-top: 1rem;"
  loading="lazy"
  title="Box Model Playground — sliders interactivos"></iframe>

> Si los iframes no renderizan: [cascade game](../multimedia/css-cascade-game.html) · [box model](../multimedia/box-model-playground.html).

**Videos recomendados:** [📺 Playlist del módulo 03 →](../multimedia/videos.html#m3)

---

## 3.1 ¿Qué es CSS?

**CSS** (Cascading Style Sheets) es el lenguaje que describe **cómo se ven** los elementos HTML. Cada regla CSS tiene esta forma:

```
selector {
  propiedad: valor;
  propiedad: valor;
}
```

Ejemplo:

```css
h1 {
  color: royalblue;
  font-size: 2rem;
  margin-bottom: 1rem;
}
```

## 3.2 Las 3 maneras de aplicar CSS

```html
<!-- 1. Externa (la recomendada) -->
<link rel="stylesheet" href="styles.css">

<!-- 2. Interna (en el <head>) -->
<style>
  h1 { color: red; }
</style>

<!-- 3. Inline (evitá) -->
<h1 style="color: red;">Título</h1>
```

**Regla**: siempre usá hojas externas. Separá estructura (HTML) de presentación (CSS).

## 3.3 Selectores

| Selector | Ejemplo | Qué selecciona |
|----------|---------|----------------|
| Universal | `*` | Todos los elementos |
| De tipo | `p` | Todos los `<p>` |
| De clase | `.btn` | Elementos con `class="btn"` |
| De id | `#nav` | El elemento con `id="nav"` |
| De atributo | `[type="email"]` | Inputs tipo email |
| Descendiente | `article p` | `<p>` dentro de `<article>` |
| Hijo directo | `ul > li` | `<li>` hijo directo de `<ul>` |
| Hermano adyacente | `h1 + p` | `<p>` inmediatamente después de `<h1>` |
| Hermano general | `h1 ~ p` | Cualquier `<p>` después de `<h1>` |
| Pseudo-clase | `a:hover` | `<a>` cuando el mouse está encima |
| Pseudo-elemento | `p::first-line` | Primera línea de un párrafo |

### Pseudo-clases útiles

```css
a:hover { }           /* al pasar el mouse */
a:focus { }           /* al tener el foco (teclado) */
a:focus-visible { }   /* foco solo cuando es navegación por teclado */
a:active { }          /* mientras se cliquea */
a:visited { }         /* enlace ya visitado */

input:focus { }
input:disabled { }
input:checked { }
input:valid { }
input:invalid { }
input:placeholder-shown { }

li:first-child { }
li:last-child { }
li:nth-child(2n) { }      /* pares */
li:nth-child(odd) { }     /* impares */
li:nth-child(3n+1) { }    /* 1, 4, 7, 10... */

:not(.activo) { }         /* que NO tenga la clase .activo */
:is(h1, h2, h3) { }       /* cualquiera de estos */
:where(h1, h2, h3) { }    /* igual que :is pero especificidad = 0 */
:has(> img) { }           /* elementos que contengan un <img> hijo (CSS moderno) */
```

### Pseudo-elementos

```css
p::first-letter { font-size: 2em; }
p::first-line { font-weight: bold; }
p::before { content: "→ "; }
p::after { content: " ←"; }
p::selection { background: yellow; }   /* texto seleccionado */
```

## 3.4 La cascada: el algoritmo que decide qué regla gana

Cuando varias reglas aplican al mismo elemento, CSS resuelve el conflicto con este orden:

```
1. Origen y prioridad:
   - user agent (navegador) < user < autor (vos) < autor !important < user !important
2. Especificidad (inline > id > class > tipo)
3. Orden de aparición (la última gana)
```

### Especificidad (memorizá este sistema)

Cada selector suma puntos en 4 categorías:

| Categoría | Ejemplo | Puntos |
|-----------|---------|--------|
| Inline | `style="..."` | 1,0,0,0 |
| IDs | `#nav` | 0,1,0,0 |
| Clases, atributos, pseudo-clases | `.btn`, `[type]`, `:hover` | 0,0,1,0 |
| Tipos, pseudo-elementos | `p`, `::before` | 0,0,0,1 |

```css
p              { color: red; }      /* 0,0,0,1 */
.intro         { color: blue; }     /* 0,0,1,0 */
#main .intro   { color: green; }    /* 0,1,1,0 */
#main p.intro  { color: purple; }   /* 0,1,1,1 ← gana */
```

**Regla práctica**:
- No uses `!important` — rompe la cascada, genera guerras de especificidad.
- No uses `#id` en CSS; reservalos para JS y anclas. Preferí clases.
- Mantené especificidad **baja y plana** (idealmente 0,0,1,0).

## 3.5 Herencia

Algunas propiedades se **heredan** de padre a hijos: `color`, `font-family`, `font-size`, `line-height`, `text-align`, `visibility`. Otras **no**: `margin`, `padding`, `border`, `width`, `background`.

```css
body { color: #333; }  /* todos los descendientes heredan */
```

Podés forzar herencia: `color: inherit;`. O forzar el valor inicial: `color: initial;`, o desarmar cascada: `all: unset;`.

## 3.6 El box model

Cada elemento HTML es una caja con 4 áreas concéntricas:

```
┌──────────────────────────────────┐
│           margin                 │
│  ┌────────────────────────────┐  │
│  │         border             │  │
│  │  ┌──────────────────────┐  │  │
│  │  │      padding         │  │  │
│  │  │  ┌────────────────┐  │  │  │
│  │  │  │    content     │  │  │  │
│  │  │  └────────────────┘  │  │  │
│  │  └──────────────────────┘  │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

Por default (`box-sizing: content-box`): `width` es solo el **content**. Padding y border se suman → una caja con `width: 200px; padding: 20px; border: 2px` mide **244px** en total.

Con `box-sizing: border-box`: `width` incluye padding y border. Esa misma caja mide exactamente **200px**.

### El reset universal que todo pro usa

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

Desde ahora, esto va en todos tus proyectos.

## 3.7 Unidades

### Absolutas
- `px` — píxeles CSS. Lo más usado pero rígido.

### Relativas al tamaño de fuente
- `em` — relativo al `font-size` del **padre**.
- `rem` — relativo al `font-size` del `<html>` (root). **Preferida** para consistencia.

### Relativas al viewport
- `vw` — 1% del ancho del viewport.
- `vh` — 1% del alto del viewport.
- `vmin`, `vmax` — mínimo/máximo entre `vw` y `vh`.
- `dvh`, `svh`, `lvh` — variantes dinámicas para móviles (barras que aparecen/desaparecen).

### Porcentuales
- `%` — relativo al padre (en la misma propiedad).

### Funciones modernas

```css
/* clamp(min, preferido, max) */
font-size: clamp(1rem, 2vw + 0.5rem, 2rem);

/* min() y max() */
width: min(90%, 600px);
padding: max(1rem, 5vw);
```

## 3.8 Colores

```css
color: red;                           /* nombre */
color: #ff0000;                       /* hex */
color: #f00;                          /* hex corto */
color: #ff0000ff;                     /* hex con alpha */
color: rgb(255 0 0);                  /* rgb moderno */
color: rgb(255 0 0 / 50%);            /* con alpha */
color: hsl(0 100% 50%);               /* hue, saturation, lightness */
color: hsl(0 100% 50% / 50%);
color: oklch(0.7 0.2 30);             /* espacio de color moderno, perceptual */
```

**Recomendación 2026**: usá `hsl` o `oklch` para definir paletas — variar `h` (tonalidad) con `s` y `l` fijos te da una paleta consistente.

## 3.9 Tipografía

```css
body {
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  font-weight: 400;
}

h1 { font-size: 2.5rem; font-weight: 700; line-height: 1.2; }
p  { max-width: 65ch;   /* línea óptima de lectura: 45–75 caracteres */ }
```

**Fuentes web** con `@font-face`:

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter.woff2') format('woff2');
  font-display: swap;
  font-weight: 100 900;
}
```

## 3.10 Background y borders

```css
.card {
  background-color: white;
  background-image: url('pattern.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  /* Shorthand */
  background: url('img.jpg') center/cover no-repeat #fff;

  /* Gradiente */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  border: 2px solid #333;
  border-radius: 12px;

  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
```

## 3.11 Display: cómo los elementos ocupan espacio

| Valor | Comportamiento |
|-------|----------------|
| `block` | Ocupa todo el ancho disponible, hace salto de línea |
| `inline` | Solo ocupa lo necesario, flujo de texto |
| `inline-block` | Inline pero acepta width/height |
| `none` | Oculto (no ocupa espacio, no accesible) |
| `flex` | Contenedor flexible (módulo 4) |
| `grid` | Contenedor grid (módulo 4) |
| `contents` | El elemento "desaparece" pero sus hijos quedan |

Alternativas a `display: none`:
- `visibility: hidden` — ocupa espacio pero no se ve.
- `opacity: 0` — transparente, sigue reaccionando a eventos.
- `hidden` (atributo HTML) — equivale a `display: none`.

## 3.12 Posicionamiento

```css
position: static;     /* default, fluyente */
position: relative;   /* sigue en flujo, pero top/left/right/bottom lo desplazan */
position: absolute;   /* fuera de flujo, relativo al ancestro posicionado más cercano */
position: fixed;      /* fuera de flujo, relativo al viewport */
position: sticky;     /* híbrido: relativo hasta que entra en su threshold, ahí se queda fijo */
```

```css
.header {
  position: sticky;
  top: 0;
  z-index: 10;
}
```

## 3.13 Transiciones y animaciones

```css
.btn {
  background: royalblue;
  transition: background 0.3s ease, transform 0.2s;
}
.btn:hover {
  background: navy;
  transform: translateY(-2px);
}

/* Keyframes */
@keyframes slideIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.card { animation: slideIn 0.4s ease-out; }
```

**Regla de oro de performance**: animá solo `transform` y `opacity`. Lo demás genera re-layout.

## 3.14 Variables CSS (custom properties)

```css
:root {
  --color-primary: #0ea5e9;
  --color-text: #0f172a;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 2rem;
  --radius: 8px;
}

.btn {
  background: var(--color-primary);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius);
}

/* Tema oscuro */
[data-theme="dark"] {
  --color-text: #f1f5f9;
  --color-bg: #0f172a;
}
```

Las variables CSS son **dinámicas** (cambian en tiempo real, se pueden leer y modificar con JS).

## 3.15 Media queries (preview — profundizamos en módulo 4)

```css
@media (max-width: 600px) {
  body { font-size: 14px; }
}

@media (prefers-color-scheme: dark) {
  :root { --color-bg: black; }
}

@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

---

## 🧑‍🎓 Worked Example

> **Ejercicio**: "Tengo un botón que no cambia de color al hover. ¿Cómo debuggeo?"

**Mi proceso (igual al que haría un senior):**

1. **Abrir DevTools → Elements → seleccionar el botón.**
2. **Ver la pestaña Styles.** Buscar:
   - ¿Hay una regla `:hover`? Si no, agrego una.
   - Si hay, ¿está tachada? Eso significa que otra regla más específica gana.
3. **Toggle `:hov` en DevTools** (botón arriba del panel de Styles → "Force element state"). Simula el hover sin mover el mouse — así puedo inspeccionar los estilos aplicados en ese estado.
4. **Si hay una regla ganadora que no esperaba**:
   - ¿Es un `!important` en un framework? Fragante — overríde con otro `!important` más específico, pero idealmente refactor.
   - ¿Es por orden de carga de CSS? Un stylesheet posterior pisa al anterior con misma especificidad.
   - ¿Es por especificidad? Inspeccionar valores `a,b,c,d` de cada regla.
5. **Trampa clásica**: `:hover` definido ANTES de `:focus` o `:active` — esos pueden pisar. Regla mnemotécnica: `LVHA` — Link, Visited, Hover, Active. En ese orden.

```css
/* ❌ orden incorrecto */
a:active { color: red; }
a:hover { color: blue; }   /* nunca se ve en un click porque :active gana por orden */

/* ✅ LVHA */
a:link    { color: black; }
a:visited { color: purple; }
a:hover   { color: blue; }
a:active  { color: red; }
```

Este tipo de debugging es 50% del trabajo frontend real.

## 🧠 Checkpoint Quiz

<details>
<summary><strong>1. Calculá la especificidad: <code>nav.main > ul#menu li a.active</code></strong></summary>

- IDs: `#menu` → 1
- Clases: `.main`, `.active` → 2
- Tipos: `nav`, `ul`, `li`, `a` → 4

**Resultado: 0,1,2,4** (lee como "124 puntos" en el sistema base-10 aproximado).
</details>

<details>
<summary><strong>2. Con <code>box-sizing: border-box</code>, ¿cuánto ocupa esto en horizontal?</strong></summary>

```css
.box {
  width: 200px;
  padding: 20px;
  border: 5px solid;
  margin: 10px;
}
```

Caja total = 200 (width incluye padding y border con `border-box`).
Espacio ocupado = 200 + margin × 2 = **220px**.

Si fuera `content-box`: caja = 200 + 40 + 10 = 250. Total con margin = 270px.
</details>

<details>
<summary><strong>3. ¿Qué propiedades NO se heredan por default?</strong></summary>

Se heredan: `color`, `font-family`, `font-size`, `line-height`, `text-align`, `visibility`.

**NO** se heredan: `margin`, `padding`, `border`, `width`, `height`, `background`, `display`, `position`, `float`.

Regla mental: las que tienen que ver con **texto** se heredan; las de **layout** no.
</details>

<details>
<summary><strong>4. ¿Qué es "margin collapse"?</strong></summary>

Dos márgenes verticales adyacentes entre elementos block se **fusionan** en uno solo (el mayor). No se suman.

`<h2 style="margin-bottom: 30px">` seguido de `<p style="margin-top: 20px">` → hay **30px** entre ellos, no 50.

Solo afecta márgenes verticales entre block elements. En Flex/Grid **NO** hay margin collapse.
</details>

<details>
<summary><strong>5. ¿Cuál es la diferencia entre <code>em</code> y <code>rem</code>?</strong></summary>

- `em` → relativo al `font-size` del **padre directo**.
- `rem` → relativo al `font-size` del `<html>` (root).

Con `em` los valores se acumulan en anidamientos (peligroso). Con `rem` siempre tenés un valor consistente en toda la app. **Preferí `rem`** para spacing y tamaños, salvo que querrás que un componente escale con su contexto (ej: padding interno proporcional al texto).
</details>

---

## Resumen ejecutivo

- CSS resuelve conflictos con **cascada**, **especificidad**, **orden**.
- `box-sizing: border-box` siempre.
- Preferí `rem` y `clamp()` sobre `px` fijos.
- Animá `transform` y `opacity`, nada más.
- Variables CSS son tu sistema de diseño.

## Ejemplos

Ver [`examples/`](./examples/):
- `01-especificidad.html` — experimento interactivo con cascada.
- `02-box-model.html` — visualización del box model.
- `03-variables-tema.html` — sistema de diseño con custom properties + toggle dark mode.

## Ejercicios

Ver [`exercises.md`](./exercises.md).

---

**Siguiente módulo:** [`04 — CSS Layout`](../modulo-04-css-layout/)
