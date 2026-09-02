# Problem Set 4 — CSS Layout

## Sección A — Flexbox

1. **Navbar**: construí `navbar.html` con logo a la izquierda, menú (3 links) al centro, y un botón "Login" a la derecha. En móvil (<640px): el menú pasa a columna debajo del logo, el botón queda arriba a la derecha.

2. **Cards iguales de alto**: 3 cards en fila, cada una con título, párrafo de distinto largo, y botón al fondo. Todas deben medir lo mismo de alto, y el botón debe quedar alineado al fondo aunque el texto sea distinto.

3. **Centrado perfecto**: un `<div>` de 300×200px centrado exacto vertical y horizontalmente en la pantalla (viewport completo). Lograrlo en 4 líneas de CSS.

## Sección B — Grid

4. **Calendario**: creá una grilla 7×5 (semanas×días) usando Grid. Cada celda es un `<div>` con un número. Nombres de días arriba con `grid-column` manual. Gap de 4px.

5. **Dashboard**: layout con `grid-template-areas`:
   ```
   "nav header header"
   "nav main  aside"
   "nav main  aside"
   "nav footer footer"
   ```
   - `nav` es 200px fijo; `aside` es 240px; el resto es `1fr`.
   - En móvil (<768px): nav arriba como drawer, main, aside abajo, footer.

6. **Galería masonry-ish** (sin masonry real): 12 imágenes distribuidas en columnas de mínimo 200px con `auto-fit`, `gap: 8px`. Algunas imágenes deben ocupar 2 columnas (usá `grid-column: span 2` selectivamente).

## Sección C — Responsive

7. Abrí tu `cv.html` del PS2. Ahora:
   - Volvélo responsive con Grid + Flexbox.
   - Mobile-first: todo columna única abajo de 640px.
   - Tablet (640–1024px): la foto a la izquierda, nombre/rol a la derecha en el header.
   - Desktop (>1024px): dos columnas de contenido (experiencia | educación+habilidades).

8. Implementá **dark mode** con `prefers-color-scheme` + un toggle manual que sobrescriba con `data-theme="dark"` en `<html>`.

## Sección D — Patterns

9. Replicá este patrón de [Every Layout](https://every-layout.dev): **Sidebar intrínseca**. Una sidebar de 240px a la izquierda y `main` a la derecha que ocupa todo el resto. Cuando no hay espacio, la sidebar pasa arriba automáticamente (**sin media queries**). Pista: `flex-wrap: wrap` + `flex-basis` + `min-inline-size` en main.

10. **Cluster layout** (tags que envuelven): 15 tags con distinto largo, gap de 6px, wrap automático.

## Sección E — Recreación

11. Elegí **una de estas tres páginas** y recreá su layout principal con HTML semántico + Flex/Grid (sin copiar imágenes ni colores, solo el layout):
    - Homepage de [Stripe](https://stripe.com)
    - Homepage de [Apple](https://www.apple.com)
    - Dashboard de [Vercel](https://vercel.com/dashboard) (solo estructura visible)

## Desafío

12. **Holy Grail en 10 líneas**: escribí el Holy Grail layout (header, sidebar, main, aside, footer) en **exactamente 10 líneas de CSS** o menos (sin contar llaves, selectores o vacías). Cronometralo.

13. **Container query**: construí una `<card>` que se re-layout-ee según su contenedor (no el viewport). Si el contenedor es angosto: título arriba, imagen abajo. Si es ancho: imagen izq, contenido der. Reutilizala en una sidebar y en un main para ver la diferencia.

## Entregable

Carpeta `ps4/` con al menos 6 archivos (`navbar.html`, `cards.html`, `dashboard.html`, `cv-responsive.html`, `sidebar-intrinseca.html`, y uno de los ejercicios E/F). Deploy rápido: subí a [GitHub Pages](https://pages.github.com/) o [Netlify Drop](https://app.netlify.com/drop).
