# Problem Set 12 — Performance, A11y, SEO

## Sección A — Performance audit

1. Corré Lighthouse en 3 sitios: uno tuyo (o uno local), uno grande (amazon.com o similar), y https://web.dev. Anotá:
   - Performance score de cada uno.
   - LCP, INP, CLS.
   - Las 3 recomendaciones principales de cada auditoría.

2. Tomá tu proyecto del módulo 10/11 y:
   - Agregá `loading="lazy"` a todas las imágenes.
   - Convertí imágenes a WebP (squoosh.app).
   - Definí `width` y `height` en cada `<img>`.
   - Reemplazá animaciones de `width`/`height`/`top`/`left` por `transform`.
   - Medí antes/después en Lighthouse.

3. En Vite, generá el reporte de bundle:
```bash
npm i -D rollup-plugin-visualizer
```
   - ¿Cuál es tu dependencia más grande?
   - ¿Podés reemplazarla por algo más liviano (ej: dayjs en vez de moment)?

## Sección B — Accesibilidad

4. Instalá la extensión **axe DevTools**. Escaneá tu proyecto. Arreglá todos los errores críticos y serios.

5. Navegá tu app **sin tocar el mouse**: solo `Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`, flechas. ¿Todo funciona? ¿Podés cerrar modales? ¿El foco siempre es visible?

6. Tomá 5 pares de colores (fondo + texto) de tu app y verificá el contraste en https://webaim.org/resources/contrastchecker/. ¿Cuáles fallan AA?

7. Configurá lectores de pantalla:
   - Windows: instalá NVDA (gratis).
   - Mac: activá VoiceOver (`Cmd+F5`).
   - Navegá 3 páginas de tu proyecto usando solo el lector. ¿Tiene sentido lo que dice?

8. Agregá soporte para `prefers-reduced-motion`: si el usuario lo activa, desactiva todas tus animaciones.

9. Implementá **skip link**: un link "Saltar al contenido principal" que aparece solo al recibir foco. Útil para teclado y lectores.

## Sección C — SEO

10. Para tu proyecto principal:
    - Agregá `<title>` y `<meta description>` a cada página.
    - Agregá Open Graph y Twitter Cards.
    - Probá cómo se ve la preview en https://metatags.io.

11. Creá un `sitemap.xml` con al menos 5 URLs. Creá un `robots.txt` que lo referencie.

12. Agregá **structured data** apropiado:
    - Si tu app es un blog → `Article`.
    - Si es un negocio → `LocalBusiness` y/o `Organization`.
    - Si es un producto → `Product` con `offers` y `aggregateRating`.
    Validá en https://search.google.com/test/rich-results.

13. Implementá una **página 404** prolija con navegación de vuelta al home.

## Sección D — Mobile

14. Probá tu app en DevTools con device simulation: iPhone SE (320px), iPhone 14, iPad. Todo responsive.

15. Medí Lighthouse en modo **Mobile** (más exigente que Desktop) y apuntá al mismo ≥90 en las 4 categorías.

## Sección E — Proyecto aplicado

16. Tomá un sitio real "malo" que conozcas (muchos sitios gubernamentales, de universidades, de pequeños comercios). Hacé un informe:
    - Lighthouse scores.
    - Top 5 problemas de accesibilidad (axe).
    - Top 5 problemas de SEO.
    - 10 recomendaciones priorizadas por impacto.

## Desafío

17. **PWA (Progressive Web App)**: convertí tu proyecto en PWA con:
    - `manifest.json` (icono, nombre, colores).
    - Service Worker básico (cache-first para assets estáticos).
    - Instalable en móvil.

18. **Critical CSS**: inline el CSS above-the-fold en el `<head>`, el resto en un archivo externo con `media="print" onload="this.media='all'"`.

## Entregable

Un Markdown con los scores antes/después y screenshots. Deploy a producción del proyecto optimizado.
