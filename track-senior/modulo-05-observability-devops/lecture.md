# Módulo S-05 — Observability & DevOps

> *"You can't fix what you can't see. You can't ship what you can't measure."*

---

## S5.0 Por qué este módulo

El gap más grande entre mid y senior en producción: **el mid deploya y reza; el senior deploya y mide**.

Senior sabe responder con datos:
- "¿Cuántos usuarios fueron afectados por el bug?"
- "¿La feature A es realmente más rápida?"
- "¿Qué % de errores tiene el endpoint X?"
- "¿El último deploy aumentó el LCP?"

Sin observability, esas preguntas se contestan con "creo que..." — anti-senior.

---

## S5.1 Las 3 patas de observability

```
┌──────────┬──────────────────┬─────────────────────────┐
│  Logs    │ Eventos discretos │ "User X clickeó Y"      │
├──────────┼──────────────────┼─────────────────────────┤
│  Metrics │ Números agregados │ "p99 latency = 320ms"   │
├──────────┼──────────────────┼─────────────────────────┤
│  Traces  │ Path completo de  │ "Request → DB → Cache → │
│          │ una operación     │  Render → 245ms total"   │
└──────────┴──────────────────┴─────────────────────────┘
```

Frontend tradicionalmente solo tenía logs (console). Hoy tenemos las 3 vía:
- **Logs**: Sentry, LogRocket, Datadog
- **Metrics**: Real User Monitoring (RUM), Web Vitals tracking
- **Traces**: OpenTelemetry, Sentry Performance

---

## S5.2 Error tracking con Sentry

El estándar de facto. Captura errores no manejados, stack traces con source maps, breadcrumbs (qué pasó antes), y los muestra agrupados.

### Setup React

```bash
npm i @sentry/react
```

```tsx
// src/main.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  release: import.meta.env.VITE_APP_VERSION,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true }),
  ],
  tracesSampleRate: 0.1,           // 10% de transacciones
  replaysSessionSampleRate: 0.05,  // 5% de sessions
  replaysOnErrorSampleRate: 1.0,   // 100% si hay error
});
```

### Source maps en producción

Sin source maps, el stack trace es ininteligible (variables minificadas).

```bash
# vite.config.ts
build: {
  sourcemap: true,  // genera .map files
}
```

Subí los source maps a Sentry **sin servirlos públicamente** (revelarían tu código fuente):

```yaml
# .github/workflows/deploy.yml
- name: Upload sourcemaps to Sentry
  run: |
    npx @sentry/cli releases new $VERSION
    npx @sentry/cli releases files $VERSION upload-sourcemaps ./dist
    npx @sentry/cli releases finalize $VERSION
- name: Remove sourcemaps from dist
  run: rm dist/**/*.map
```

### Capturar errores manualmente

```ts
try {
  await api.processPayment(order);
} catch (e) {
  Sentry.captureException(e, {
    tags: { feature: 'checkout' },
    extra: { orderId: order.id, amount: order.total },
  });
  showError('No pudimos procesar el pago');
}
```

### Identificar usuarios

```ts
Sentry.setUser({ id: user.id, email: user.email });
// O al logout:
Sentry.setUser(null);
```

Cuidado con PII (Personally Identifiable Information) — chequeá compliance.

### React ErrorBoundary

```tsx
function App() {
  return (
    <Sentry.ErrorBoundary fallback={({ error, resetError }) => (
      <div>
        <h1>Algo salió mal</h1>
        <button onClick={resetError}>Reintentar</button>
      </div>
    )}>
      <Routes>...</Routes>
    </Sentry.ErrorBoundary>
  );
}
```

---

## S5.3 Real User Monitoring (RUM)

Medir performance **real** de tus usuarios — no en tu MacBook, en su Android viejo con 3G.

### Web Vitals tracking

```ts
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Sentry, GA4, tu backend, etc.
  fetch('/api/metrics', {
    method: 'POST',
    body: JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,  // 'good' | 'needs-improvement' | 'poor'
      url: location.pathname,
      device: navigator.userAgent,
    }),
  });
}

onCLS(sendToAnalytics);
onINP(sendToAnalytics);
onLCP(sendToAnalytics);
```

Con esto sabés:
- "El LCP mediano de /checkout es 3.2s" (necesita mejorar).
- "El INP en mobile Safari es 30% peor que en Chrome" (investigar).
- "El deploy de ayer subió CLS de 0.08 a 0.21" (rollback urgente).

### Custom metrics

```ts
// Tiempo desde click hasta acción completada
performance.mark('btn-click');
await api.submitForm();
performance.mark('form-submitted');
performance.measure('form-submission', 'btn-click', 'form-submitted');

const measure = performance.getEntriesByName('form-submission')[0];
sendToAnalytics({ name: 'form-submission-time', value: measure.duration });
```

---

## S5.4 OpenTelemetry para frontend

OTel es el estándar abierto de observability. Permite traces que cruzan frontend → backend → DB.

```ts
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { registerInstrumentations } from '@opentelemetry/instrumentation';

const provider = new WebTracerProvider();
provider.addSpanProcessor(new BatchSpanProcessor(new OTLPTraceExporter({
  url: 'https://otel.miapp.com/v1/traces',
})));
provider.register();

registerInstrumentations({
  instrumentations: [new FetchInstrumentation()],
});
```

Con esto: cada fetch genera un span con headers `traceparent` que el backend continúa. Ves el flow completo en herramientas como Jaeger, Tempo, Honeycomb.

**Cuándo vale el esfuerzo**: apps con backend complejo (microservices). Para apps chicas, Sentry alcanza.

---

## S5.5 Feature flags

Separar **deploy** (publicar código) de **release** (activar feature). Esto te da:
- **Canary releases**: 5% de usuarios → 25% → 100%.
- **A/B testing**: 50/50 con métrica de éxito.
- **Kill switch**: si una feature explota, apagala sin redeploy.
- **Acceso por user/org**: beta para clientes premium.

### Implementación simple

```ts
// flags.ts
const FLAGS = {
  newCheckout: { enabled: true, rollout: 25 },  // 25% de usuarios
  darkMode: { enabled: true, rollout: 100 },
  experimentalSearch: { enabled: false, rollout: 0 },
};

export function isEnabled(flag: string, userId?: string): boolean {
  const f = FLAGS[flag];
  if (!f || !f.enabled) return false;
  if (f.rollout >= 100) return true;
  // Hash determinístico del userId → 0-99
  const hash = userId ? hashString(userId) % 100 : Math.random() * 100;
  return hash < f.rollout;
}
```

### Servicios pro

- [LaunchDarkly](https://launchdarkly.com): el estándar enterprise (caro).
- [Flagsmith](https://flagsmith.com): open source, self-hostable.
- [Unleash](https://www.getunleash.io): open source, popular.
- [Statsig](https://statsig.com): bueno para A/B testing con stats.
- [PostHog](https://posthog.com): incluye flags, analytics, replays.

### Con React

```tsx
import { useFlag } from './flags';

function Checkout() {
  const newCheckoutEnabled = useFlag('new-checkout');
  return newCheckoutEnabled ? <CheckoutV2 /> : <CheckoutV1 />;
}
```

### A/B testing con statistical significance

```ts
// Variant assignment determinístico por user
const variant = hashString(userId) % 2 === 0 ? 'A' : 'B';

// Tracking del experimento
analytics.track('experiment_view', { experiment: 'checkout-v2', variant });

// Cuando el user convierte
analytics.track('checkout_completed', { variant, amount });

// Después: análisis con stats (chi-square, t-test) para ver si la diferencia es significativa.
```

⚠️ **Trampa**: terminar un experimento "porque parece que A gana" sin stats es **wishful thinking**. Necesitás N suficiente y p-value &lt; 0.05.

---

## S5.6 CI/CD avanzado

### El pipeline mínimo de un proyecto serio

```yaml
# .github/workflows/ci.yml
name: CI
on: [pull_request, push]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test:unit
      - run: npm run build
      - run: npm run test:e2e
      - name: Lighthouse CI
        run: npx lhci autorun
      - name: Bundle analysis
        run: |
          npm run build:analyze
          npx bundlesize
      - uses: codecov/codecov-action@v4
        with: { file: ./coverage/coverage-final.json }
```

### Deploy strategies

#### Blue/green
2 ambientes idénticos. Deployás al "verde" (idle), validás, switcheás tráfico. Si algo falla, vuelta al "azul" instantáneo.

#### Canary
Deployás al 5% del tráfico, monitoreás métricas, escalás al 25%, 50%, 100%.

```yaml
# Ejemplo con Vercel
vercel deploy --prod-from=branch  # crea preview
vercel alias <preview-url> staging.miapp.com  # alias
# Después de validar:
vercel alias <preview-url> miapp.com
```

#### Rolling
Reemplazo gradual de instances (típico en Kubernetes).

### Performance budgets en CI

```js
// lighthouserc.js
module.exports = {
  ci: {
    collect: { url: ['http://localhost:5173'] },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
      }
    }
  }
};
```

Si el PR baja el LCP debajo del umbral, **el merge se bloquea**. Esto es lo que separa equipos serios.

### Bundle size budget

```json
// package.json
"bundlesize": [
  { "path": "./dist/assets/index-*.js", "maxSize": "200 kB" },
  { "path": "./dist/assets/index-*.css", "maxSize": "30 kB" }
]
```

---

## S5.7 Monitoring en producción

### Synthetic monitoring
Robots que hacen el flow crítico cada N minutos. Te avisan si rompió.

```yaml
# Playwright synthetic test que corre cada 5 min
schedule: "*/5 * * * *"
test: e2e/critical-flows/checkout.spec.ts
```

### Health checks
```
GET /health → { status: 'ok', deps: { db: 'ok', redis: 'ok' } }
```

Frontend equivalent: ping a tu CDN, validar que el index.html cargue.

### Alerting
- **Errores**: spike de errores en 5 min → PagerDuty, Slack.
- **Latency**: p95 &gt; 1s sostenido → alerta.
- **Web Vitals degradación**: LCP cae a "poor" → alerta.

Herramientas: Datadog, Grafana, Honeycomb, New Relic.

### Postmortems

Cada vez que algo falla en producción:
1. **Timeline** detallado.
2. **Root cause** (5 whys).
3. **Acciones** para prevenir recurrencia.
4. **Blameless**: enfocado en sistema, no en personas.

Plantilla pública: [Google's postmortem template](https://sre.google/sre-book/postmortem-culture/).

---

## S5.8 DORA metrics — cómo medir un equipo de software

Los 4 indicadores de [DORA](https://dora.dev) que predicen performance organizacional:

| Métrica | Bueno | Excelente |
|---------|-------|-----------|
| **Deployment frequency** | semanal | múltiple por día |
| **Lead time for changes** | &lt; 1 semana | &lt; 1 día |
| **Change failure rate** | &lt; 15% | &lt; 5% |
| **Time to restore service** | &lt; 1 día | &lt; 1 hora |

Tu CI/CD pipeline las afecta directamente. Un equipo senior optimiza para mejorar estas métricas, no para "tests bonitos".

---

## 🧑‍🎓 Worked Example — debugging un bug en producción

> Slack alert: "Spike de 500s en /api/checkout desde hace 10 min. Sentry: 500+ errores agrupados como 'TypeError: Cannot read property name of undefined'."

**Mi proceso (orden de prioridad):**

### 1. Triage (2 min)
- ¿Cuántos usuarios afectados? Sentry muestra 340 únicos en 10 min.
- ¿Bloquea revenue? Sí, /checkout.
- **Decisión**: pausar deploys, abrir incident channel.

### 2. Containment (5 min)
- ¿Hubo deploy reciente? Sí, hace 12 min.
- **Decisión**: rollback inmediato. Después investigamos.
- O: feature flag para apagar la nueva pieza si está flag-gated.

### 3. Investigación (cuando ya no sangra)
- Stack trace de Sentry: `Checkout.tsx:142 — order.shippingAddress.name`.
- Source map: línea original `<p>{order.shippingAddress.name}</p>`.
- Breadcrumbs: el user añadió producto sin login → `order.shippingAddress` es null.
- **Root cause**: el deploy quitó el guard `if (!order.shippingAddress) return null;`.

### 4. Fix
- Volver el guard.
- Test que cubra el caso "guest checkout sin shipping".
- PR con el fix referenciando el incident.

### 5. Postmortem (al día siguiente)
- Timeline.
- ¿Por qué los tests no lo agarraron? Porque mockeaban shipping siempre presente.
- Acciones:
  - Tests: caso guest checkout.
  - Tipos: `shippingAddress: ShippingAddress | null` (no opcional con `?`).
  - Process: PR template requiere "test del unhappy path".

Esto es el ciclo que un senior repite cada vez que algo se rompe. **No emocional, no buscando culpables — extrayendo aprendizaje sistémico.**

---

## 🧠 Checkpoint Quiz

<details>
<summary><strong>1. ¿Por qué los source maps son críticos en producción?</strong></summary>

Sin source maps, los stack traces de errores muestran código minificado (`a.b is not a function` en línea 1, columna 4823). Es imposible debuggear.

Con source maps, ves el código fuente original. Sentry los usa para traducir el stack y mostrarte el código real, breadcrumbs, y contexto.

⚠️ Subí los source maps a Sentry pero **no los sirvas públicamente** desde tu CDN — revelarían tu código.
</details>

<details>
<summary><strong>2. ¿Diferencia entre deploy y release?</strong></summary>

- **Deploy**: publicar el código nuevo en producción.
- **Release**: activar la feature para los usuarios.

Con feature flags, los separás. Podés deployar el código de una feature pero mantenerla apagada hasta validar A/B test, o liberar gradualmente (canary).

Beneficio: rollback de feature sin redeploy. Y deploy de cambios atrevidos sin riesgo.
</details>

<details>
<summary><strong>3. ¿Qué es un performance budget en CI?</strong></summary>

Un umbral de performance que el build debe cumplir. Si lo viola, el PR se bloquea.

Ejemplo: "Bundle JS &lt; 200KB", "LCP &lt; 2.5s", "Lighthouse Performance &gt; 90".

Lo implementás con Lighthouse CI, bundlesize, o herramientas custom. Forza al equipo a no degradar performance silenciosamente.
</details>

<details>
<summary><strong>4. ¿Por qué A/B testing sin statistical significance es peligroso?</strong></summary>

Variaciones random aparecen aún sin diferencia real. Si parás el experimento al ver "A es 3% mejor" después de 100 visits, probablemente es ruido.

Necesitás:
- **N suficiente** (calcularlo antes con power analysis).
- **p-value &lt; 0.05** (probabilidad &lt; 5% de que sea casualidad).
- **Significance test** apropiado (chi-square para conversión, t-test para tiempos).

Herramientas: Statsig, Optimizely, GrowthBook hacen esto automático.
</details>

<details>
<summary><strong>5. ¿Qué son las DORA metrics y por qué importan?</strong></summary>

Las 4 métricas de DORA (DevOps Research and Assessment) que correlacionan con performance organizacional:
- Deployment frequency
- Lead time for changes
- Change failure rate
- Time to restore service

Equipos elite las optimizan. Equipos junior tienen ciclos de deploy lentos, alta tasa de fallos, recovery lento.

Como senior, mirás estas métricas para identificar dónde mejorar el equipo: ¿deploy lento? Mejorar CI. ¿Failure rate alto? Más tests + observability. ¿Recovery lento? Mejor monitoring + runbooks.
</details>

<details>
<summary><strong>6. ¿Qué incluye un buen postmortem?</strong></summary>

1. **Timeline** detallado: qué pasó cuándo.
2. **Impacto**: cuántos usuarios, $$ perdidos, duración.
3. **Root cause**: 5 whys hasta la causa sistémica.
4. **Acciones**: previene recurrencia, no "tener más cuidado".
5. **Blameless**: enfocado en el sistema, no en quién hizo el commit.

Lo último es crítico: si la cultura culpa, la gente esconde errores y nunca se aprende.
</details>

---

## Resumen ejecutivo

- **Observability** = logs + metrics + traces. En frontend: Sentry + Web Vitals + OTel.
- **Source maps** son obligatorios en prod (sin servirlos públicamente).
- **Feature flags** separan deploy de release. Game-changer para el equipo.
- **CI con performance budgets** previene regresiones silenciosas.
- **DORA metrics** son el dashboard de salud del equipo.
- **Postmortems blameless** convierten incidents en aprendizaje.

## Ejemplos

Ver [`examples/`](./examples/):
- `01-feature-flags-simulator.html` — cómo funcionan canary y A/B testing visualmente.

## Ejercicios

Ver [`exercises.md`](./exercises.md).

---

**Siguiente módulo:** [`S-06 — Micro-frontends & Monorepos`](../modulo-06-microfrontends-monorepos/)
