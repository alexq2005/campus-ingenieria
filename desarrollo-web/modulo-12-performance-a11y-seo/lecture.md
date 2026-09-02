# Módulo 12 — Performance, Accesibilidad y SEO

> *"A fast, accessible, discoverable site is not a bonus — it's the baseline."*

---

## 🎥 Multimedia

**Videos recomendados** — Core Web Vitals, a11y basics, performance tips:
[📺 Playlist del módulo 12 →](../multimedia/videos.html#m12)

**Herramientas online para auditar en vivo:**
- [PageSpeed Insights](https://pagespeed.web.dev) — Lighthouse en la nube, ideal para compartir el score.
- [Rich Results Test](https://search.google.com/test/rich-results) — valida tu structured data.
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) — ratios WCAG.
- [Meta Tags Preview](https://metatags.io) — cómo se ve tu Open Graph en redes.

---

## 12.1 La tríada profesional

Tres disciplinas que los juniors ignoran y los seniors obsesionan:

1. **Performance** — que cargue rápido, sea fluido, no desperdicie batería.
2. **Accesibilidad (a11y)** — que todos puedan usarlo: con teclado, lector de pantalla, mala vista, conexión lenta.
3. **SEO** — que Google y compañía encuentren y entiendan tu contenido.

En 2026, las tres son **requisito**, no "nice to have".

---

## 12.2 Performance

### Core Web Vitals (Google)

Desde 2021, Google usa estas 3 métricas como ranking factor oficial:

| Métrica | Qué mide | Bueno | Mejorable | Malo |
|---------|----------|-------|-----------|------|
| **LCP** (Largest Contentful Paint) | Cuándo aparece el elemento más grande | ≤ 2.5s | 2.5–4s | > 4s |
| **INP** (Interaction to Next Paint) | Latencia de interacciones (reemplazó a FID en 2024) | ≤ 200ms | 200–500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | Cuánto "salta" el layout | ≤ 0.1 | 0.1–0.25 | > 0.25 |

Medí con **Lighthouse** (DevTools) o **PageSpeed Insights** (https://pagespeed.web.dev).

### Optimizaciones de carga

#### 1. **Lazy loading de imágenes**

```html
<img src="foto.jpg" alt="..." loading="lazy" width="600" height="400">
```

`loading="lazy"` → solo descarga cuando está cerca del viewport. Gratis.

**Siempre** poné `width` y `height`: reserva el espacio y evita CLS.

#### 2. **Formatos modernos**

```html
<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" alt="Hero" width="1600" height="900">
</picture>
```

- **AVIF** < **WebP** < JPG/PNG (en tamaño).
- Conversión: `squoosh.app` (gratis, online).

#### 3. **Responsive images**

```html
<img
  src="hero-800.jpg"
  srcset="hero-400.jpg 400w, hero-800.jpg 800w, hero-1600.jpg 1600w"
  sizes="(max-width: 600px) 100vw, 50vw"
  alt="Hero">
```

El navegador elige la versión óptima según viewport y DPR.

#### 4. **Fuentes: evitar FOIT/FOUT**

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter.woff2') format('woff2');
  font-display: swap;    /* muestra fuente de sistema primero, cambia después */
}
```

Preload:
```html
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
```

#### 5. **Critical CSS inline**

El CSS "above the fold" (lo que se ve primero) va inline en `<head>`. El resto se carga async.

#### 6. **`defer` y `async` en scripts**

```html
<script src="app.js" defer></script>  <!-- descarga en paralelo, ejecuta después del HTML -->
<script src="tracker.js" async></script> <!-- ejecuta en cuanto se descarga, orden no garantizado -->
<script type="module" src="app.js"></script>  <!-- equivale a defer -->
```

#### 7. **Preload / prefetch / preconnect**

```html
<link rel="preconnect" href="https://api.example.com">
<link rel="preload" href="/critical.css" as="style">
<link rel="prefetch" href="/proxima-pagina.html">
```

### Optimizaciones de runtime

- **Animá `transform` y `opacity`** (módulo 1).
- `will-change: transform` solo cuando sabés que algo va a animar (no abuses — cada `will-change` cuesta memoria).
- Debounce / throttle en eventos frecuentes (`scroll`, `resize`, `input`).
- Paginación o virtualización para listas largas (librerías: `react-virtual`, `tanstack-virtual`).
- **Code splitting**: cargá JavaScript solo cuando se necesita.

### Code splitting con Vite/React

```jsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./Dashboard'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Dashboard />
    </Suspense>
  );
}
```

### Bundle analyzer

```bash
npm i -D rollup-plugin-visualizer
```

Te muestra el peso de cada dependencia en tu bundle.

### Hosting y CDN

- Usá CDN (Vercel, Cloudflare, Netlify lo hacen automático).
- Activá compresión Brotli/Gzip (también automático en esos hosts).
- Caché agresivo para archivos con hash (`main-abc123.js` puede cachear 1 año).

---

## 12.3 Accesibilidad (a11y)

**WCAG 2.1 AA** es el estándar internacional. En muchos países es obligación legal.

### Los 4 principios POUR

1. **Perceivable** — Todos pueden percibir el contenido.
2. **Operable** — Todos pueden usarlo (teclado, mouse, voz).
3. **Understandable** — El contenido y la operación son comprensibles.
4. **Robust** — Funciona en tecnologías asistivas.

### Checklist mínima

#### HTML semántico (módulo 2)

- Un solo `<h1>`, headings sin saltos.
- `<button>` para acciones, `<a>` para navegación.
- `<label>` asociado a cada `<input>`.
- `<main>`, `<nav>`, `<header>`, `<footer>`.

#### Texto alternativo

```html
<img src="logo.svg" alt="Logo de Acme">       <!-- informativa -->
<img src="divisor.svg" alt="" aria-hidden="true">  <!-- decorativa -->
```

#### Navegación por teclado

- Todo elemento interactivo debe ser **focuseable**.
- El orden de `tab` debe ser lógico.
- Foco **visible** — nunca `outline: none` sin reemplazarlo:

```css
:focus-visible {
  outline: 3px solid #0ea5e9;
  outline-offset: 2px;
}
```

- Atajos comunes: `Tab`/`Shift+Tab` (navegar), `Enter`/`Space` (activar), `Escape` (cerrar modales).

#### Contraste de color

**Mínimo 4.5:1** para texto normal, **3:1** para texto grande (18pt+) y elementos UI.

Herramienta: https://webaim.org/resources/contrastchecker/ o DevTools → Color picker.

#### ARIA (cuando HTML no alcanza)

```html
<!-- Toggle: "botón" hecho con div (mejor usar <button>) -->
<div role="button" tabindex="0" aria-pressed="false"
     onclick="toggle(this)" onkeydown="if(event.key==='Enter')toggle(this)">
  Toggle
</div>

<!-- Estado dinámico -->
<input aria-invalid="true" aria-describedby="email-err">
<p id="email-err">Email inválido</p>

<!-- Live regions (para lectores de pantalla) -->
<div aria-live="polite">Se guardaron los cambios</div>

<!-- Ocultar de lectores, mantener visual -->
<span aria-hidden="true">✨</span>

<!-- Ocultar visualmente, mantener lector -->
<span class="visually-hidden">Cargando</span>
```

```css
.visually-hidden {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
}
```

**Regla de oro**: **no uses ARIA** si hay un elemento HTML nativo. `<button>` > `<div role="button">`.

#### Preferencias del usuario

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

@media (prefers-color-scheme: dark) { /* dark mode */ }
@media (prefers-contrast: more)     { /* alto contraste */ }
```

#### Touch targets

Mínimo **44×44 px** en móvil (WCAG 2.5.5).

### Testing de accesibilidad

- **axe DevTools** (extensión de Chrome/Firefox) — escanea automáticamente.
- **Lighthouse** → Accessibility score.
- **Teclado solo** — intentá usar tu app sin tocar el mouse.
- **Lectores de pantalla**:
  - Windows: NVDA (gratis).
  - Mac: VoiceOver (Cmd+F5, integrado).
  - iOS/Android: VoiceOver / TalkBack.
- **Zoom al 200%** — el layout debe seguir funcionando.

---

## 12.4 SEO (Search Engine Optimization)

### On-page SEO

#### 1. Meta tags esenciales

```html
<title>Título de la página — Marca (50–60 chars)</title>
<meta name="description" content="Descripción convincente, 140–160 chars, incluye keyword principal">

<link rel="canonical" href="https://tudominio.com/pagina">

<meta name="robots" content="index, follow">    <!-- default -->
<meta name="robots" content="noindex, nofollow"> <!-- para páginas privadas -->
```

#### 2. Open Graph + Twitter Cards

```html
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="https://.../cover.jpg">  <!-- 1200×630 ideal -->
<meta property="og:url" content="https://...">
<meta property="og:type" content="article">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="...">
```

Probá en https://metatags.io.

#### 3. Headings bien jerarquizados

- `<h1>` único, con la keyword principal.
- `<h2>`, `<h3>`, `<h4>` en orden.

#### 4. URLs limpias y semánticas

- ❌ `/page?id=12345&cat=7`
- ✅ `/productos/zapatillas-running-hombre`

#### 5. Structured data (JSON-LD)

Schema.org para que Google muestre rich snippets:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Mi artículo",
  "datePublished": "2026-04-23",
  "author": {
    "@type": "Person",
    "name": "Ada Lovelace"
  },
  "image": "https://.../cover.jpg"
}
</script>
```

Tipos comunes: `Article`, `Product`, `Recipe`, `LocalBusiness`, `Event`, `FAQPage`, `BreadcrumbList`, `Organization`.

Validá en https://search.google.com/test/rich-results.

### Técnico

#### Sitemap + robots.txt

```
# /robots.txt
User-agent: *
Allow: /
Sitemap: https://tudominio.com/sitemap.xml
```

```xml
<!-- /sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tudominio.com/</loc>
    <lastmod>2026-04-23</lastmod>
    <changefreq>weekly</changefreq>
  </url>
</urlset>
```

Vercel/Netlify te permiten generarlos automáticamente.

#### SSR / SSG (para SPAs)

Google sí ejecuta JS, pero **prefiere HTML pre-renderizado**. Para SEO serio con React:

- **Next.js** — el framework estándar de React con SSR/SSG.
- **Astro** — ideal para sitios de contenido.
- **SvelteKit**, **Nuxt**, **Remix** — alternativas.

#### Performance como SEO

Google Core Web Vitals = ranking factor. Optimización de performance **es** SEO.

#### HTTPS

Obligatorio. Chrome marca HTTP como "No seguro".

### Content SEO (fuera del scope frontend, pero importante)

- Keyword research (Ahrefs, Semrush, Google Keyword Planner).
- Contenido profundo, útil, original.
- Backlinks de calidad.
- Internal linking.

### Monitoreo

- **Google Search Console** (gratis) — muestra queries, CTR, errores, indexación.
- **Google Analytics 4** (o alternativas como Plausible, Umami).

---

## 12.5 Checklist de lanzamiento

Antes de poner tu sitio en producción:

**Performance**
- [ ] Lighthouse ≥ 90 en Performance.
- [ ] Todas las imágenes con `width`, `height`, `loading="lazy"`, formato moderno.
- [ ] Bundle JS < 200KB gzipped en ruta principal.
- [ ] Fuentes con `font-display: swap`.
- [ ] HTTPS activo.

**Accesibilidad**
- [ ] Lighthouse ≥ 95 en Accessibility.
- [ ] axe DevTools sin errores críticos.
- [ ] Navegable 100% con teclado.
- [ ] Foco visible en todos los elementos.
- [ ] Contraste ≥ 4.5:1.
- [ ] `alt` en todas las imágenes.
- [ ] `lang` en `<html>`.

**SEO**
- [ ] `<title>` y `<meta description>` por página.
- [ ] Open Graph + Twitter Cards.
- [ ] Canonical en cada página.
- [ ] `sitemap.xml` y `robots.txt`.
- [ ] Structured data validado.
- [ ] Google Search Console configurado.

**Otros**
- [ ] Favicon + apple-touch-icon.
- [ ] 404 page prolija.
- [ ] Política de privacidad (si recopilás datos).

---

## 🧑‍🎓 Worked Example

> "Tu app tiene Lighthouse Performance 62 mobile. El CEO te da 1 semana para subirlo a 90+. ¿Por dónde empezás?"

**Mi enfoque, día por día:**

**Día 1 — Medir y priorizar.** Lighthouse + "Opportunities" → ordenar por ms ahorrados. Wins grandes típicos: imágenes sin optimizar (+3-5s LCP), JS bundle inflado (+INP), sin caché/CDN.

**Día 2 — Imágenes** (+15 puntos gratis):
```html
<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" alt="..." width="1600" height="900" fetchpriority="high">
</picture>
```
Below-the-fold: `loading="lazy"`.

**Día 3 — Bundle**: analyzer + reemplazos (`moment` → `date-fns`, `lodash` entero → imports granulares, code splitting con `React.lazy`).

**Día 4 — Fuentes**: `font-display: swap`, preload las críticas, inline critical CSS.

**Día 5 — Red**: CDN, `Cache-Control` agresivo para archivos con hash, preconnect a dominios externos.

**Día 6 — Re-medir**. Usualmente 88-95.

**Día 7 — Detalles**: ajustes finos, `preload` del LCP, reducir TBT.

**Moraleja**: performance es proceso iterativo guiado por métricas. Sin medir, podés empeorar creyendo que mejorás.

## 🧠 Checkpoint Quiz

<details>
<summary><strong>1. ¿Qué métricas componen Core Web Vitals?</strong></summary>

- **LCP** (Largest Contentful Paint) → ≤ 2.5s.
- **INP** (Interaction to Next Paint) → ≤ 200ms. Reemplazó a FID en 2024.
- **CLS** (Cumulative Layout Shift) → ≤ 0.1.

Todas son ranking factor de Google.
</details>

<details>
<summary><strong>2. ¿Por qué <code>&lt;img width height&gt;</code> mejora CLS?</strong></summary>

El navegador reserva el espacio ANTES de descargar la imagen. Cuando la imagen llega, no "empuja" el contenido debajo → CLS baja.

Sin width/height, cada imagen es un salto potencial.
</details>

<details>
<summary><strong>3. ¿Cuál es el contraste AA mínimo?</strong></summary>

- Texto normal: **4.5:1**.
- Texto grande (18pt+ o 14pt bold): 3:1.
- UI components: 3:1.

`#999` sobre blanco = 2.8:1 → falla. `#767676` = 4.54:1 → pasa.
</details>

<details>
<summary><strong>4. ¿Por qué <code>role="button"</code> en un div no es suficiente?</strong></summary>

`role` avisa al screen reader, pero no da:
- Focus por teclado (`tabindex="0"`).
- Enter/Space activation (listener manual).
- Foco visible.

**Usá `<button>`**. Gratis, completo, accesible.
</details>

<details>
<summary><strong>5. ¿Qué meta tags faltan acá?</strong></summary>

```html
<head><title>Mi artículo</title></head>
```

Mínimo faltan **description** y **canonical**:
```html
<meta name="description" content="...">
<link rel="canonical" href="https://midominio.com/articulo">
```

Y ya que estamos, Open Graph + Twitter Card para previews en redes.
</details>

---

## Resumen ejecutivo

- Performance: lazy images, formatos modernos, fuentes bien cargadas, code splitting.
- Web Vitals (LCP, INP, CLS) son ranking factor de Google.
- A11y: HTML semántico, teclado, contraste, `prefers-reduced-motion`.
- SEO técnico: title, description, Open Graph, structured data, sitemap.
- Lighthouse audit antes de cualquier deploy.

## Ejemplos

Ver [`examples/`](./examples/):
- `01-antes-despues.html` — dos páginas iguales, una optimizada.
- `02-structured-data.html` — schema.org en acción.

## Ejercicios

Ver [`exercises.md`](./exercises.md).

---

**Siguiente módulo:** [`13 — Proyecto final`](../modulo-13-proyecto-final/)
