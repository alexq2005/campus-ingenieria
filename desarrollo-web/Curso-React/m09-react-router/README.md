# Módulo 09 — React Router 7

> ⏱ ~55 min · Pre-req: M02, M03

📖 **[Leer la lección (lecture.html)](./lecture.html)**

## Qué cubre

Routing declarativo en SPA: múltiples páginas, navegación con back/forward, deeplinks — sin recargar.

## Conceptos clave

- `BrowserRouter` envuelve la app (History API).
- `<Routes>` + `<Route path="/" element={<Home/>} />`. Ruta `*` = 404.
- **`<Link to>` en vez de `<a href>`**: navegación SPA sin reload.
- `useParams()` para params dinámicos (`/users/:id`).
- `useSearchParams()` para query params (`?q=react`).
- `useNavigate()` para navegación programática (`navigate('/dashboard')`).
- **Layouts anidados** con `<Outlet/>` como slot de rutas hijas.
- Rutas protegidas: wrapper que redirige con `<Navigate to="/login" replace />`.
- `NavLink` con clase activa automática.
- **Loaders** (RR7): cargar datos por URL antes de renderizar (modelo Remix).

## Alternativas 2026

- React Router 7 (SPA), Next.js App Router (fullstack), TanStack Router (type-safe), Wouter (mini).

**Siguiente:** [M10 — Data Fetching](../m10-data-fetching/)
