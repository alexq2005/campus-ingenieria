# Módulo 13 — Proyecto Final (Capstone)

> *"The best way to learn is to build something real."*

---

## 13.1 Objetivo

Construir una **aplicación web production-ready** que integre TODO lo aprendido en el curso:

- HTML semántico + accesibilidad.
- CSS moderno (Flex/Grid/responsive/variables).
- TypeScript + React.
- Consumo de API real.
- Routing con React Router.
- State management (Context o Zustand).
- Testing con Vitest.
- Linting (ESLint + Prettier).
- Deploy automatizado con CI/CD.
- Performance ≥ 90 en Lighthouse (mobile).
- Accesibilidad ≥ 95.
- SEO ≥ 95.

**Tiempo estimado:** 20–40 horas según experiencia.

---

## 13.2 Elegí UN proyecto

Elegí **uno** de estos (o proponé el tuyo). Cuanto más conectado a un problema real tuyo, mejor.

### Opción A — **Taskflow** (gestor de proyectos estilo Trello)
Kanban con columnas drag-and-drop, múltiples boards, invitar usuarios, dark mode, etiquetas, búsqueda, filtros. Backend: Firebase o Supabase.

### Opción B — **Biblia Personal** (biblioteca de libros)
CRUD de libros, buscador por título/autor, estado (leído/leyendo/por leer), puntuación, notas, integración con OpenLibrary API para enriquecer datos (ISBN → portada + metadata).

### Opción C — **Pomodoro Pro**
Temporizador Pomodoro con estadísticas, metas diarias, notificaciones, modo focus con bloqueo de pestañas (Web APIs), histórico de sesiones (IndexedDB), reportes semanales con gráficos (Chart.js).

### Opción D — **Movie Tracker**
Buscador de películas (TMDB API), watchlist, películas vistas con rating, recomendaciones basadas en géneros. Páginas SEO-friendly de detalle por película.

### Opción E — **Portfolio personal**
Tu propio portfolio con:
- Hero animado.
- Proyectos con case studies detallados.
- Blog técnico con MDX.
- Contacto con formulario (EmailJS o similar).
- 100/100/100/100 en Lighthouse.

### Opción F — **Weather Dashboard**
App del clima con búsqueda de ciudades, geolocalización, pronóstico de 7 días, gráficos de temperatura/viento/humedad, mapas con OpenStreetMap, PWA offline-first.

### Opción G — **Expense Tracker**
Gestor de gastos personales con categorías, presupuestos mensuales, gráficos (pie + line), exportación a CSV, multi-moneda, importar extracto de banco.

### Opción H — **Tu idea**
Proponé algo que resuelva un problema tuyo o de alguien cercano. A menudo son los mejores proyectos.

---

## 13.3 Stack obligatorio

- **React 19+**
- **TypeScript strict mode**
- **Vite** como build tool
- **React Router** para navegación
- **TanStack Query** o equivalente para server state
- **Tailwind CSS** o CSS modules (elegí)
- **Vitest** + **React Testing Library** para tests
- **ESLint** + **Prettier**
- **Git + GitHub**
- **Vercel** o **Netlify** para deploy

Opcionales recomendados:
- **Zustand** para client state (si es complejo).
- **react-hook-form** + **zod** para formularios con validación tipada.
- **Framer Motion** para animaciones.
- **Radix UI** o **shadcn/ui** para componentes accesibles.

---

## 13.4 Fases del proyecto (semana a semana)

### Semana 1 — Diseño y setup
- [ ] Elegir proyecto y definir scope (MVP claro, **no más de 5 features core**).
- [ ] Wireframes (a mano o en Figma/Excalidraw).
- [ ] Elegir paleta de colores (ej: coolors.co).
- [ ] Inicializar proyecto: `npm create vite@latest ... --template react-ts`.
- [ ] Setup ESLint + Prettier + Git + GitHub.
- [ ] Deploy inicial "Hello world" a Vercel.

### Semana 2 — Estructura y UI base
- [ ] Layout principal (header, main, footer, sidebar si aplica).
- [ ] Sistema de diseño: tokens de color, tipografía, spacing en CSS variables (o Tailwind config).
- [ ] Routing con rutas placeholder.
- [ ] Componentes reutilizables: Button, Input, Card, Modal.
- [ ] Dark mode.
- [ ] Responsive mobile/tablet/desktop.

### Semana 3 — Features core
- [ ] CRUD principal.
- [ ] Integración con API (si aplica) con React Query.
- [ ] Estado persistente (localStorage o backend).
- [ ] Manejo de loading, error, empty states.
- [ ] Validación de formularios.

### Semana 4 — Pulido
- [ ] Tests unitarios (≥ 5 tests de componentes/hooks clave).
- [ ] Accesibilidad pass: axe, teclado, lector de pantalla.
- [ ] Performance pass: Lighthouse ≥ 90 mobile.
- [ ] SEO: meta tags, structured data, sitemap.
- [ ] CI con GitHub Actions (lint + test en cada PR).
- [ ] README completo con screenshots, features, stack, cómo correrlo.
- [ ] Deploy final.

---

## 13.5 Definition of Done (criterios de entrega)

Tu proyecto está "hecho" cuando:

### Código
- [ ] TypeScript strict sin `any` ni `@ts-ignore`.
- [ ] ESLint sin errores.
- [ ] Prettier aplicado.
- [ ] Al menos 5 tests unitarios pasando.
- [ ] README con instrucciones de setup.

### Funcional
- [ ] MVP completamente funcional.
- [ ] Responsive en 3 breakpoints (móvil, tablet, desktop).
- [ ] Estados loading/error/empty manejados en toda vista async.
- [ ] Validación de formularios (si hay).
- [ ] Navegación fluida sin errores en consola.

### Calidad
- [ ] Lighthouse Mobile: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- [ ] Cero errores en axe DevTools.
- [ ] Teclado funcional al 100%.
- [ ] Dark mode + `prefers-color-scheme` + `prefers-reduced-motion`.

### Publicación
- [ ] Git con al menos 20 commits (uso real, no "Initial commit" x15).
- [ ] Deployado en Vercel/Netlify con dominio público.
- [ ] Repo en GitHub con README profesional.
- [ ] CI/CD: cada push dispara tests + deploy.

---

## 13.6 Estructura de carpetas sugerida

```
mi-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── routes/
│   │   ├── Home.tsx
│   │   ├── Dashboard.tsx
│   │   └── NotFound.tsx
│   ├── components/
│   │   ├── ui/                 # primitivos: Button, Input, Card
│   │   ├── layout/              # Header, Footer, Sidebar
│   │   └── features/            # específicos del dominio
│   ├── hooks/
│   │   ├── useLocalStorage.ts
│   │   └── useDebounce.ts
│   ├── lib/
│   │   ├── api.ts                # cliente HTTP
│   │   └── utils.ts
│   ├── stores/
│   │   └── useAuthStore.ts       # Zustand o Context
│   ├── types/
│   │   └── index.ts
│   ├── styles/
│   │   └── globals.css
│   └── tests/
│       └── setup.ts
├── .github/workflows/
│   └── ci.yml
├── .eslintrc.js
├── .prettierrc.json
├── tsconfig.json
├── vite.config.ts
├── package.json
└── README.md
```

---

## 13.7 README template

Guardá este template:

```markdown
# [Nombre del proyecto]

> [One-liner descriptivo]

![Screenshot](./docs/screenshot.png)

🔗 **Demo**: https://tuapp.vercel.app

## ✨ Features

- Feature 1
- Feature 2
- Feature 3

## 🛠️ Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- TanStack Query
- React Router
- Vitest

## 🚀 Correr localmente

```bash
git clone https://github.com/tu-user/tu-app.git
cd tu-app
npm install
npm run dev
```

## 📏 Métricas

- Lighthouse Mobile: 98/100/100/100
- Bundle size (gzipped): XX KB

## 📁 Estructura

[breve]

## 🧪 Tests

```bash
npm test
```

## 📝 Licencia

MIT
```

---

## 13.8 Evaluación (si te autoimpones disciplina)

Autoevaluación honesta, 100 puntos:

| Categoría | Puntos |
|-----------|--------|
| Código limpio + TS estricto | 20 |
| Funcionalidad MVP completa | 20 |
| Tests (≥5, útiles) | 10 |
| Accesibilidad (a11y ≥ 95) | 10 |
| Performance (perf ≥ 90) | 10 |
| SEO + meta | 5 |
| Diseño visual + UX | 10 |
| README + docs | 5 |
| Git hygiene (commits, branches) | 5 |
| Deploy + CI | 5 |
| **Total** | **100** |

Aprobación: ≥ 70.
Distinction: ≥ 90.

---

## 13.9 Cómo mostrarlo

1. **LinkedIn**: post con captura + link al demo + link al repo.
2. **GitHub**: pineá el repo en tu perfil.
3. **Portfolio**: agregalo como case study (el "por qué", el "cómo", decisiones técnicas).
4. **Entrevistas**: la primera pregunta técnica siempre puede ser "contame un proyecto tuyo". Este es el tuyo.

---

## 13.10 ¿Ya terminaste?

🎉 **Felicitaciones.** Completaste un curso universitario de frontend. Ahora sos un desarrollador frontend funcional.

### Próximos pasos (lifetime learning)

- Profundizá en **un framework**: Next.js, Remix, Astro, SvelteKit.
- **Testing avanzado**: Playwright para E2E.
- **Backend**: Node + Express / Fastify, o serverless (Cloudflare Workers, Vercel Functions).
- **Databases**: PostgreSQL, SQLite, MongoDB.
- **DevOps básico**: Docker, Linux, Nginx.
- **Animation**: Framer Motion, GSAP, Three.js si querés WebGL.
- **Sistemas de diseño**: Storybook, documentación, Figma.
- **Contribuir a open source**: buscá un "good first issue" en un proyecto que uses.

### Comunidades recomendadas

- **Dev.to** — blogs técnicos.
- **Hacker News** — tendencias.
- **Reddit**: r/reactjs, r/webdev, r/programming.
- **Discord**: Reactiflux, The Programmer's Hangout.
- **Twitter/X**: seguí a Kent C. Dodds, Dan Abramov, Josh Comeau, Sara Soueidan, Heydon Pickering, Sarah Drasner, Una Kravets.

---

**Ver también:** [Recursos](../recursos/)
