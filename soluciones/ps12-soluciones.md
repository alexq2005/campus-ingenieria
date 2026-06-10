# Soluciones — PS12: Performance, A11y, SEO

## Sección A — Performance audit

### 1. Audits comparativos

No hay una respuesta "única" porque los scores varían con el tiempo. **Lo que importa** es la metodología:

```bash
# CLI (opcional, más rápido que DevTools para benchmarking)
npm i -g lighthouse
lighthouse https://example.com --view --preset=desktop
lighthouse https://example.com --view --preset=perf --only-categories=performance
```

Targets razonables en 2026:
- Sitio personal estático: 95+ en las 4 categorías (nada te excusa).
- App SaaS con mucho JS: 80+ en performance, 95+ en a11y/SEO.
- Sitios grandes con terceros (analytics, ads): performance puede bajar a 60–70.

### 2. Optimizar tu proyecto

Checklist de cambios que casi siempre suben el score:

```html
<!-- antes -->
<img src="hero.jpg">

<!-- después -->
<img src="hero.webp" alt="..." width="1600" height="900" loading="lazy" decoding="async">
```

```html
<!-- antes (bloquea CSS) -->
<link rel="stylesheet" href="fonts.css">

<!-- después (no bloquea, swap) -->
<link rel="preload" href="fonts.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="fonts.css" media="print" onload="this.media='all'">
```

```css
/* antes — dispara re-layout */
.box:hover { width: 300px; }

/* después — solo composite */
.box:hover { transform: scale(1.2); }
```

Medir antes y después con Lighthouse mobile. Si no mejoró, el problema estaba en otro lado.

### 3. Bundle analyzer

```bash
npm i -D rollup-plugin-visualizer
```

```js
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  plugins: [
    visualizer({ open: true, gzipSize: true, brotliSize: true })
  ]
};
```

```bash
npm run build
# Se abre un treemap en el browser
```

**Sospechosos habituales**:
- `moment` (67 KB) → usar `date-fns` (tree-shakeable) o `dayjs` (2 KB).
- `lodash` entero → importar solo lo que usás: `import debounce from 'lodash/debounce'`.
- `axios` (~35 KB) → si no tiene features que necesitás, `fetch` nativo basta.
- Polyfills innecesarios → verificá `browserslist`.

## Sección B — Accesibilidad

### 4. axe DevTools

Errores que siempre aparecen y cómo arreglarlos:
- **"Elements must have sufficient color contrast"** → subir contraste al 4.5:1 mínimo.
- **"Images must have alternate text"** → agregar `alt="..."` (o `alt=""` si decorativa).
- **"Form elements must have labels"** → `<label for="id">` o `aria-label`.
- **"Buttons must have discernible text"** → `<button>X</button>` O `<button aria-label="Cerrar">×</button>`.
- **"Links must have discernible text"** → nunca `<a>...</a>` vacío.

### 5. Navegación solo por teclado

Checklist:
- `Tab` recorre todos los elementos interactivos.
- El orden es lógico (sigue el flujo visual).
- **Foco visible** — en cada elemento que recibe Tab se nota dónde está.
- `Enter` / `Space` activa botones.
- `Escape` cierra modales/menús abiertos.

Fix universal para el foco visible:

```css
:focus-visible {
  outline: 3px solid #0ea5e9;
  outline-offset: 2px;
  border-radius: 4px;
}
```

### 6. Contraste

Ejemplo típico donde se falla:
- Texto gris claro `#999` sobre blanco → ratio 2.8:1 — **falla AA** (mínimo 4.5:1).
- Fix: usar `#6b7280` (Tailwind gray-500) → 4.69:1, pasa AA.

Herramientas:
- https://webaim.org/resources/contrastchecker/
- DevTools → inspeccionar elemento → color picker muestra el ratio.

### 7. Lectores de pantalla

**NVDA** (Windows, gratis):
- Descargar de https://www.nvaccess.org
- Atajos clave: `H` (siguiente heading), `K` (siguiente link), `B` (siguiente botón).

**VoiceOver** (Mac):
- `Cmd+F5` para activar.
- `VO+→` (Control+Option+→) para avanzar.

Lo que tu app **debe** comunicar bien:
- Cambios dinámicos → `aria-live="polite"` en el contenedor.
- Estados de botones → `aria-pressed`, `aria-expanded`.
- Errores de validación → `aria-invalid` + `aria-describedby` apuntando al mensaje.

### 8. prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Poné esto en tu CSS global. Literalmente 5 líneas que hacen tu sitio usable para gente con vértigo, epilepsia fotosensible, o que simplemente no quiere animaciones.

### 9. Skip link

```html
<a href="#main" class="skip-link">Saltar al contenido</a>
<header>...</header>
<main id="main">...</main>

<style>
  .skip-link {
    position: absolute;
    top: -40px; left: 0;
    background: #000; color: white;
    padding: 8px 16px;
    z-index: 100;
    transition: top 0.2s;
  }
  .skip-link:focus {
    top: 0;   /* aparece solo al recibir foco con Tab */
  }
</style>
```

Primera tecla `Tab` al cargar la página → aparece el skip link. Invisible hasta que hace falta.

## Sección C — SEO

### 10. Meta tags

```html
<head>
  <title>Título único y descriptivo — 50-60 chars</title>
  <meta name="description" content="Descripción convincente de 140-160 chars que incluye la keyword principal.">

  <link rel="canonical" href="https://tudominio.com/esta-pagina">

  <!-- Open Graph -->
  <meta property="og:title" content="Título para compartir">
  <meta property="og:description" content="...">
  <meta property="og:image" content="https://tudominio.com/og-image-1200x630.jpg">
  <meta property="og:url" content="https://tudominio.com/esta-pagina">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="es_AR">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
</head>
```

Validá en https://metatags.io.

### 11. sitemap.xml + robots.txt

`robots.txt` (en la raíz, `/public/robots.txt` en Vite):
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://tudominio.com/sitemap.xml
```

`sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tudominio.com/</loc>
    <lastmod>2026-04-24</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://tudominio.com/sobre</loc>
    <lastmod>2026-04-24</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- ... resto de URLs -->
</urlset>
```

### 12. Structured data

Blog post → `Article`:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Título del post",
  "image": ["https://.../cover.jpg"],
  "datePublished": "2026-04-24",
  "author": [{ "@type": "Person", "name": "Ada Lovelace" }]
}
</script>
```

LocalBusiness:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Mi Negocio",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Av. Corrientes 1234",
    "addressLocality": "Buenos Aires",
    "addressCountry": "AR"
  },
  "telephone": "+54-11-1234-5678",
  "openingHours": "Mo-Fr 09:00-18:00"
}
</script>
```

Validá en https://search.google.com/test/rich-results.

### 13. Página 404 prolija

```html
<main style="text-align:center; padding: 4rem 1rem;">
  <h1 style="font-size: 6rem; margin: 0;">404</h1>
  <p>Esta página se fue de viaje.</p>
  <a href="/" class="btn">Volver al inicio</a>
  <div style="margin-top: 2rem;">
    <h2>O quizás buscabas:</h2>
    <ul style="list-style: none; padding: 0;">
      <li><a href="/productos">Productos</a></li>
      <li><a href="/contacto">Contacto</a></li>
    </ul>
  </div>
</main>
```

En Vercel/Netlify, `404.html` se sirve automáticamente.

## Sección D — Mobile

### 14. Device simulation

DevTools → toggle device toolbar (`Ctrl+Shift+M`). Preset sugerido:
- iPhone SE (375×667) — tests de lo más chico.
- iPhone 14 Pro (393×852) — común.
- iPad (820×1180) — tablet.
- Pixel 7 (412×915) — Android.

Verificá:
- Nada se corta.
- Los tap targets son ≥44px.
- No aparece scroll horizontal.

### 15. Lighthouse Mobile

Mismo audit que desktop pero con throttling CPU 4× más lento y red 3G. **Es más exigente**. Si pasás 90 en mobile, pasás todo.

## Sección E — Proyecto aplicado

### 16. Informe de un sitio malo

Formato profesional:

```markdown
# Auditoría — [nombre del sitio]

## Scores (Lighthouse Mobile)
- Performance: 42/100
- Accessibility: 61/100
- Best Practices: 75/100
- SEO: 83/100

## Top 5 problemas A11y (axe)
1. 23 imágenes sin alt
2. Contraste insuficiente en los botones (2.8:1)
3. Formulario sin labels asociados
4. Heading order rota (h1 → h4)
5. Sin skip link

## Top 5 problemas SEO
1. Sin meta description en 12 páginas
2. Sin Open Graph
3. Sin sitemap
4. Imágenes sin optimizar (6 MB total)
5. Sin structured data

## Recomendaciones (priorizadas por impacto)
1. [CRÍTICO] Agregar alt a todas las imágenes — 1 día de trabajo
2. [CRÍTICO] Subir contraste a AA — 2 horas con contrast checker
3. [ALTO] Convertir imágenes a WebP — reduce 70% tamaño
4. [ALTO] Agregar lazy loading — mejora LCP
5. [MEDIO] Implementar meta description automática
```

Esto es oro puro en un portfolio: demuestra que sabés auditar y priorizar.

## Desafío

### 17. PWA

`public/manifest.json`:
```json
{
  "name": "Mi App",
  "short_name": "MiApp",
  "description": "Mi app instalable",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#0ea5e9",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

En el HTML:
```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#0ea5e9">
```

Service worker básico:
```js
// public/sw.js
const CACHE = 'v1';
const ASSETS = ['/', '/index.html', '/assets/style.css', '/assets/main.js'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
```

```js
// main.js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

### 18. Critical CSS

```html
<head>
  <style>
    /* Critical CSS inline — los estilos above-the-fold */
    body { margin: 0; font-family: system-ui; }
    .hero { height: 100vh; background: #0f172a; }
    /* ... */
  </style>

  <!-- Resto del CSS async (no bloquea el render inicial) -->
  <link rel="preload" href="/main.css" as="style">
  <link rel="stylesheet" href="/main.css" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="/main.css"></noscript>
</head>
```

Para extraer critical CSS automáticamente: herramientas como `critical` (npm) o `penthouse`.

---

**Patrones aprendidos**:
- Performance = medir, cambiar, medir de nuevo. Sin medir no optimices.
- A11y no es "extra" — es baseline. `:focus-visible` + `alt` + `<label>` cubren 80%.
- Structured data es lo que hace que Google muestre tu sitio con estrellas, fotos, precio.
- PWA es gratis — `manifest.json` + Service Worker básico = app instalable.
- Critical CSS + lazy load es la diferencia entre 2s y 4s de LCP.

---

🎓 **Y con esto termina el curso.** Si completaste los 12 problem sets + el proyecto final, sos un desarrollador frontend funcional. Próximo paso: construir algo real, compartirlo, buscar feedback, iterar.
