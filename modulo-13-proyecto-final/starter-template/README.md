# Capstone Starter — CS-FE

Scaffold listo para empezar tu proyecto final sin perder tiempo en setup.

## Stack

- **React 19** + **TypeScript strict**
- **Vite 6** (build + HMR)
- **React Router 7** (navegación)
- **TanStack Query 5** (server state)
- **Zustand** (client state global, opcional)
- **Vitest** + **Testing Library** (tests)
- **ESLint** + **Prettier** (calidad)
- **GitHub Actions** (CI)

## Cómo arrancar

```bash
cd starter-template
npm install
npm run dev
```

Abrí http://localhost:5173.

## Scripts

| Comando | Qué hace |
|---------|----------|
| `npm run dev` | Dev server con HMR |
| `npm run build` | Build de producción → `dist/` |
| `npm run preview` | Preview del build |
| `npm run lint` | Corre ESLint |
| `npm run format` | Corre Prettier sobre todo |
| `npm test` | Tests en modo watch |
| `npm run test:run` | Tests una vez (para CI) |
| `npm run test:ui` | Interfaz web de Vitest |

## Estructura

```
starter-template/
├── index.html                # entry HTML
├── vite.config.ts
├── tsconfig.json             # strict + noUncheckedIndexedAccess
├── eslint.config.js
├── .prettierrc.json
├── .github/workflows/ci.yml  # lint + build + tests en cada push
└── src/
    ├── main.tsx              # monta React + Providers
    ├── App.tsx               # routing
    ├── routes/               # páginas
    │   ├── Home.tsx
    │   ├── About.tsx
    │   └── NotFound.tsx
    ├── components/           # UI reutilizable
    │   ├── Counter.tsx
    │   ├── Counter.test.tsx  # ← ejemplo de test
    │   └── ThemeToggle.tsx
    ├── hooks/
    │   ├── useLocalStorage.ts
    │   └── useDebounce.ts
    ├── lib/
    │   └── api.ts            # cliente HTTP tipado
    ├── types/
    └── styles/
        └── globals.css       # tokens + reset + base
```

## Features ya integradas

✓ Dark mode con `data-theme` + `prefers-color-scheme` + toggle
✓ Design tokens en CSS variables
✓ Foco accesible visible (`:focus-visible`)
✓ Respeta `prefers-reduced-motion`
✓ Alias `@/` → `src/`
✓ Cliente `api` con `AbortController`-ready
✓ CI con GitHub Actions

## Checklist para arrancar tu capstone

1. [ ] Clonar este template en un repo nuevo.
2. [ ] `npm install`.
3. [ ] Cambiar `name` en `package.json` y el `<title>` en `index.html`.
4. [ ] Reemplazar meta tags Open Graph con datos reales.
5. [ ] Borrar las rutas de demo, agregar las tuyas.
6. [ ] Definir tipos en `src/types/`.
7. [ ] Configurar `VITE_API_URL` en `.env.local`.
8. [ ] Primer commit + push a GitHub.
9. [ ] Conectar a Vercel/Netlify.
10. [ ] Correr Lighthouse y empezar a optimizar.

## Deploy a Vercel

```bash
npm i -g vercel
vercel
```

O conectá el repo desde https://vercel.com/new — detecta Vite automáticamente.
