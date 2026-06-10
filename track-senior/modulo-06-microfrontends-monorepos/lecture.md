# Módulo S-06 — Micro-frontends & Monorepos

> *"The best architecture is one that scales with your team, not just your traffic."*

---

## S6.0 Por qué este módulo

Cuando una app crece a **múltiples equipos** trabajando en paralelo, el modelo "una sola SPA monolítica" empieza a romper:
- Deploys que bloquean a otros equipos.
- Builds de 20 min cada vez que alguien toca algo.
- Conflictos de merge constantes.
- Dependencias desincronizadas entre equipos.

**Micro-frontends** y **monorepos** son las dos respuestas más usadas. Este módulo te enseña cuándo aplicar cuál — y cuándo NO.

---

## S6.1 El problema de escala que resuelven

### Escenario típico

Empresa con 50 devs frontend, 1 app monolítica. Síntomas:
- Deploy lleva 30 min porque corre todos los tests.
- Equipo A toca el carrito → break del checkout del Equipo B.
- 3 versiones de React en la misma app porque nadie acuerda upgrade.
- Onboarding lleva 2 semanas porque el repo tiene 500 archivos y nadie sabe dónde tocar qué.

### Las 2 soluciones (no exclusivas)

```
┌─────────────────────────────────────────────────────┐
│  MONOREPO                                           │
│  Múltiples paquetes en UN repo                      │
│  Build/deploy unificado o granular                  │
│  Compartís código fácil, atomicidad de cambios      │
│  Tools: Nx, Turborepo, pnpm workspaces, Lerna       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  MICRO-FRONTENDS                                    │
│  Una "app" se compone de múltiples apps deployables │
│  independientemente, posiblemente con stacks distintos│
│  Tools: Module Federation, Single-SPA, iframes      │
└─────────────────────────────────────────────────────┘
```

**No son lo mismo.** Podés tener:
- Monorepo + sola SPA → equipos comparten código pero deploy es uno solo.
- Micro-frontends + multi-repo → cada equipo su repo, deploy independiente.
- **Monorepo + Micro-frontends** → setup de Spotify, Amazon, GitHub.

---

## S6.2 Monorepos — los fundamentos

### ¿Qué es un monorepo?

UN repositorio Git que contiene **múltiples paquetes** relacionados.

```
my-monorepo/
├── package.json (root)
├── packages/
│   ├── ui/                    # design system
│   ├── shared-utils/          # helpers compartidos
│   ├── api-client/            # fetch wrapper tipado
│   └── analytics/             # tracking
└── apps/
    ├── web/                   # SPA principal
    ├── admin/                 # panel de admin
    ├── marketing/             # landing pages
    └── mobile/                # React Native
```

Cada item es un paquete con su `package.json`. Pueden depender entre ellos: `apps/web` importa de `packages/ui`.

### Beneficios

- **Atomic commits**: 1 PR cambia el design system y todas las apps que lo usan.
- **Refactor masivo trivial**: renombrar una función actualiza todos los call sites en el mismo PR.
- **Versions sincronizadas**: una sola versión de React, TypeScript, etc.
- **Tooling centralizado**: lint, prettier, CI configurados una vez.
- **Onboarding**: clone 1 repo, ve toda la org.

### Costos

- **Build inteligente requerido**: si cambiás `packages/ui`, NO querés rebuildear `apps/marketing` que no depende de eso.
- **Permissions**: difícil restringir quién puede tocar qué.
- **Tamaño del repo**: clones grandes (mitigable con sparse checkout).

### Tools

#### pnpm workspaces (mínimo)
```json
// package.json (root)
{
  "name": "my-monorepo",
  "private": true,
  "workspaces": ["packages/*", "apps/*"]
}
```

```bash
pnpm install                          # instala todo
pnpm --filter web dev                  # dev solo de apps/web
pnpm --filter ui build                 # build de packages/ui
```

#### Turborepo (medio)
Pipeline declarativo + caché distribuida.

```json
// turbo.json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],         // antes builda dependencias
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "lint": {}
  }
}
```

```bash
turbo run build --filter=web          # builda web + sus deps
turbo run test --filter='...[main]'   # tests afectados por el último commit
```

Caché remota: Turborepo + Vercel = builds que toman **0 segundos** si nadie cambió las inputs.

#### Nx (avanzado)
Más opinionado, más features:
- Detección automática de cambios afectados.
- Generators para crear nuevas libs/apps con convenciones.
- Visualización del grafo de dependencias.
- Plugins por framework (React, Next, Angular, etc.).

```bash
nx affected:test                       # solo tests de lo que cambiaste
nx graph                               # abre el grafo en el browser
nx generate @nx/react:lib feature-cart # genera nueva lib con tests + lint
```

**Cuándo cuál**:
- 1-3 paquetes: `pnpm workspaces` solo.
- 4-15 paquetes: Turborepo (simple, rápido).
- 15+ paquetes con múltiples frameworks: Nx (toda la artillería).

---

## S6.3 Micro-frontends — los fundamentos

### El concepto

Una página web se compone de múltiples "apps" que cada equipo deploya independientemente.

```
┌────────────────────────────────────────┐
│  HEADER (Equipo Plataforma)            │
├────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────────────┐    │
│  │ SIDEBAR  │  │  CHECKOUT        │    │
│  │ (Equipo  │  │  (Equipo Pagos)  │    │
│  │ Catálogo)│  │                  │    │
│  └──────────┘  └──────────────────┘    │
├────────────────────────────────────────┤
│  FOOTER (Equipo Plataforma)            │
└────────────────────────────────────────┘
```

Cada bloque puede ser:
- React app del Equipo X.
- Vue app del Equipo Y.
- Vanilla JS del Equipo Z.

Y cada uno deploya cuando quiere, sin coordinarse con los demás.

### Estrategias de implementación

#### 1. Iframes
La forma más antigua y aislada.

✅ **Pros**: aislamiento total (CSS, JS, errores no se propagan).
❌ **Contras**: difícil compartir estado, navegación, autenticación. UX limitada.

**Cuándo**: integraciones de terceros, dashboards muy aislados.

#### 2. Build-time integration
Cada equipo publica su componente como package npm. La app principal los importa.

✅ **Pros**: simple, conocido.
❌ **Contras**: deploys NO son independientes — para mostrar la nueva versión hay que rebuildear la app principal.

**Cuándo**: equipos con releases coordinados.

#### 3. Module Federation (Webpack 5+, Vite plugins)
**El estándar moderno**. Cada app expone componentes que otras apps cargan en runtime.

```ts
// host (app principal) - vite.config.ts
import federation from '@originjs/vite-plugin-federation';

export default {
  plugins: [
    federation({
      name: 'host',
      remotes: {
        cart: 'http://cart.miapp.com/assets/remoteEntry.js',
        checkout: 'http://checkout.miapp.com/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom']
    })
  ]
};
```

```ts
// remote (app del equipo Carrito) - vite.config.ts
federation({
  name: 'cart',
  filename: 'remoteEntry.js',
  exposes: {
    './CartButton': './src/CartButton.tsx',
  },
  shared: ['react', 'react-dom']
})
```

```tsx
// host - importás como módulo dinámico
const CartButton = React.lazy(() => import('cart/CartButton'));

function App() {
  return (
    <Suspense fallback="Loading...">
      <CartButton />
    </Suspense>
  );
}
```

✅ **Pros**: deploys totalmente independientes, código compartido (React, etc), sin rebuilds.
❌ **Contras**: complejidad de tooling, debugging cross-app más difícil, contratos de versión a coordinar.

**Cuándo**: empresas grandes con múltiples equipos genuinamente independientes.

#### 4. Single-SPA
Framework para coordinar múltiples SPAs en una página.

```ts
// root config
import { registerApplication, start } from 'single-spa';

registerApplication({
  name: 'cart',
  app: () => System.import('cart-app'),
  activeWhen: ['/cart', '/checkout'],
});

start();
```

✅ **Pros**: agnostic de framework (mezclás React + Vue + Angular).
❌ **Contras**: complejidad, runtime overhead.

**Cuándo**: legacy apps incrementalmente migradas a stacks nuevos.

#### 5. Web Components
Custom elements del browser. Cada equipo expone su componente como `<my-cart>`.

```html
<my-header></my-header>
<my-cart></my-cart>
<my-footer></my-footer>
```

✅ **Pros**: estándar del browser, aislamiento via Shadow DOM.
❌ **Contras**: integración con frameworks tiene gotchas, comunicación entre componentes via custom events.

---

## S6.4 Trade-offs reales: ¿cuándo SÍ y cuándo NO?

### Cuándo NO usar micro-frontends

- Equipo &lt; 20 personas: el overhead supera los beneficios.
- App con UI muy interconectada (ej: editor en vivo): aislar partes rompe UX.
- Stack único + roadmap coordinado: monolito + monorepo basta.
- Performance crítica: cargar múltiples bundles aumenta latency.

### Cuándo SÍ

- Múltiples equipos independientes (5+ teams).
- Releases descoordinadas (cada equipo deploya cuando quiere).
- Legacy migration: querés modernizar incremental.
- Adquisiciones: integrar productos de empresas adquiridas.

### Anti-patrón: micro-frontends prematuro

Equipos de 5 devs implementando Module Federation porque "lo dijo Spotify". Resultado: 6 meses construyendo plumbing en vez de features. **Si no tenés el problema de escala, NO uses la solución de escala**.

---

## S6.5 Shared design system en monorepos

Crítico para consistencia entre apps. Patrones:

### Single source of truth

```
packages/ui/
├── src/
│   ├── tokens/              # design tokens (colors, spacing, typography)
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   └── typography.ts
│   ├── primitives/          # Button, Input, Card
│   ├── patterns/            # Modal, Toast, Form
│   └── index.ts             # public API
```

```ts
// tokens/colors.ts (single source of truth)
export const colors = {
  primary: { 50: '#eff6ff', 100: '#dbeafe', /* ... */ 900: '#1e3a8a' },
  // ...
} as const;
```

Las apps importan SOLO lo que les expone `index.ts`. Lo demás es privado.

### Versionado independiente

```bash
# packages/ui/package.json
{ "version": "2.3.0" }

# apps/web/package.json
{ "dependencies": { "@miapp/ui": "workspace:^2.0.0" } }
```

Si pubilicás breaking change → bump major. Apps actualizan a su ritmo.

### Visual regression con Storybook + Chromatic

Cambio en `<Button>` → Chromatic compara screenshots del story. Si hay diff visual, el PR pide aprobación. Previene cambios sin querer.

---

## S6.6 Compartir estado entre apps independientes

El gran problema de micro-frontends: ¿cómo se comunican?

### 1. Custom Events (mejor para low coupling)

```ts
// app-cart emite
window.dispatchEvent(new CustomEvent('cart:item-added', {
  detail: { productId: 'p1', quantity: 1 }
}));

// app-header escucha
window.addEventListener('cart:item-added', (e) => {
  updateBadge(e.detail);
});
```

✅ Apps no se conocen entre sí.
❌ No hay tipos garantizados. Mejor con un schema shared.

### 2. Shared store (Module Federation)

```ts
// shared/store
export const useGlobalStore = create((set) => ({
  user: null,
  setUser: (u) => set({ user: u }),
}));
```

Cada app importa el mismo store via Module Federation. Riesgo: acoplamiento alto.

### 3. URL como state

Encode estado relevante en query params. Cualquier app que necesita lo lee.

```ts
// app-checkout lee
const params = new URLSearchParams(location.search);
const couponCode = params.get('coupon');
```

✅ Stateless, deep-linkeable, no requiere comunicación entre apps.
❌ Limitado a strings cortos.

### 4. BFF (Backend for Frontend)

Cada equipo tiene su propio BFF que orquesta APIs. El frontend habla con su BFF, sin coordinación entre frontends.

---

## S6.7 Deploys independientes en la práctica

### El flow

```
1. Equipo Cart hace cambio en sus componentes.
2. CI builda → publica al CDN: cart.miapp.com/v123/remoteEntry.js
3. Actualiza el "manifest": { "cart": "v123" }
4. La app principal lee el manifest al cargar.
5. Carga los componentes de la versión actual.
6. Ningún otro equipo se entera ni rebuildea.
```

### Versionado y rollback

- Cada deploy genera URL única (`/v123/`).
- Si el nuevo deploy rompe → cambiás el manifest a `v122`.
- Rollback &lt; 1 min sin redeploy de nada.

### Contracts entre teams

Si Equipo Cart cambia la prop `<CartButton onAdd>` a `<CartButton onAddItem>`, rompe la app principal.

**Solución**: contracts versionados.

```ts
// Equipo Cart expone explícitamente
// packages/cart/contract.ts (versionado, semver)
export type CartButtonV1 = {
  onAdd: (item: Item) => void;
};
export type CartButtonV2 = {
  onAddItem: (item: Item) => void;  // breaking change
};
```

Apps consumidoras pinean a la versión que conocen. Migración coordinada (deprecation period).

---

## S6.8 El stack moderno 2026

| Tamaño del equipo | Recomendación |
|-------------------|---------------|
| 1-5 devs | Monolito. No más. |
| 5-15 devs | Monorepo (pnpm + Turborepo) + monolito. |
| 15-50 devs | Monorepo + monolito O monorepo + micro-frontends light (build-time). |
| 50+ devs / múltiples productos | Monorepo + Module Federation. |
| Adquisiciones / múltiples stacks | Single-SPA o iframes según caso. |

**Default sano para la mayoría**: pnpm workspaces + Turborepo + monolito. Solo escalá la complejidad cuando duela el modelo simple.

---

## 🧑‍🎓 Worked Example — diseñar la arquitectura para una empresa que crece

> Te contratan en una startup que pasó de 8 a 35 devs frontend en 1 año. Tienen 1 SPA React monolítica. Builds toman 8 min, cada deploy bloquea a 3 equipos. Te piden propuesta.

**Mi proceso (como senior consultando):**

### 1. Diagnóstico

- ¿Cuántos features por mes? Si bajan productividad por hora-deploy, problema real.
- ¿Equipos genuinamente independientes o coordinados?
- ¿Ownership de partes claras o todos tocan todo?

Datos del ejemplo: 5 equipos de ~7 devs, areas claras (cart, checkout, search, profile, admin).

### 2. Decisión

**Monorepo + Module Federation light** — NO full micro-frontends.

Razones:
- 35 devs = entra en zona de "micro-fe paga". 
- Equipos áreas claras → independencia tiene sentido.
- Stack unificado (React+TS) → no necesitan single-spa.

### 3. Plan de migración (6 meses)

**Mes 1-2: Monorepo**
- Migrar a pnpm workspaces.
- Extraer `packages/ui`, `packages/utils`, `packages/api-client`.
- Setup Turborepo con caché remota.
- Resultado: builds bajan de 8min a 2-3min.

**Mes 3-4: Module Federation**
- App principal queda como "shell".
- Empezar con 1 feature aislada (admin) → app federada separada.
- Validar que el deploy independiente funciona en staging.

**Mes 5-6: Migración gradual**
- Cart → app federada.
- Checkout → app federada.
- Search y profile quedan en el shell.

### 4. Trade-offs documentados (ADR)

```markdown
# ADR-042: Adoptar Module Federation parcial

## Contexto
35 devs en 5 equipos, builds 8min, deploys bloquean.

## Opciones
1. Monorepo + monolito (pnpm + Turborepo)
2. Monorepo + Module Federation (lo elegido)
3. Multi-repo + micro-frontends (Single-SPA)

## Decisión
Opción 2.

## Consecuencias
+ Builds bajan a 2-3min
+ Deploy independiente para 3 features
+ Code sharing fácil via packages/

- Complejidad nueva en runtime (federation)
- Debug cross-app más difícil
- Necesitamos contracts versionados

## Riesgos
- Versiones de React desincronizadas → mitigación: pin en shared en federation config
- Falla de un remote tira la página → mitigación: error boundary + fallback

## Plan
Migración 6 meses, app por app, métricas de éxito documentadas.
```

### 5. Métricas de éxito

- Build time: 8min → &lt;3min ✅
- Deploys per week: 5 → 25 ✅
- Cross-team conflicts: 3/week → 0 ✅
- Production incidents: tracking nuevo, base de comparación

Eso es senior pensando estratégicamente — no "porque está de moda", sino con costos, beneficios, plan, métricas.

---

## 🧠 Checkpoint Quiz

<details>
<summary><strong>1. ¿Diferencia entre monorepo y micro-frontends?</strong></summary>

- **Monorepo**: estrategia de **código** — múltiples paquetes en un solo repo Git.
- **Micro-frontends**: estrategia de **runtime/deploy** — múltiples apps deployables independientemente.

Pueden combinarse o usarse separadamente. Un monorepo no implica micro-frontends, ni viceversa.
</details>

<details>
<summary><strong>2. ¿Cuándo NO usar micro-frontends?</strong></summary>

- Equipo &lt; 20 personas: overhead supera beneficio.
- App con UI muy interconectada: aislar rompe la UX.
- Stack único, releases coordinados: monolito + monorepo alcanza.
- No tenés el problema de escala: aplicar la solución es over-engineering.

"Spotify lo hace" no es justificación si tu contexto es distinto.
</details>

<details>
<summary><strong>3. ¿Qué problema resuelve Module Federation que iframes no?</strong></summary>

- **Compartir dependencias**: `react`, `react-dom`, design system se cargan UNA vez (con `shared` config).
- **UX integrada**: navegación, theming, focus management funcionan natural (no hay barrera de iframe).
- **Estado compartido**: stores y contexts cruzan entre apps si querés.

Iframes aíslan demasiado. Module Federation es el balance correcto: independencia de deploy + integración de runtime.
</details>

<details>
<summary><strong>4. ¿Cómo manejás versiones de React en Module Federation?</strong></summary>

En el `shared` config, marcás `react` como `singleton: true`:

```ts
shared: {
  react: { singleton: true, requiredVersion: '^19.0.0' }
}
```

Si dos remotes piden versiones incompatibles, Module Federation **te avisa en runtime** (en dev). En prod, mismo: los teams deben coordinar major upgrades.

Sin singleton: terminás con 2 instancias de React → hooks no funcionan correctamente.
</details>

<details>
<summary><strong>5. ¿Por qué Turborepo es más rápido que correr cada paquete individualmente?</strong></summary>

3 razones:

1. **Caché**: si nada cambió en `packages/ui`, no rebuildea — usa el output cacheado.
2. **Caché remota**: el output cacheado se comparte entre developers via Vercel/S3.
3. **Paralelismo inteligente**: corre tareas en paralelo respetando el grafo de dependencias.

Resultado: builds de "todo el monorepo" toman segundos si nadie tocó nada.
</details>

<details>
<summary><strong>6. ¿Qué es un ADR y por qué importa en este contexto?</strong></summary>

ADR = Architecture Decision Record. Documento corto que registra:
- Contexto del problema.
- Opciones consideradas.
- Decisión tomada.
- Consecuencias (pros y cons).

En cambios de arquitectura grandes (como adoptar Module Federation), el ADR previene que el equipo en 6 meses olvide POR QUÉ se decidió y lo cambie sin saber.

Buen senior escribe ADRs. Mejor senior los referencía en code reviews ("esto contradice el ADR-042").
</details>

---

## Resumen ejecutivo

- **Monorepo** ≠ **micro-frontends**. El primero es código, el segundo es runtime/deploy.
- **Default sano**: pnpm workspaces + Turborepo + monolito. Escalá solo si duele.
- **Module Federation** es el patrón moderno de micro-frontends — balance entre aislamiento e integración.
- **Documentá decisiones** con ADRs. La arquitectura cara de revertir necesita memoria escrita.
- **Anti-patrón**: aplicar arquitectura "porque Spotify". Ajustá al contexto real.

## Ejercicios

Ver [`exercises.md`](./exercises.md).

---

**Siguiente módulo:** [`S-07 — API Patterns`](../modulo-07-api-patterns/)
