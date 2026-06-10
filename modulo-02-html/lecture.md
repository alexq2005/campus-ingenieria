# Módulo 2 — HTML: Estructura y semántica

> *"The power of the Web is in its universality."* — Tim Berners-Lee

---

## 🎥 Multimedia

**Videos recomendados** — semántica, formularios, accesibilidad básica:
[📺 Playlist del módulo 02 →](../multimedia/videos.html#m2)

**Explorá también:** el [🎛 Hub multimedia](../multimedia/index.html) con las 4 visualizaciones interactivas del curso.

---

## 2.1 ¿Qué es HTML?

**HTML** (HyperText Markup Language) no es un lenguaje de programación — es un **lenguaje de marcado**. Tu trabajo con HTML es **marcar el significado** del contenido: "esto es un título", "esto es un párrafo", "esto es un enlace".

HTML describe **qué** es cada cosa, no **cómo se ve** (eso es CSS) ni **cómo se comporta** (eso es JS).

## 2.2 Anatomía de un elemento

```
  etiqueta de apertura
        │
        ▼
      <p class="intro">Hola, mundo</p>
       │   │           │           │
       │   └─atributo  contenido   etiqueta de cierre
       │
       └─nombre del elemento
```

Algunos elementos son **void** (sin cierre): `<img>`, `<br>`, `<hr>`, `<input>`, `<meta>`, `<link>`.

## 2.3 Esqueleto de un documento HTML5

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Descripción para buscadores y redes sociales">
    <title>Título de la pestaña</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <!-- Contenido visible -->
  </body>
</html>
```

Cada línea tiene una razón de ser:

- `<!DOCTYPE html>` — Le dice al navegador: "soy HTML5, entrá en *standards mode*" (sin esto, se activa el modo *quirks* — horrible, del siglo XX).
- `lang="es"` — Idioma del documento. Crítico para accesibilidad, traducción automática y SEO.
- `<meta charset="UTF-8">` — Codificación de caracteres. Sin esto los acentos y emojis se rompen.
- `<meta name="viewport" ...>` — Hace el sitio responsive en móviles. Sin esto, tu sitio se ve como desktop zoomeado en celular.
- `<title>` — Obligatorio. Es lo que aparece en la pestaña y en los resultados de Google.

## 2.4 Semántica: el cambio mental más importante del curso

Antes de HTML5, todo era `<div>` con clases: `<div class="header">`, `<div class="article">`. Después de HTML5 tenemos **etiquetas semánticas**:

```html
<body>
  <header>           <!-- cabecera del sitio o de una sección -->
    <nav>...</nav>   <!-- navegación principal -->
  </header>

  <main>             <!-- contenido principal, ÚNICO en la página -->
    <article>        <!-- contenido autocontenido (post, noticia) -->
      <header>
        <h1>Título del post</h1>
        <time datetime="2026-04-23">23 de abril, 2026</time>
      </header>
      <section>      <!-- una sección temática del artículo -->
        <h2>Subtítulo</h2>
        <p>...</p>
      </section>
      <aside>        <!-- contenido relacionado pero secundario -->
        <p>Nota al margen</p>
      </aside>
    </article>
  </main>

  <footer>           <!-- pie de página -->
    <p>© 2026</p>
  </footer>
</body>
```

**¿Por qué semántica importa?**

1. **Accesibilidad**: lectores de pantalla permiten saltar de `<nav>` a `<main>` con un atajo. Si todo es `<div>`, el usuario ciego navega letra por letra.
2. **SEO**: Google prioriza contenido dentro de `<article>` y `<main>` sobre `<aside>` y `<footer>`.
3. **Mantenibilidad**: leer código ajeno con semántica es 3× más rápido.
4. **CSS más limpio**: seleccionás por semántica, no por clases fantasma.

## 2.5 Jerarquía de headings (crítico)

Usá `<h1>` hasta `<h6>`. La regla:

- **Un solo `<h1>` por página** (el título principal).
- **No te saltes niveles.** `<h2>` después de `<h1>` ✅. `<h4>` después de `<h1>` ❌.
- Headings estructuran el **document outline**, no son para hacer texto grande — para eso está CSS.

```html
<h1>Mi blog</h1>
  <h2>Post: Aprendiendo HTML</h2>
    <h3>Sección: Qué es HTML</h3>
    <h3>Sección: Elementos semánticos</h3>
      <h4>Subsección: Headings</h4>
  <h2>Post: Aprendiendo CSS</h2>
```

## 2.6 Elementos de texto esenciales

| Etiqueta | Semántica | Cuándo usarla |
|----------|-----------|---------------|
| `<p>` | Párrafo | Bloque de texto |
| `<strong>` | Importancia | Texto crítico (NO solo para negrita) |
| `<em>` | Énfasis | Texto enfatizado (NO solo para cursiva) |
| `<mark>` | Resaltado | Texto destacado (como subrayador amarillo) |
| `<code>` | Código | Fragmento de código inline |
| `<pre>` | Preformateado | Preserva espacios y saltos de línea |
| `<blockquote>` | Cita larga | Cita en bloque |
| `<q>` | Cita corta | Cita inline |
| `<abbr title="...">` | Abreviatura | Con tooltip |
| `<time datetime="...">` | Fecha/hora | Fecha legible por máquina |
| `<small>` | Letra chica | Disclaimers, copyright |
| `<kbd>` | Tecla del teclado | `<kbd>Ctrl</kbd>+<kbd>C</kbd>` |

**Regla de oro**: elegí la etiqueta por **significado**, no por **apariencia**. Usá `<strong>` no `<b>`; `<em>` no `<i>`.

## 2.7 Listas

```html
<!-- No ordenada -->
<ul>
  <li>Manzana</li>
  <li>Banana</li>
</ul>

<!-- Ordenada -->
<ol>
  <li>Encender PC</li>
  <li>Abrir editor</li>
</ol>

<!-- Descripción (clave/valor) -->
<dl>
  <dt>HTML</dt>
  <dd>Lenguaje de marcado</dd>
  <dt>CSS</dt>
  <dd>Hojas de estilo</dd>
</dl>
```

## 2.8 Enlaces (`<a>`)

El elemento que **define la Web**: el hiperenlace.

```html
<a href="https://ejemplo.com">Enlace externo</a>
<a href="/sobre">Enlace interno (ruta relativa)</a>
<a href="#contacto">Ancla (misma página)</a>
<a href="mailto:hola@ejemplo.com">Email</a>
<a href="tel:+5491112345678">Teléfono</a>

<!-- Abrir en nueva pestaña (con seguridad) -->
<a href="https://externo.com" target="_blank" rel="noopener noreferrer">
  Abrir en pestaña nueva
</a>
```

⚠️ `rel="noopener noreferrer"` cuando usás `target="_blank"` — evita un ataque llamado *tabnabbing* donde la página abierta podía controlar tu pestaña original.

## 2.9 Imágenes y multimedia

```html
<!-- Siempre alt: describe la imagen para usuarios que no la ven -->
<img src="gato.jpg" alt="Gato negro durmiendo sobre un teclado" width="600" height="400">

<!-- Imagen responsive con múltiples resoluciones -->
<img
  src="foto-800.jpg"
  srcset="foto-400.jpg 400w, foto-800.jpg 800w, foto-1600.jpg 1600w"
  sizes="(max-width: 600px) 400px, 800px"
  alt="Paisaje de montaña">

<!-- Imagen con distintos formatos (WebP, AVIF, fallback) -->
<picture>
  <source srcset="foto.avif" type="image/avif">
  <source srcset="foto.webp" type="image/webp">
  <img src="foto.jpg" alt="Paisaje">
</picture>

<!-- Video -->
<video controls width="640" poster="thumbnail.jpg">
  <source src="video.webm" type="video/webm">
  <source src="video.mp4" type="video/mp4">
  Tu navegador no soporta video.
</video>

<!-- Audio -->
<audio controls>
  <source src="podcast.mp3" type="audio/mpeg">
</audio>
```

**Regla del `alt`**:
- Imagen informativa → `alt="descripción concisa"`.
- Imagen decorativa → `alt=""` (vacío, pero presente).
- **Nunca** omitir el atributo `alt` — rompe accesibilidad.

## 2.10 Formularios: la interactividad de toda la Web pre-JS

```html
<form action="/api/registro" method="POST">
  <!-- Etiqueta asociada al input por id -->
  <label for="email">Email</label>
  <input type="email" id="email" name="email" required
         placeholder="vos@ejemplo.com"
         autocomplete="email">

  <label for="password">Contraseña</label>
  <input type="password" id="password" name="password" required
         minlength="8" autocomplete="new-password">

  <label for="edad">Edad</label>
  <input type="number" id="edad" name="edad" min="13" max="120">

  <label for="nacimiento">Fecha de nacimiento</label>
  <input type="date" id="nacimiento" name="nacimiento">

  <label for="pais">País</label>
  <select id="pais" name="pais">
    <option value="">Elegí una opción</option>
    <option value="ar">Argentina</option>
    <option value="mx">México</option>
  </select>

  <label>
    <input type="checkbox" name="terminos" required>
    Acepto los términos
  </label>

  <fieldset>
    <legend>Plan</legend>
    <label><input type="radio" name="plan" value="basico"> Básico</label>
    <label><input type="radio" name="plan" value="pro"> Pro</label>
  </fieldset>

  <label for="comentario">Comentario</label>
  <textarea id="comentario" name="comentario" rows="5"></textarea>

  <button type="submit">Registrarme</button>
</form>
```

**Tipos de input modernos** (validación + UI nativa): `email`, `tel`, `url`, `number`, `date`, `time`, `datetime-local`, `color`, `range`, `search`, `file`.

**Atributos de validación**: `required`, `minlength`, `maxlength`, `min`, `max`, `pattern` (regex), `type`.

**Crítico**: toda validación del cliente es **cosmética** — siempre revalidá en el servidor. El cliente es territorio del usuario (adversario en potencia).

## 2.11 Tablas (para datos tabulares, no para layout)

```html
<table>
  <caption>Ventas trimestrales</caption>
  <thead>
    <tr>
      <th scope="col">Producto</th>
      <th scope="col">Q1</th>
      <th scope="col">Q2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Manzanas</th>
      <td>150</td>
      <td>200</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th scope="row">Total</th>
      <td>150</td>
      <td>200</td>
    </tr>
  </tfoot>
</table>
```

⚠️ **NO uses tablas para layout.** Es una práctica de los años 90 — usá CSS Grid (módulo 4).

## 2.12 Atributos globales (funcionan en cualquier elemento)

| Atributo | Uso |
|----------|-----|
| `id` | Identificador único en la página |
| `class` | Agrupar elementos (para CSS/JS) |
| `style` | Estilos inline (evitá — usá CSS) |
| `title` | Tooltip al hacer hover |
| `lang` | Idioma de ese elemento |
| `hidden` | Ocultar el elemento |
| `tabindex` | Orden de tabulación |
| `data-*` | Datos custom para JS (`data-user-id="42"`) |
| `aria-*` | Accesibilidad (módulo 12) |

## 2.13 Metadata y Open Graph

```html
<head>
  <title>Mi artículo — Mi Blog</title>
  <meta name="description" content="Descripción de 150–160 caracteres para Google">
  <link rel="canonical" href="https://miblog.com/mi-articulo">

  <!-- Open Graph (Facebook, LinkedIn, WhatsApp) -->
  <meta property="og:title" content="Mi artículo">
  <meta property="og:description" content="Descripción">
  <meta property="og:image" content="https://miblog.com/cover.jpg">
  <meta property="og:url" content="https://miblog.com/mi-articulo">
  <meta property="og:type" content="article">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">

  <!-- Favicon -->
  <link rel="icon" href="/favicon.ico">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
</head>
```

## 2.14 Validación y estándares

- Validador oficial W3C: https://validator.w3.org/
- MDN HTML reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Element
- WHATWG living standard (el oficial): https://html.spec.whatwg.org/

---

## 🧑‍🎓 Worked Example

> **Ejercicio**: "Tengo un diseño de una página de producto con título, precio, descripción, botón 'comprar', y reviews. ¿Cómo la estructuro semánticamente?"

**Mi razonamiento:**

1. *¿Qué tipo de contenido es?* Es un "producto", unidad autocontenida → envuelvo todo en `<article>`.
2. *¿Hay un título principal?* Sí, el nombre del producto → `<h1>` (único en la página).
3. *¿Las reviews son parte del artículo principal o un complemento?* Son secundarias pero relacionadas → `<aside>` o una `<section>` dentro del article. Voy con `<section>`.
4. *¿El botón "comprar" navega a otra URL o dispara una acción?* Acción → `<button>`. Si fuera ir a `/checkout`, sería `<a>`.
5. *Precio*: texto normal, no hay etiqueta especial. Podría usar `<data value="1299.99">` para hacerlo machine-readable.

Resultado:

```html
<article>
  <header>
    <h1>Auriculares XYZ</h1>
    <p><data value="1299.99">$1.299,99</data></p>
  </header>

  <section aria-label="Descripción">
    <p>Auriculares inalámbricos con cancelación de ruido...</p>
  </section>

  <button type="button" data-id="42">Comprar</button>

  <section aria-label="Reseñas">
    <h2>Reseñas</h2>
    <article>
      <h3>⭐⭐⭐⭐⭐ Excelente</h3>
      <p>Los mejores que he probado.</p>
      <p><cite>Ada L.</cite> · <time datetime="2026-04-15">15 abr 2026</time></p>
    </article>
  </section>
</article>
```

**Claves de la decisión**:
- `<article>` anidado (uno principal, uno por review).
- `<cite>` para el autor de la reseña.
- `<time datetime="...">` para fechas machine-readable.
- `<button type="button">` siempre — si olvidás `type`, dentro de un form dispara submit.

## 🧠 Checkpoint Quiz

<details>
<summary><strong>1. ¿Cuántos <code>&lt;h1&gt;</code> debe tener una página?</strong></summary>

**Uno**, el título principal. HTML5 técnicamente permite múltiples (uno por `<article>`, `<section>`), pero la regla de oro para SEO y a11y es: **1 `<h1>` por página**.
</details>

<details>
<summary><strong>2. ¿Cuál es la diferencia entre <code>&lt;b&gt;</code> y <code>&lt;strong&gt;</code>?</strong></summary>

- `<b>` → solo tipográfico (negrita), sin semántica. Para nombres propios, términos técnicos.
- `<strong>` → indica **importancia**. Los screen readers lo enfatizan.

Regla práctica: si duda, `<strong>`. Si solo querés negrita decorativa, preferí `font-weight: bold` en CSS.
</details>

<details>
<summary><strong>3. ¿Qué hace <code>alt=""</code> vs omitir el atributo?</strong></summary>

- `alt=""` → imagen **decorativa**; screen readers la ignoran.
- Sin `alt` → screen reader lee la URL del archivo. ❌ mal.

**Siempre** poné `alt`. Vacío si decorativa, descriptivo si informativa.
</details>

<details>
<summary><strong>4. ¿Para qué sirve <code>&lt;label for="x"&gt;</code>?</strong></summary>

Asocia el texto a un input con `id="x"`. Beneficios:
- Clickear el label enfoca el input (hit target más grande).
- Screen readers anuncian el label al llegar al input.
- Requerido para accesibilidad WCAG.

Alternativas: envolver el input en el label (`<label>Nombre <input></label>`), o usar `aria-label="..."`.
</details>

<details>
<summary><strong>5. ¿Por qué <code>&lt;div&gt;</code> con <code>onclick</code> está mal?</strong></summary>

Por 4 razones:
1. No es focuseable por teclado (no es tab-able).
2. No se activa con `Enter`/`Space`.
3. Screen readers no lo anuncian como interactivo.
4. Los CSS de reset de foco no se aplican.

Solución: usá `<button>` (para acciones) o `<a>` (para navegación). Si de verdad necesitás un div clicable: `tabindex="0"`, `role="button"`, handlers para `Enter`/`Space`, y `:focus-visible`.
</details>

---

## Resumen ejecutivo

- HTML describe **estructura y significado**.
- Usá etiquetas **semánticas**, no `<div>` para todo.
- Un `<h1>` por página, sin saltar niveles.
- Formularios tienen validación nativa — aprovechala.
- `alt` en toda imagen, `lang` en el `<html>`, `viewport` en el `<head>`.

## Ejemplos

Ver [`examples/`](./examples/):
- `01-esqueleto-semantico.html` — página completa con semántica correcta.
- `02-formulario-completo.html` — formulario con todos los tipos de input.
- `03-multimedia.html` — `<picture>`, `<video>` responsive.

## Ejercicios

Ver [`exercises.md`](./exercises.md).

---

**Siguiente módulo:** [`03 — CSS fundamentos`](../modulo-03-css/)
