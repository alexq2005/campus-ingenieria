# Módulo 4 — CSS Layout: Flexbox, Grid y Responsive Design

> *"Flexbox is for 1D layouts. Grid is for 2D. Learn both."*

---

## 🎥 Multimedia

**Visualización interactiva** — ejes `main` y `cross` que rotan cuando cambiás `flex-direction`:

<iframe
  src="../multimedia/flexbox-alignment.html"
  width="100%" height="800"
  style="border: 1px solid #334155; border-radius: 10px;"
  loading="lazy"
  title="Flexbox Alignment Visualizer"></iframe>

> Si el iframe no renderiza, abrí directamente [`multimedia/flexbox-alignment.html`](../multimedia/flexbox-alignment.html).

**Videos recomendados:** [📺 Playlist del módulo 04 →](../multimedia/videos.html#m4)

**🎮 Recursos interactivos externos:**
- [Flexbox Froggy](https://flexboxfroggy.com) — juego para dominar Flexbox
- [Grid Garden](https://cssgridgarden.com) — juego para dominar CSS Grid

---

## 4.1 Historia: por qué Flexbox y Grid existen

En la Web antigua (1998–2012) hacíamos layouts con:
- **Tablas** (hacks horribles).
- **Floats** (diseñados para "texto alrededor de imagen", nunca para layout).
- **`display: inline-block`** con márgenes negativos y `letter-spacing` tricks.

Era una pesadilla. **Flexbox** (2012) y **CSS Grid** (2017) son **los** dos tecnologías que hicieron que el layout de la Web moderna sea posible sin hacks.

## 4.2 Flexbox — layout unidimensional

Un contenedor flex dispone sus hijos (items) **en una sola dimensión**: fila o columna.

### Propiedades del contenedor

```css
.contenedor {
  display: flex;              /* activa flexbox */
  flex-direction: row;        /* row | row-reverse | column | column-reverse */
  flex-wrap: nowrap;          /* nowrap | wrap | wrap-reverse */

  justify-content: flex-start; /* alineación en el eje principal */
  /* flex-start | flex-end | center | space-between | space-around | space-evenly */

  align-items: stretch;        /* alineación en el eje cruzado */
  /* stretch | flex-start | flex-end | center | baseline */

  gap: 1rem;                   /* espacio entre items (mejor que margin) */
}
```

### Ejes

```
flex-direction: row (default)

  eje principal →
  ┌───┬───┬───┬───┐
  │ 1 │ 2 │ 3 │ 4 │   ↑ eje cruzado
  └───┴───┴───┴───┘
```

Cuando cambiás a `column`, los ejes rotan.

### Propiedades de los items

```css
.item {
  flex-grow: 0;       /* qué proporción crece del espacio sobrante */
  flex-shrink: 1;     /* qué proporción se achica si falta espacio */
  flex-basis: auto;   /* tamaño base antes de crecer/achicar */

  /* Shorthand */
  flex: 1;             /* = flex: 1 1 0  (ocupa partes iguales) */
  flex: 1 1 200px;     /* grow=1, shrink=1, basis=200px */

  align-self: auto;    /* override del align-items del padre */
  order: 0;            /* reordena sin tocar el HTML */
}
```

### Patrones comunes con Flexbox

```css
/* 1. Centrado perfecto (absoluto y completo) */
.centrar-todo {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

/* 2. Header con logo a la izquierda, nav a la derecha */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 3. Sidebar + contenido */
.layout {
  display: flex;
  gap: 2rem;
}
.sidebar { flex: 0 0 240px; }   /* fijo */
.main    { flex: 1; }           /* ocupa lo demás */

/* 4. Cards del mismo alto aunque el contenido varíe */
.cards { display: flex; gap: 1rem; }
/* align-items: stretch es el default — ya funciona */
```

## 4.3 CSS Grid — layout bidimensional

Con Grid definís **filas y columnas simultáneamente**. Es la herramienta definitiva para layouts complejos.

### Sintaxis básica

```css
.grid {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
}
```

- `fr` = "fraction", una unidad nueva de Grid. `1fr 2fr 1fr` divide el sobrante en 4 partes (1+2+1).
- `auto` = toma el tamaño del contenido.
- `minmax(200px, 1fr)` = mínimo 200px, máximo 1fr.

### Layout de "Holy Grail" clásico con Grid

```css
.pagina {
  display: grid;
  grid-template-areas:
    "header  header  header"
    "sidebar main    aside"
    "footer  footer  footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  gap: 1rem;
}
header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
main    { grid-area: main; }
aside   { grid-area: aside; }
footer  { grid-area: footer; }
```

Leíble incluso en voz alta. Esto en 2010 requería 80 líneas de CSS con floats y clearfix.

### Colocación explícita

```css
.item {
  grid-column: 1 / 3;       /* de la línea 1 a la 3 */
  grid-row: 2 / 4;

  /* O con span */
  grid-column: span 2;      /* ocupa 2 columnas */
}
```

### Grid implícito y `auto-fit`/`auto-fill` (la magia responsive)

```css
.galeria {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
```

**Esto es oro puro**: la galería tiene tantas columnas como quepan con mínimo 250px cada una, y rellenan el espacio. **Sin media queries**.

- `auto-fit`: colapsa columnas vacías (las existentes crecen).
- `auto-fill`: deja las columnas vacías reservadas.

## 4.4 Flexbox vs Grid — cuándo usar cuál

| Caso | Herramienta |
|------|-------------|
| Navbar, toolbar, botones | Flexbox |
| Galería de cards responsive | Grid (`auto-fit`) |
| Layout general de la página (header/sidebar/main/footer) | Grid |
| Alineación de un contenido dentro de una card | Flexbox |
| Formularios con label + input lado a lado | Grid o Flex |
| Dashboard con áreas nombradas | Grid |
| Lista de tags | Flexbox con `flex-wrap: wrap` |

**Combinalos**: una página con Grid, cada card con Flexbox adentro.

## 4.5 Responsive Design

### Filosofía: mobile-first

Escribí CSS para móvil primero. Después agregá media queries `min-width` para mejorar en pantallas más grandes.

```css
/* Base: móvil */
.hero { padding: 1rem; font-size: 1.2rem; }

/* Tablet y más */
@media (min-width: 768px) {
  .hero { padding: 2rem; font-size: 1.5rem; }
}

/* Desktop */
@media (min-width: 1200px) {
  .hero { padding: 4rem; font-size: 2rem; }
}
```

### Breakpoints comunes (orientativos, no dogma)

```css
/* xs (default): < 640px */
@media (min-width: 640px)  { /* sm: celulares grandes */ }
@media (min-width: 768px)  { /* md: tablets verticales */ }
@media (min-width: 1024px) { /* lg: tablets horizontales / laptops pequeñas */ }
@media (min-width: 1280px) { /* xl: desktop */ }
@media (min-width: 1536px) { /* 2xl: monitores grandes */ }
```

**Mejor práctica**: definí breakpoints basados en **tu contenido**, no en dispositivos. Si el layout se rompe a los 880px, ponelo ahí.

### El `meta viewport` (sin esto nada es responsive)

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### Unidades viewport dinámicas (para móvil)

```css
.hero { height: 100vh; }    /* problema en iOS: incluye la barra */
.hero { height: 100dvh; }   /* dynamic viewport height — moderno */
.hero { height: 100svh; }   /* small viewport — con barras visibles */
.hero { height: 100lvh; }   /* large viewport — con barras ocultas */
```

### Imágenes responsive (repaso del módulo 2)

```html
<img src="cover.jpg"
     srcset="cover-400.jpg 400w, cover-800.jpg 800w, cover-1600.jpg 1600w"
     sizes="(max-width: 600px) 100vw, 50vw"
     alt="...">
```

### Container queries (2023+) — el futuro

```css
.card { container-type: inline-size; }

@container (min-width: 400px) {
  .card-title { font-size: 1.5rem; }
}
```

Los componentes se adaptan a **su contenedor**, no al viewport. Ideal para componentes reutilizables en sidebars o grids.

## 4.6 Accesibilidad en layouts

- **Orden visual ≠ orden del DOM**. `flex-direction: row-reverse` y `order` rompen la lectura por teclado y lectores de pantalla. Usalos con cuidado.
- **Touch targets**: mínimo 44×44 px para cualquier cosa cliqueable en móvil (WCAG).
- **Tipografía**: mínimo 16px en body (abajo de eso, iOS hace zoom automático en inputs).
- **Zoom**: tu sitio debe funcionar con el usuario zoomeando hasta 200%.
- **`prefers-reduced-motion`**: respetá usuarios que desactivaron animaciones.

## 4.7 Patrones modernos imprescindibles

### 1. El "sandwich layout" (page)

```css
body {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
}
header, footer { /* alto natural */ }
main { /* toma lo que sobra, empuja el footer al fondo */ }
```

### 2. Centrado definitivo

```css
.centro {
  display: grid;
  place-items: center;   /* = align-items + justify-items */
  min-height: 100dvh;
}
```

### 3. Stack with gap (vertical con espaciado consistente)

```css
.stack > * + * {          /* "Lobotomized Owl" de Heydon Pickering */
  margin-top: 1rem;
}

/* Versión moderna con Flex */
.stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
```

### 4. Cluster (tags que envuelven)

```css
.cluster {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
```

### 5. Sidebar "intrínseco" (sidebar que desaparece en móvil)

```css
.layout {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}
.sidebar { flex-basis: 240px; flex-grow: 1; }
.main    { flex-basis: 0;     flex-grow: 999; min-inline-size: 50%; }
```

La magia: cuando el viewport es angosto, `min-inline-size: 50%` obliga a main a saltar de línea y la sidebar queda arriba. Sin media queries. Pattern del libro *Every Layout*.

---

## 🧑‍🎓 Worked Example

> **Ejercicio**: "Diseñá un layout de blog con header full-width, sidebar de 250px a la derecha, y main ocupando el resto. En móvil, sidebar debe ir abajo de main."

**Decisión previa: ¿Flex o Grid?**

Grid gana porque:
- Es layout 2D (filas + columnas).
- `grid-template-areas` es auto-documentado.
- Cambio de layout responsive es trivial (redeclarar áreas).

```css
.page {
  display: grid;
  min-height: 100vh;
  grid-template-areas:
    "header header"
    "main   aside"
    "footer footer";
  grid-template-columns: 1fr 250px;
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
}
header  { grid-area: header; }
main    { grid-area: main; }
aside   { grid-area: aside; }
footer  { grid-area: footer; }

/* Mobile: 1 columna, main → aside → footer */
@media (max-width: 768px) {
  .page {
    grid-template-areas:
      "header"
      "main"
      "aside"
      "footer";
    grid-template-columns: 1fr;
  }
}
```

**Por qué NO elegí Flexbox**: hubiera requerido envolver `main` + `aside` en un div extra (Flex es 1D), y el responsive hubiera sido menos elegante.

## 🧠 Checkpoint Quiz

<details>
<summary><strong>1. ¿Cuál es la diferencia entre <code>justify-content</code> y <code>align-items</code> en Flexbox?</strong></summary>

- `justify-content` → alineación en el **eje principal** (main axis). Con `flex-direction: row`, es horizontal.
- `align-items` → alineación en el **eje cruzado** (cross axis). Con `flex-direction: row`, es vertical.

Al cambiar `flex-direction` a `column`, los ejes rotan → `justify-content` pasa a vertical.
</details>

<details>
<summary><strong>2. ¿Qué significa <code>flex: 1</code>?</strong></summary>

`flex: 1` = `flex-grow: 1; flex-shrink: 1; flex-basis: 0`.

Significa: "crecé con proporción 1 si hay espacio sobrante; achicate con proporción 1 si falta; empezá desde 0".

3 hermanos con `flex: 1` → ocupan partes iguales. Si uno tiene `flex: 2`, ese ocupa el doble.
</details>

<details>
<summary><strong>3. ¿Qué hace <code>repeat(auto-fit, minmax(200px, 1fr))</code>?</strong></summary>

Crea tantas columnas como quepan con mínimo 200px cada una. Las columnas crecen para llenar el ancho restante (`1fr`). Cuando el ancho cambia, las columnas se reacomodan automáticamente.

**El one-liner responsive más útil de CSS.** Sin media queries.

`auto-fit` vs `auto-fill`: con `auto-fit`, columnas vacías colapsan (las otras crecen). Con `auto-fill`, se mantienen reservadas aunque estén vacías.
</details>

<details>
<summary><strong>4. ¿Por qué "mobile-first" con <code>min-width</code> > "desktop-first" con <code>max-width</code>?</strong></summary>

Razones prácticas:
1. **Bytes**: el 60% del tráfico global es móvil. Si la base es mobile, cargás menos CSS en móviles.
2. **Progresión natural**: empezás con lo chico, agregás features para lo grande. Invertido obliga a "sacar" features.
3. **Menos specificity hell**: las media queries `min-width` van "apilando" cambios; `max-width` requiere "resetear".

```css
/* Mobile-first (recomendado) */
.box { padding: 1rem; }
@media (min-width: 768px) { .box { padding: 2rem; } }

/* Desktop-first (evitar) */
.box { padding: 2rem; }
@media (max-width: 767px) { .box { padding: 1rem; } }
```
</details>

<details>
<summary><strong>5. ¿Qué es un "container query" y en qué se diferencia de una media query?</strong></summary>

- **Media query**: reacciona al tamaño del **viewport** (toda la ventana).
- **Container query**: reacciona al tamaño del **contenedor padre** del componente.

Ejemplo: una card que cambia de layout vertical a horizontal **cuando su contenedor** es ancho. La misma card puede estar en una sidebar angosta (vertical) y en un main ancho (horizontal) — en la misma pantalla.

Esto era imposible con media queries hasta 2023. Hoy están soportadas en todos los navegadores modernos.

```css
.card { container-type: inline-size; }
@container (min-width: 400px) {
  .card { display: flex; }
}
```
</details>

---

## Resumen ejecutivo

- **Flexbox** = 1D (fila o columna).
- **Grid** = 2D (fila y columna simultáneas).
- Usalos **juntos**: Grid para la página, Flex para los componentes.
- Mobile-first + `min-width`.
- `repeat(auto-fit, minmax(X, 1fr))` es el one-liner responsive más útil.
- Container queries son el futuro — úsalas si tu target navegador las soporta.

## Ejemplos

Ver [`examples/`](./examples/):
- `01-flexbox-playground.html` — juguetá con `justify-content` y `align-items`.
- `02-grid-holy-grail.html` — layout clásico con áreas nombradas.
- `03-responsive-galeria.html` — `auto-fit` + `minmax` en acción.

## Ejercicios

Ver [`exercises.md`](./exercises.md).

---

**Siguiente módulo:** [`05 — JavaScript fundamentos`](../modulo-05-javascript-fundamentos/)
