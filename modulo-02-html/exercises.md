# Problem Set 2 — HTML semántico

## Sección A — Refactor

1. Tomá este HTML "antiguo" y reescribilo con **etiquetas semánticas HTML5** correctas:

```html
<div class="header">
  <div class="logo">Mi Tienda</div>
  <div class="nav">
    <div><a href="/">Inicio</a></div>
    <div><a href="/productos">Productos</a></div>
  </div>
</div>
<div class="content">
  <div class="post">
    <div class="title">Nuevo producto</div>
    <div class="date">20/04/2026</div>
    <div class="body">Lorem ipsum...</div>
  </div>
  <div class="sidebar">Ofertas del día</div>
</div>
<div class="footer">© 2026</div>
```

Reglas: cero `<div>` si se puede evitar, headings correctos, `<time>` con `datetime`.

## Sección B — Validación de accesibilidad

2. Detectá los **6 errores** de accesibilidad en este fragmento y corregilos:

```html
<html>
<head><title></title></head>
<body>
  <h1>Bienvenido</h1>
  <h4>Sobre nosotros</h4>
  <img src="team.jpg">
  <div onclick="alert('hola')">Cliqueame</div>
  <input type="text" placeholder="Tu nombre">
  <a href="javascript:void(0)" onclick="borrar()">Borrar</a>
</body>
</html>
```

## Sección C — Construcción

3. **Construí una página de currículum** (`cv.html`) usando solo HTML semántico (sin CSS propio). Debe tener:
   - `<header>` con tu nombre (`<h1>`), puesto y foto con `alt` descriptivo.
   - `<nav>` con enlaces a las secciones internas (`#experiencia`, `#educacion`, `#contacto`).
   - `<main>` con:
     - `<section id="experiencia">` con al menos 2 trabajos (usá `<article>` por trabajo, con `<time>` para las fechas).
     - `<section id="educacion">` con una `<ul>`.
     - `<section id="habilidades">` con una `<dl>` (término/definición).
   - `<aside>` con una cita que te inspire (`<blockquote>`).
   - `<footer>` con tu email (`mailto:`), GitHub y LinkedIn.
   - Validalo en https://validator.w3.org/#validate_by_input.

4. **Formulario de encuesta** (`encuesta.html`): crea un formulario que pida:
   - Edad (número, 13-120)
   - Email (validación nativa)
   - 3 lenguajes favoritos (checkboxes)
   - Nivel (radio: principiante/intermedio/avanzado)
   - Un color favorito (input color)
   - Un rango de horas de práctica por semana (input range 0-40, mostrando el valor con `<output>`)
   - Comentario (textarea)
   - Botón submit a `https://httpbin.org/post`

## Sección D — Inspección

5. Abrí https://github.com. Con DevTools → Elements → contá:
   - ¿Cuántos elementos `<nav>` hay?
   - ¿Cuántos `<main>`?
   - ¿Cuántos `<h1>`?
   - ¿Qué `lang` declara el `<html>`?

6. Comparalo con https://news.ycombinator.com. ¿Cuál es **menos semántico**? ¿Por qué importa?

## Desafío

7. **Open Graph challenge**: agregá a tu `cv.html` todas las meta tags necesarias para que, si alguien lo comparte por WhatsApp o Twitter, se vea una preview con imagen, título y descripción. Probá en https://metatags.io/.

## Entregable

Subí `cv.html` y `encuesta.html` a un repo de GitHub. Ese es tu primer paso del portfolio.
