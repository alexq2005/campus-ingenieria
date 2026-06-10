# Problem Set S-06 — Micro-frontends & Monorepos

## Sección A — Análisis

1. Tomá una empresa que conozcas (o open source: Microsoft, Spotify, Shopify). Investigá:
   - ¿Usa monorepo o multi-repo?
   - ¿Micro-frontends? Si sí, ¿qué estrategia (iframes, MF, Single-SPA)?
   - ¿Qué problemas dice que resuelve?
   - ¿Qué trade-offs aceptaron?

2. Para tu propia situación (proyecto actual o último), respondé:
   - ¿Sufrís de los problemas que resuelven monorepos/MF?
   - ¿Qué evidencia? (tiempos de build, conflictos, incidentes)
   - ¿Justifica el costo de adopción?

## Sección B — Monorepo básico

3. Creá un monorepo desde cero con pnpm workspaces:
   ```
   my-monorepo/
   ├── packages/
   │   ├── ui/           (React component lib)
   │   └── utils/        (helpers TS)
   └── apps/
       ├── web/          (Vite + React)
       └── admin/        (Vite + React)
   ```
   - Ambas apps consumen `@miorg/ui` y `@miorg/utils`.
   - Cambiar una util y verificar que ambas apps reflejan el cambio sin republish.

4. Agregá Turborepo:
   - Pipeline: lint → typecheck → test → build.
   - `dependsOn: ["^build"]` para que las apps esperen a sus deps.
   - Verificá que `turbo run build` cachea (segunda corrida instantánea).

5. **Caché remota**: configurá Turborepo + Vercel para compartir caché entre devs. Hacé que un colega corra `turbo build` y vea hits del caché.

## Sección C — Design system en monorepo

6. En `packages/ui`, construí:
   - Design tokens (colors, spacing, typography) en `tokens/`.
   - 5 primitives: `Button`, `Input`, `Card`, `Modal`, `Badge`.
   - Storybook configurado.
   - Tests con Vitest + RTL.
   - Build output que las apps importan: `@miorg/ui` y `@miorg/ui/css`.

7. **Visual regression**: setup Chromatic. Hacé un cambio sutil al `<Button>` y verificá que el PR pide aprobación visual.

8. **Versionado independiente**: implementá Changesets (`@changesets/cli`).
   - Hacé un cambio breaking en `<Button>`.
   - Generá un changeset.
   - Mergeá → release de `ui@2.0.0`.
   - Apps pinean a `^1.0.0` o suben a `^2.0.0`.

## Sección D — Module Federation

9. Setup mínimo con Vite:
   - **Host**: `apps/shell` que carga remotes.
   - **Remote**: `apps/cart` que expone `<CartButton>`.
   - Verificá: el host carga el componente del remote en runtime.

10. Deploy independiente:
    - Deployar `cart` a `cart.miapp.com/v1/remoteEntry.js`.
    - Deployar `shell` apuntando a esa URL.
    - Cambiar el cart, deploy a `v2`, actualizar manifest sin re-deploy del shell.

11. **Shared dependencies**:
    - Configurar `react`, `react-dom`, `react-router` como `shared` con `singleton: true`.
    - Verificar en DevTools que se carga UNA vez.

12. **Error boundary** alrededor de cada remote:
    - Si `cart` no responde, mostrar fallback en vez de romper toda la página.
    - Logging del error a Sentry con tag del remote afectado.

## Sección E — Comunicación entre micro-frontends

13. Implementá los 3 patrones de comunicación:
    - **Custom events**: `cart:item-added` con typed schema.
    - **Shared store** (zustand via Module Federation): `useGlobalStore` accesible desde cualquier remote.
    - **URL state**: `?coupon=ABC` que cualquier remote puede leer.
    
    Compará: facilidad, acoplamiento, debug-ability.

14. **Contracts versionados**:
    - Cart V1 expone `<CartButton onAdd={fn} />`.
    - Cart V2 cambia a `<CartButton onAddItem={fn} />` (breaking).
    - Implementá: el shell mantiene compatibilidad temporal con ambos hasta que todos consumers migren.

## Sección F — Trade-offs y decisión

15. Para cada escenario, decidí monorepo vs multi-repo, monolito vs micro-frontends:
    - a) Startup 4 devs, 1 producto, MVP.
    - b) Empresa 50 devs, 3 productos relacionados (web app, admin, mobile RN).
    - c) Adquirieron una empresa con stack Vue, ustedes son React, hay que integrar.
    - d) Open source library con 5 maintainers globales.

16. **Anti-patrón paper**: investigá un caso público donde una empresa adoptó MF y se arrepintió (Klarna, ThoughtWorks reports). ¿Qué aprendieron?

## Sección G — DevOps en monorepo

17. **CI inteligente con `turbo affected`**:
    ```yaml
    # .github/workflows/ci.yml
    - run: turbo run test --filter='...[origin/main]'
    ```
    Verificá: si tocás solo `apps/admin`, NO se corren tests de `apps/web`.

18. **Deploy selectivo**:
    - Sistema que detecta qué apps cambiaron en el merge.
    - Solo deploya esas apps a producción.
    - Bonus: matriz GitHub Actions paralelizando deploys.

## Desafío

19. **Micro-frontend production-grade**:
    - Monorepo (Turborepo) con `shell + 3 remotes` (cart, search, profile).
    - Module Federation con shared deps.
    - Cada remote deploya independiente a Vercel/Netlify.
    - Error boundaries con Sentry.
    - Storybook + Chromatic para el design system compartido.
    - CI que solo testea/buildea lo afectado.
    - ADR documentando las decisiones.

20. **Migración hipotética**: tomá una app monolítica (puede ser mock) de 50K líneas. Documentá:
    - Plan de migración a MF en 6 meses.
    - Métricas de éxito (build time, deploy frequency, etc.).
    - Riesgos y mitigaciones.
    - Plan de rollback si la migración falla.

    Esto es lo que un staff engineer escribe en su trabajo.

## Entregable

Repo `cs-fe-senior-s06-monorepo` con:
- Monorepo Turborepo funcionando (ej. 3-4).
- Design system con changesets (ej. 6-8).
- Setup MF con shell + remotes (ej. 9-12).
- ADRs documentando decisiones.
- README con diagrama de la arquitectura.
