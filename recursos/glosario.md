# Glosario — 100+ términos del curso

> Consulta rápida de vocabulario. Alfabético. Lectura de 10 min.

## A

**A11y** — Abreviatura de "accessibility" (hay 11 letras entre la "a" y la "y"). Conjunto de prácticas para que todos puedan usar tu app: personas ciegas, sordas, con movilidad reducida, sin mouse.

**ABI** (Application Binary Interface) — Poco relevante en frontend, pero cuando integrás WebAssembly aparece.

**Absolute positioning** — `position: absolute`. Saca al elemento del flujo; se posiciona relativo al ancestro posicionado más cercano.

**Ajax** — *Asynchronous JavaScript and XML*. Término de los 2000s para decir "cliente hace requests en background sin recargar la página". Hoy usamos fetch; el nombre quedó.

**API** (Application Programming Interface) — Contrato entre dos piezas de software. En web, usualmente referencia a endpoints HTTP JSON.

**Arrow function** — `() => {}`. Función con sintaxis corta y `this` heredado del scope exterior.

**Async/await** — Azúcar sintáctico sobre Promises. Permite escribir código asíncrono que se lee como sincrónico.

**Atomic commits** — Commits de Git que representan un cambio único y coherente.

**Axe** — Librería/extensión para auditar accesibilidad automáticamente.

## B

**Babel** — Compilador JS → JS. Convierte código moderno (ES2023) a versiones viejas para soportar navegadores antiguos.

**Bucle de eventos (event loop)** — Mecanismo por el cual JavaScript (single-threaded) procesa callbacks asincrónicos sin bloquear.

**Bundler** — Herramienta que junta muchos archivos JS/CSS/assets en pocos bundles optimizados. Ejemplos: Vite, Webpack, Rollup, esbuild.

**Box model** — Modelo que describe cada elemento como: content + padding + border + margin.

## C

**Cache busting** — Cambiar el nombre del archivo (`main-abc123.js`) para forzar al navegador a descargarlo de nuevo.

**Cascada (cascade)** — El algoritmo de CSS que resuelve conflictos entre reglas: origen > especificidad > orden.

**CDN** (Content Delivery Network) — Red de servidores distribuidos geográficamente que sirven assets estáticos rápido. Ejemplos: Cloudflare, Fastly.

**CI/CD** (Continuous Integration / Continuous Deployment) — Pipeline que automáticamente testea y despliega cada cambio. GitHub Actions, GitLab CI.

**CLS** (Cumulative Layout Shift) — Core Web Vital. Mide cuánto "salta" visualmente tu página mientras carga. Objetivo: ≤ 0.1.

**Client-side rendering (CSR)** — El HTML se construye en el navegador con JavaScript. React "normal" hace esto.

**Closure** — Función que recuerda las variables del scope donde fue creada, incluso después de que ese scope termine.

**Code splitting** — Dividir el bundle en chunks que se cargan solo cuando se necesitan. En React: `React.lazy`.

**Component** — Pieza reutilizable de UI. En React, una función que retorna JSX.

**CommonJS** — Sistema de módulos viejo de Node (`require`/`module.exports`). Hoy reemplazado por ES Modules (`import`/`export`).

**Content-Security-Policy (CSP)** — Header HTTP que controla qué recursos el navegador puede cargar. Defensa contra XSS.

**Controlled component** — En React, un input cuyo valor está en el state de React, no en el DOM.

**Cookie** — Datos guardados por el servidor en el navegador. Se envían automáticamente en cada request al mismo dominio.

**CORS** (Cross-Origin Resource Sharing) — Mecanismo por el cual los navegadores bloquean requests entre dominios salvo que el servidor lo permita con headers específicos.

**CRUD** — Create, Read, Update, Delete. Las 4 operaciones básicas de datos.

**CSS-in-JS** — Escribir CSS dentro de JS. Librerías: Emotion, styled-components. En 2026 pierde terreno frente a Tailwind y CSS modules.

**Custom hook** — En React, una función cuyo nombre empieza con `use` y reutiliza lógica entre componentes.

## D

**Debouncing** — Patrón para demorar una función hasta que "para" de dispararse un evento. Ej: esperar a que el usuario termine de tipear antes de buscar.

**Declarative** — "Describís el QUÉ, no el CÓMO". React es declarativo; jQuery era imperativo.

**Deferred script** — `<script defer>` — descarga en paralelo, ejecuta después del HTML.

**Dependency array** — En `useEffect(fn, [dep1, dep2])`, el array que define cuándo re-ejecutar el efecto.

**DevTools** — Herramientas de desarrollo del navegador (F12). Tu microscopio.

**DNS** (Domain Name System) — Convierte nombres (`google.com`) en IPs (`142.250.190.14`).

**DOM** (Document Object Model) — Árbol vivo de objetos que representa el HTML en memoria.

**DX** (Developer Experience) — Qué tan bueno es programar con una herramienta. Frase de moda.

## E

**ECMAScript** — El estándar oficial de JavaScript. "ES6 = ES2015" es la revisión más importante.

**Event bubbling** — Fase de propagación del target hacia arriba (document).

**Event capture** — Fase de propagación del document hacia el target.

**Event delegation** — Patrón: un solo listener en un padre en vez de N en cada hijo.

**Event loop** — Ver "Bucle de eventos".

**Exports / imports** — Sintaxis de ES Modules para compartir código entre archivos.

## F

**FCP** (First Contentful Paint) — Cuándo se pinta el primer contenido (texto, imagen).

**Fetch API** — API moderna del navegador para hacer requests HTTP. Devuelve Promise.

**FID** (First Input Delay) — Web Vital *antiguo* (reemplazado por INP en 2024).

**Flexbox** — `display: flex`. Layout unidimensional.

**FOUC** (Flash of Unstyled Content) — Cuando el HTML se muestra antes de que cargue el CSS. Feo.

**Fragment** (React) — `<>...</>`. Permite devolver múltiples elementos sin un wrapper extra.

**Framework vs Library** — Framework impone estructura ("llámame"); librería se usa ("yo te llamo"). React se autodescribe como librería.

## G

**Generics** (TypeScript) — Tipos parametrizados, como funciones de tipos. `Array<T>`, `Promise<T>`.

**Git** — Sistema de control de versiones.

**Grid** — `display: grid`. Layout bidimensional.

## H

**Hoisting** — Comportamiento de JS de "mover" declaraciones al tope del scope. `var` se hoistea, `let`/`const` no (pero viven en "temporal dead zone").

**HMR** (Hot Module Replacement) — Reemplazar código en el navegador sin recargar la página. Vite lo hace.

**HTTP/HTTPS** — Protocolo de la Web. HTTPS es HTTP cifrado con TLS.

**Hydration** — Cuando HTML pre-renderizado (SSR) se "activa" al ejecutar JS en el cliente.

## I

**Idempotente** — Operación que, ejecutada N veces, produce el mismo resultado que 1 vez. `GET` es idempotente, `POST` no.

**Immutability** — No mutar datos; crear copias nuevas. Base de React, Redux, Immer.

**INP** (Interaction to Next Paint) — Web Vital: tiempo desde que el usuario interactúa hasta que se ve el siguiente frame. Objetivo: ≤ 200ms.

**Intersection Observer** — API del navegador para detectar cuándo un elemento entra/sale del viewport. Base de lazy loading e infinite scroll.

**ISR** (Incremental Static Regeneration) — Feature de Next.js: regenera páginas estáticas en background.

## J

**JSON** (JavaScript Object Notation) — Formato de datos. Derivado de JS pero hoy es universal.

**JSX** — HTML-like adentro de JS. Se compila a `React.createElement()`.

**JWT** (JSON Web Token) — Token firmado para auth. Payload en base64.

## L

**LCP** (Largest Contentful Paint) — Core Web Vital: cuándo aparece el elemento más grande del viewport. Objetivo: ≤ 2.5s.

**Lazy loading** — Cargar recursos solo cuando se necesitan. `loading="lazy"` en imágenes.

**Linter** — Herramienta que detecta errores y anti-patrones. ESLint.

**localStorage** — Storage del navegador que persiste entre sesiones. 5 MB aprox.

**LTS** (Long Term Support) — Versión de Node.js con soporte extendido (2.5 años).

## M

**Memoization** — Cachear resultados de una función. `useMemo`, `useCallback` en React.

**Middleware** — Función que procesa un request antes de llegar a su handler final.

**Minification** — Comprimir código sacando espacios, acortando variables, etc.

**Module (ES)** — Archivo JS con `import`/`export`. Scope propio, strict mode automático.

**Monorepo** — Múltiples paquetes en un solo repo (ej: pnpm workspaces, Nx, Turborepo).

## N

**Node.js** — Runtime de JavaScript fuera del navegador. Basado en V8.

**npm** — Node Package Manager. También el registry público.

**npx** — Ejecuta un paquete npm sin instalarlo global.

**Null vs undefined** — `null` es "valor intencional vacío"; `undefined` es "nunca asignado".

## O

**OAuth** — Protocolo de autorización estándar ("Login con Google").

**Optional chaining** (`?.`) — `user?.name?.first` — si algo es null/undefined, devuelve undefined sin explotar.

**Origin** — `protocolo://dominio:puerto`. Base de same-origin policy.

## P

**Package.json** — Manifiesto del proyecto Node. Dependencias, scripts, metadata.

**Polyfill** — Código que agrega una feature moderna a navegadores viejos.

**Prefetch / Preconnect / Preload** — Hints al navegador para adelantar carga de recursos.

**Prettier** — Formateador de código. Decide por vos, termina discusiones.

**Primitive** (JS) — Valores inmutables: string, number, boolean, null, undefined, symbol, bigint.

**Progressive enhancement** — Construir para lo básico que funcione en todos lados, luego mejorar.

**Promise** — Objeto que representa un valor futuro. Estados: pending, fulfilled, rejected.

**Prop drilling** — Pasar props a través de muchos niveles de componentes. Usualmente síntoma de que necesitás Context o state management.

**Props** (React) — Argumentos de un componente.

**Prototype** — Mecanismo de herencia de JS. Las clases son azúcar sobre esto.

**PWA** (Progressive Web App) — Web app que funciona offline, se instala como app nativa, recibe notificaciones push.

## Q

**Query parameters** — Parte después de `?` en una URL: `/buscar?q=react&page=2`.

## R

**React** — Librería de UI. Componentes + estado reactivo.

**Reducer** — Función `(state, action) => newState`. Base de Redux y `useReducer`.

**Reflow** — Sinónimo de Layout.

**Responsive design** — Sitio que se adapta a distintos tamaños de pantalla.

**REST** — Estilo de API basado en HTTP + recursos + verbos. Alternativa a RPC, GraphQL.

**Root** (HTML/CSS) — `<html>`. Las variables `:root` se definen en él.

**RxJS** — Librería de programación reactiva. Muy poderosa, curva de aprendizaje alta.

## S

**SemVer** (Semantic Versioning) — `MAJOR.MINOR.PATCH`.

**Selector** (CSS) — Expresión que apunta a elementos HTML.

**SEO** (Search Engine Optimization) — Que Google te encuentre y muestre bien.

**Service Worker** — Script que corre en background. Habilita PWAs, offline, push.

**Shadow DOM** — DOM encapsulado. Base de Web Components.

**SPA** (Single Page Application) — App que carga un solo HTML y navega via JS. React "clásico".

**SSR** (Server-Side Rendering) — El HTML se renderiza en el servidor. Next.js, Remix.

**SSG** (Static Site Generation) — El HTML se pre-genera en build time. Ideal para blogs.

**Strict mode** (JS) — `'use strict'`. Hace que errores silenciosos exploten.

**Symbol** — Tipo primitivo único. Útil para IDs privados.

## T

**Tailwind** — Framework CSS utility-first. `class="flex gap-4 p-2"`.

**TanStack Query** — Librería para server state en React (antes "React Query").

**Template literal** — `` `Hola ${nombre}` ``.

**Throttling** — Limitar la frecuencia con que se ejecuta una función (ej: 1 vez por segundo).

**TLS** — Protocolo de cifrado. TLS 1.3 es el actual.

**Transpiler** — Compilador de un lenguaje a otro al mismo nivel (JS → JS, TS → JS).

**TypeScript** — JavaScript con tipos estáticos.

## U

**UI / UX** — User Interface / User Experience.

**Unicode** — Estándar universal de caracteres. UTF-8 es una codificación de Unicode.

**Union type** (TS) — `string | number` — puede ser uno u otro.

**Unknown** (TS) — Como `any` pero seguro: obliga a narrowing antes de usar.

## V

**Vite** — Build tool moderno. Dev server ultra rápido.

**Virtual DOM** — Representación ligera del DOM en memoria. React compara vs el real y aplica cambios mínimos.

**Viewport** — Área visible del navegador. `meta viewport` es crítico para responsive.

## W

**WCAG** (Web Content Accessibility Guidelines) — Estándar oficial de accesibilidad. Nivel AA es el target.

**Web Vitals** — Métricas de Google para UX real. LCP, INP, CLS.

**Webpack** — Bundler legacy. Potente pero lento. Hoy muchos migran a Vite.

**Whitespace collapse** — HTML colapsa múltiples espacios/saltos en uno solo (por default).

## X

**XHR** (XMLHttpRequest) — La API vieja para requests HTTP. Reemplazada por fetch.

**XSS** (Cross-Site Scripting) — Ataque por inyección de código. Principal defensa: `textContent` en vez de `innerHTML`.

## Z

**Z-index** — Orden en el eje Z (apilamiento). Solo funciona en elementos posicionados.

**Zustand** — Librería de state management minimalista.

---

*¿Falta algo importante? Agregalo a tu fork del curso.*
