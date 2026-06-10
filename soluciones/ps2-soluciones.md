# Soluciones — PS2: HTML semántico

## Sección A — Refactor

### 1. HTML antiguo → semántico

**Antes** (sopa de divs):
```html
<div class="header">
  <div class="logo">Mi Tienda</div>
  <div class="nav">...</div>
</div>
<div class="content">
  <div class="post">...</div>
  <div class="sidebar">...</div>
</div>
<div class="footer">© 2026</div>
```

**Después** (semántico):
```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mi Tienda</title>
</head>
<body>
  <header>
    <h1>Mi Tienda</h1>
    <nav aria-label="Navegación principal">
      <ul>
        <li><a href="/">Inicio</a></li>
        <li><a href="/productos">Productos</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <article>
      <header>
        <h2>Nuevo producto</h2>
        <time datetime="2026-04-20">20 de abril, 2026</time>
      </header>
      <p>Lorem ipsum...</p>
    </article>

    <aside>
      <h2>Ofertas del día</h2>
    </aside>
  </main>

  <footer>
    <p>&copy; <time datetime="2026">2026</time></p>
  </footer>
</body>
</html>
```

**Decisiones clave**:
- `<header>` envolviendo logo + nav (cabecera del sitio).
- `<nav>` con `<ul>/<li>` (es una lista de links).
- `<main>` wrap del contenido principal.
- `<article>` para el post (unidad autocontenida).
- `<article>` tiene su propio `<header>` con título y fecha.
- `<time datetime="2026-04-20">` con el formato ISO 8601.
- `<aside>` para la sidebar (contenido relacionado pero secundario).

---

## Sección B — Validación de accesibilidad

### 2. Los 6 errores

```html
<html>                                    <!-- ❌ 1. falta lang="..." -->
<head><title></title></head>              <!-- ❌ 2. title vacío -->
<body>
  <h1>Bienvenido</h1>
  <h4>Sobre nosotros</h4>                  <!-- ❌ 3. h4 después de h1 (salta h2, h3) -->
  <img src="team.jpg">                     <!-- ❌ 4. falta alt -->
  <div onclick="alert('hola')">Cliqueame</div>  <!-- ❌ 5. debe ser <button> (no es focuseable ni teclado) -->
  <input type="text" placeholder="Tu nombre">   <!-- ❌ 6. falta <label> -->
  <a href="javascript:void(0)" onclick="borrar()">Borrar</a>  <!-- ❌ href inválido; debe ser <button> -->
</body>
</html>
```

**Versión corregida:**

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Sobre nosotros — Mi Sitio</title>
</head>
<body>
  <h1>Bienvenido</h1>
  <h2>Sobre nosotros</h2>
  <img src="team.jpg" alt="Equipo de 5 personas posando frente a la oficina, sonriendo">

  <button type="button" onclick="saludar()">Cliqueame</button>

  <label for="nombre">Tu nombre</label>
  <input id="nombre" name="nombre" type="text">

  <button type="button" onclick="borrar()">Borrar</button>
</body>
</html>
```

---

## Sección C — Construcción

### 3. CV (estructura completa)

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Ada Lovelace — Developer | CV</title>
  <meta name="description" content="CV de Ada Lovelace, desarrolladora frontend con 5 años de experiencia.">

  <!-- Open Graph para WhatsApp, LinkedIn -->
  <meta property="og:title" content="Ada Lovelace — Developer">
  <meta property="og:description" content="CV completo con experiencia y proyectos.">
  <meta property="og:image" content="https://tudominio.com/cv-cover.jpg">
  <meta property="og:type" content="profile">
</head>
<body>
  <header>
    <img src="/foto.jpg" alt="Foto de perfil de Ada Lovelace, sonriendo" width="150" height="150">
    <h1>Ada Lovelace</h1>
    <p>Frontend Developer · React · TypeScript</p>
    <nav aria-label="Secciones del CV">
      <ul>
        <li><a href="#experiencia">Experiencia</a></li>
        <li><a href="#educacion">Educación</a></li>
        <li><a href="#habilidades">Habilidades</a></li>
        <li><a href="#contacto">Contacto</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section id="experiencia">
      <h2>Experiencia</h2>

      <article>
        <h3>Senior Frontend · Acme Corp</h3>
        <p><time datetime="2023-03">Mar 2023</time> – <time datetime="2026-04">presente</time></p>
        <ul>
          <li>Lideré migración de 50k líneas de legacy a React + TypeScript.</li>
          <li>Redujimos el bundle en 40% (de 1.2 MB a 720 KB).</li>
        </ul>
      </article>

      <article>
        <h3>Frontend · Startup Inc</h3>
        <p><time datetime="2021-06">Jun 2021</time> – <time datetime="2023-02">Feb 2023</time></p>
        <p>Construí desde cero el dashboard de analytics.</p>
      </article>
    </section>

    <section id="educacion">
      <h2>Educación</h2>
      <ul>
        <li>CS50 — Harvard University (<time datetime="2020">2020</time>)</li>
        <li>Licenciatura en Matemáticas — University of London (<time datetime="2019">2019</time>)</li>
      </ul>
    </section>

    <section id="habilidades">
      <h2>Habilidades</h2>
      <dl>
        <dt>Frontend</dt>
        <dd>React, TypeScript, Next.js, Vite, Tailwind CSS</dd>
        <dt>Testing</dt>
        <dd>Vitest, Jest, React Testing Library, Playwright</dd>
        <dt>Tooling</dt>
        <dd>Git, GitHub Actions, ESLint, Prettier, Lighthouse</dd>
      </dl>
    </section>

    <aside>
      <blockquote cite="https://en.wikiquote.org/wiki/Alan_Kay">
        <p>"The best way to predict the future is to invent it."</p>
        <footer>— Alan Kay</footer>
      </blockquote>
    </aside>
  </main>

  <footer id="contacto">
    <h2>Contacto</h2>
    <ul>
      <li><a href="mailto:ada@ejemplo.com">ada@ejemplo.com</a></li>
      <li><a href="https://github.com/adalove" rel="noopener noreferrer">GitHub</a></li>
      <li><a href="https://linkedin.com/in/adalove" rel="noopener noreferrer">LinkedIn</a></li>
    </ul>
  </footer>
</body>
</html>
```

### 4. Encuesta (solo los inputs clave)

```html
<form action="https://httpbin.org/post" method="POST">
  <label for="edad">Edad</label>
  <input id="edad" name="edad" type="number" min="13" max="120" required>

  <label for="email">Email</label>
  <input id="email" name="email" type="email" required>

  <fieldset>
    <legend>Lenguajes favoritos (máx 3)</legend>
    <label><input type="checkbox" name="langs" value="js"> JavaScript</label>
    <label><input type="checkbox" name="langs" value="py"> Python</label>
    <label><input type="checkbox" name="langs" value="go"> Go</label>
    <label><input type="checkbox" name="langs" value="rs"> Rust</label>
  </fieldset>

  <fieldset>
    <legend>Nivel</legend>
    <label><input type="radio" name="nivel" value="principiante" required> Principiante</label>
    <label><input type="radio" name="nivel" value="intermedio"> Intermedio</label>
    <label><input type="radio" name="nivel" value="avanzado"> Avanzado</label>
  </fieldset>

  <label for="color">Color favorito</label>
  <input id="color" name="color" type="color" value="#0ea5e9">

  <label for="horas">Horas de práctica/semana: <output id="horasOut">10</output></label>
  <input id="horas" name="horas" type="range" min="0" max="40" value="10"
         oninput="horasOut.value = this.value">

  <label for="comentario">Comentario</label>
  <textarea id="comentario" name="comentario" rows="4" maxlength="500"></textarea>

  <button type="submit">Enviar</button>
</form>
```

---

## Sección D — Inspección

### 5 y 6. Análisis de sitios reales

Las respuestas cambian con cada actualización de los sitios. Lo importante es **el método**:
1. Abrí DevTools → Elements.
2. En la barra buscá el tag (`Ctrl+F` dentro de Elements).
3. Contá con paciencia o usá la consola: `document.querySelectorAll('nav').length`.

Típicamente:
- **github.com**: varios `<nav>`, **1** `<main>`, **1** `<h1>`, `lang="en"`.
- **news.ycombinator.com**: **0** `<nav>`, **0** `<main>`, probablemente ningún `<h1>` (usan `<td>` table-based layout — HTML de 1995, mantenido así a propósito).

HN es **menos semántico**. Importa porque:
- Screen readers no pueden saltar secciones.
- Google tiene más dificultad para entender el contenido.
- Mantener el código ajeno es más difícil.
- Pero HN es legendario por mantener estilo minimalista — un trade-off consciente.

---

## Desafío

### 7. Open Graph en el CV

```html
<head>
  <!-- SEO básico -->
  <title>Ada Lovelace — Frontend Developer CV</title>
  <meta name="description" content="Frontend developer con 5 años en React y TypeScript. Lideré migraciones y optimizaciones de performance.">

  <!-- Canonical -->
  <link rel="canonical" href="https://adalove.dev/cv">

  <!-- Open Graph -->
  <meta property="og:title" content="Ada Lovelace — Frontend Developer">
  <meta property="og:description" content="CV de Ada: React, TypeScript, 5 años de experiencia.">
  <meta property="og:image" content="https://adalove.dev/cv-cover.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="https://adalove.dev/cv">
  <meta property="og:type" content="profile">
  <meta property="og:locale" content="es_AR">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@adalove">
  <meta name="twitter:image" content="https://adalove.dev/cv-cover.jpg">
</head>
```

Probá en https://metatags.io/. Deberías ver preview de cómo se ve en WhatsApp, Twitter, Facebook, LinkedIn.
