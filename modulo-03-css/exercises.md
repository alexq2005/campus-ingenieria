# Problem Set 3 — CSS fundamentos

## Sección A — Cálculo de especificidad

Para cada selector, calculá la especificidad en formato `a,b,c,d`:

1. `p`
2. `.btn`
3. `#header`
4. `ul li a`
5. `nav .link:hover`
6. `#main article.post h2`
7. `a[href^="https"]`
8. `input:not([type="submit"])`

Ordená de menor a mayor especificidad.

## Sección B — Debugging

9. En este CSS, el `<h1>` sigue siendo negro. ¿Por qué? Arreglalo **sin usar `!important`**:

```html
<style>
  h1.titulo { color: blue; }
  #pagina h1 { color: black; }
</style>
<div id="pagina">
  <h1 class="titulo">Hola</h1>
</div>
```

10. Este botón no cambia al hacer hover. ¿Error?

```css
button:hover {
  background: red !important;
}
button {
  background: blue;
}
```

(Truco: no hay error en CSS. El problema puede estar en otro lado — revisá orden, especificidad y si hay estilos más específicos).

## Sección C — Box model

11. Un elemento tiene: `width: 300px; padding: 16px; border: 2px solid; margin: 24px;`. Con `box-sizing: content-box`, ¿cuánto mide el "espacio total ocupado" en horizontal? ¿Y con `border-box`?

12. ¿Por qué `margin: 0 auto` centra horizontalmente un elemento block con width definido, pero no funciona con inline? (Pensá el modelo de flujo).

## Sección D — Construcción

13. **Construí una "tarjeta de perfil"** (`tarjeta.html` + CSS inline en `<style>`):
    - Width máximo 320px.
    - `box-sizing: border-box`.
    - Variables CSS para colores (mínimo: `--primary`, `--text`, `--surface`, `--border`).
    - Foto circular (border-radius 50%).
    - Nombre (h2), rol (p muted).
    - Botones "Seguir" y "Mensaje" con `:hover` (cambio de color y micro-transform de -1px).
    - Sombra sutil.
    - **Soporte dark mode** con `@media (prefers-color-scheme: dark)`.

14. **Sistema tipográfico fluido**. Usá `clamp()` para que:
    - `h1` vaya de 1.8rem (móvil) a 3rem (desktop).
    - `h2` de 1.4rem a 2.25rem.
    - `p` quede en 1rem fijo pero con `max-width: 65ch`.
    - Line-height: 1.2 para headings, 1.6 para párrafos.

## Sección E — Selectores avanzados

15. Escribí el selector CSS correcto para cada situación:
    - Todos los `<input>` inválidos que no estén vacíos.
    - El primer `<li>` de cada `<ul>`.
    - Los pares (2°, 4°, 6°...) de una lista.
    - Cualquier `<a>` que abra un PDF (`href` que termina en `.pdf`).
    - Un `<h2>` que tenga un `<img>` como hijo directo.
    - Cualquier enlace externo (que empiece con `http`).

## Desafío

16. **Reimplementá el botón de "like" de Twitter** (solo CSS, sin JS): un corazón que al hover crece suavemente, y al click (via `:active` o mediante un `<input type="checkbox">` hackeado) se pone rojo con un pulso de animación. Usá `@keyframes`.

17. **CSS-only dropdown**: menú desplegable que aparece al hacer hover (o focus, por a11y) en un botón — sin JavaScript. Usá el combinador `+` o `~` con `:focus-within`.

## Entregable

Creá una carpeta `ps3/` con los archivos `tarjeta.html`, `tipografia.html`, `like.html`, `dropdown.html`. Subilos a GitHub.
