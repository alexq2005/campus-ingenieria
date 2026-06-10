# Problem Set S-05 — Observability & DevOps

## Sección A — Sentry setup

1. Configurá Sentry en una app React + Vite:
   - DSN en env var (`VITE_SENTRY_DSN`).
   - Browser tracing al 10%, session replay al 5%, 100% en errores.
   - Source maps subidos en CI, **NO servidos públicamente**.
   - Identificar usuario logueado sin PII sensible.

2. `<ErrorBoundary>` global con Sentry. Probá:
   - Error en componente → captura.
   - Reset error con "Reintentar".
   - Error fuera de React (timer, async) → captura igual.

3. Captura manual con contexto en 3 puntos críticos:
   ```ts
   try { await api.charge(order); }
   catch (e) {
     Sentry.captureException(e, {
       tags: { feature: 'payment' },
       extra: { orderId: order.id }
     });
   }
   ```

## Sección B — Web Vitals tracking

4. Setup `web-vitals` enviando a:
   - Sentry (`Sentry.metrics.distribution`), o
   - Endpoint propio `/api/metrics`.
   Incluir context: URL, device, connection type.

5. **Dashboard**: leé esas métricas y mostrá:
   - LCP/INP/CLS p50, p75, p95 por ruta.
   - Trend de últimos 7 días.
   - Diferencia mobile vs desktop.

6. **Alert**: si LCP p75 sube por encima de 3s, te avisa.

## Sección C — Custom metrics

7. Implementá tracking de:
   - Tiempo desde "click submit" hasta "form enviado".
   - Tiempo desde page load hasta primer click del user.
   - Render time de un componente caro (`React.Profiler`).

8. **Long tasks API**: detectá tareas que bloquean main thread &gt; 50ms.

## Sección D — Feature flags

9. Sistema simple sin servicio externo:
   - JSON config: nombre, enabled, rollout %, allowedUserIds.
   - Hash determinístico del userId.
   - Hook `useFlag('myFeature')`.
   - Componente `<Flag name fallback>`.

10. Migrá a [Flagsmith](https://flagsmith.com) o [PostHog](https://posthog.com). Mismo API en tu código.

11. **Canary release**: deployá feature al 5%. Sin errores en 1h → 25% → 100%.

## Sección E — A/B testing

12. **Diseño**:
    - Hipótesis: "Nuevo CTA aumenta conversión ≥ 5%".
    - Métrica primaria + guardrails (no degradar bounce ni time on page).
    - N necesario con [power analysis](https://www.evanmiller.org/ab-testing/sample-size.html).
    - Duración estimada según tu tráfico.

13. **Implementación**: variant assignment determinístico, tracking de eventos, chi-square al final.

14. **Trampa**: ¿qué pasaría si parás al ver "B gana 15%" tras 200 visits? ¿Por qué es peligroso?

## Sección F — CI/CD

15. Pipeline GitHub Actions con jobs en paralelo:
    `lint → typecheck → test:unit → build → test:e2e (3 browsers) → lighthouse`
    Tiempo objetivo: &lt; 5 min.

16. **Performance budget** con Lighthouse CI:
    - Performance &gt; 90, LCP &lt; 2.5s, CLS &lt; 0.1, JS bundle &lt; 250KB.
    - Si no cumple → bloquear merge.

17. **Preview deploys**: cada PR deploya a URL única (Vercel/Netlify auto). Bot comenta el link en el PR.

## Sección G — Monitoring

18. **Synthetic monitoring**: Playwright corriendo cada 5 min — login + checkout + verificar respuesta. Falla → Slack/email.

19. **Health endpoint** `/health` que confirma JS, API, deps críticas. Conectá a UptimeRobot o Better Uptime.

## Sección H — Postmortems

20. **Simulá un incident**: te despiertan a las 3am, spike de errores. Documentá:
    - Timeline (triage → containment → investigation → fix).
    - Postmortem completo (template Google SRE).
    - **Acciones de prevención**: cambios concretos, no "tener más cuidado".

21. Tomá un **incident público real** (GitHub 2018, AWS S3 2017, Cloudflare 2019). Resumí el postmortem oficial: qué hicieron bien, qué aprendiste.

## Desafío

22. **Stack completo** en una app:
    - Sentry (errors + tracing) + Web Vitals tracking + Feature flags + Lighthouse CI + Synthetic monitoring + Dashboard custom.
    - Documentá: cómo investigar un incident usando esta stack.

23. **DORA metrics tracking**:
    - Setup que mida: deploy frequency, lead time, change failure rate, MTTR.
    - Dashboard.
    - Meta: ej. "Aumentar deploy freq de 1/semana a 1/día en 3 meses".

## Entregable

Repo `cs-fe-senior-s05-observability` con:
- App con stack completo (ej. 22).
- 1 postmortem real o análisis de uno público.
- Dashboard de DORA.
- README con runbooks: "cómo respondemos a X tipo de alerta".

Esto es lo que un senior + tech lead arma como base de un equipo profesional.
