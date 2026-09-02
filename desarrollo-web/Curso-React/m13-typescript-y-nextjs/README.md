# Módulo 13 — TypeScript + Next.js 15

> ⏱ ~80 min · Pre-req: Todo el curso anterior

📖 **[Leer la lección (lecture.html)](./lecture.html)**

## Qué cubre

El stack profesional 2026: TypeScript strict + Next.js 15 con App Router y Server Components.

## TypeScript con React

- En 2026 NO es opcional para apps profesionales.
- Tipar props: `type Props = { nombre: string; edad?: number }`.
- `children: ReactNode`. useState con genéricos: `useState<User | null>(null)`.
- Event handlers: `React.ChangeEvent<HTMLInputElement>`, `React.FormEvent<HTMLFormElement>`.
- Custom hooks genéricos: `useLocalStorage<T>(key, initial): [T, (v: T) => void]`.
- Activar `strict: true` siempre. Evitar `any`.

## Next.js 15

- Framework fullstack sobre React. App Router (file-based routing).
- **Server Components** (default): corren en server, DB queries directas, NO usan hooks. Su JS no llega al browser.
- **Client Components** (`'use client'`): hooks, eventos, interactividad.
- **Server Actions** (`'use server'`): funciones server llamadas desde el cliente vía form action.
- `layout.tsx`, `loading.tsx`, `error.tsx` por convención.
- Optimizaciones built-in: `next/image`, `next/font`, `next/link`.
- `revalidatePath` invalida cache tras mutation.

## Regla de oro

Default Server, Client solo donde necesitás useState/useEffect/eventos.

## Cuándo Next.js vs Vite

Next.js: SEO, fullstack, deploy Vercel. Vite + RR: SPA pura, extensión, Electron.

**Siguiente:** [M14 — Proyecto Integrador](../m14-proyectos/)
