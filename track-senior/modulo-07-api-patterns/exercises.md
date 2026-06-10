# Problem Set S-07 — API Patterns

## Sección A — REST bien hecho

1. Diseñá una **REST API** para un blog con: posts, comments, users, tags. Especificá endpoints completos:
   - CRUD para cada recurso.
   - Paginación cursor-based.
   - Filtering (`?tag=react&status=published`).
   - Sparse fieldsets (`?fields=id,title,excerpt`).
   - Includes (`?include=author,comments`).
   - Versionado (URL o header).
   - Status codes correctos por escenario.

2. Documentala en **OpenAPI 3.0**. Generá:
   - Tipos TS con `openapi-typescript`.
   - Cliente con `openapi-fetch`.
   - Mock server con `prism` para desarrollar sin backend.

3. **Anti-patrón hunting**: tomá una API real (de un servicio que uses) y listá 5 cosas que **mejorarías** en su diseño REST.

## Sección B — GraphQL

4. Setup GraphQL server con **Apollo Server** o **Yoga**:
   - Schema con User, Post, Comment.
   - Queries, mutations, subscription para new comments.
   - DataLoader para evitar N+1.
   - Authorization con context.

5. Setup cliente con **Apollo Client** + `graphql-codegen`:
   - Hooks tipados generados desde el schema.
   - Caché normalizado (`InMemoryCache`).
   - Optimistic updates en mutations.

6. **Comparativa**: implementá la MISMA feature (lista de posts con autor + comments) en REST y en GraphQL. Compará:
   - Cantidad de requests.
   - Tamaño total transferido.
   - Líneas de código en el cliente.
   - Type safety.

## Sección C — tRPC

7. Setup tRPC en una app full-stack TS:
   - Router con `user.byId`, `user.create`, `post.list`, `post.create`.
   - Validación con Zod.
   - Autenticación via context.
   - Cliente con hooks (`trpc.user.byId.useQuery`).

8. **Tipos compartidos**: cambiá un campo en el server (ej: `name: string` → `firstName: string, lastName: string`). Verificá que el cliente TS te avisa errores en compile time **sin codegen**.

9. **Subscription** con tRPC + WebSocket: implementá notificaciones en tiempo real cuando se crea un nuevo post.

## Sección D — BFF

10. Diseñá un BFF para una app de e-commerce. Endpoints:
    - `GET /api/dashboard` — orquesta sales + analytics + user info.
    - `GET /api/product/:id` — combina product + reviews + related + inventory.
    - `POST /api/checkout` — orquesta inventory check + payment + shipping + email.

11. Implementá uno con **Hono** (rápido, edge-ready):
    - Habla con 3 microservices mockeados.
    - Cache con Redis (mock o real).
    - Rate limiting por user.
    - Errores estructurados con codes consistentes.

## Sección E — Caching strategies

12. **HTTP cache**: configurá tu app deployada con:
    - Assets con hash → `Cache-Control: max-age=31536000, immutable`.
    - HTML → `Cache-Control: no-cache`.
    - API responses → `Cache-Control: private, max-age=60`.
    - Verificá con DevTools Network y curl.

13. **TanStack Query** avanzado:
    - `staleTime` y `gcTime` ajustados por tipo de data.
    - `refetchOnWindowFocus` configurado por query.
    - **Prefetch** de la próxima página al hacer hover en "Next".
    - **Invalidación tag-based** después de mutations.

14. **Optimistic update** completo en una feature de likes:
    - Click → UI cambia instantáneo.
    - Si falla server → rollback con feedback visual.
    - Si falla red → retry con exponential backoff.

## Sección F — Real-time

15. Implementá las 3 estrategias para una feature de notificaciones:
    - **a) Polling** cada 30s con TanStack Query.
    - **b) SSE** con `EventSource`.
    - **c) WebSocket** con Socket.IO.

    Compará en latency, complejidad, escalabilidad.

16. **Reconnection logic** para WebSocket:
    - Exponential backoff con jitter.
    - Heartbeat ping/pong.
    - State machine: `disconnected → connecting → connected → reconnecting`.
    - Buffer de eventos durante desconexión, replay al reconectar.

## Sección G — Errores y resilience

17. **Error structure tipada**:
    ```ts
    type ApiError =
      | { code: 'NOT_FOUND'; message: string }
      | { code: 'VALIDATION'; message: string; field: string }
      | { code: 'RATE_LIMITED'; message: string; retryAfter: number };
    ```
    Implementá un client wrapper que devuelva `Result<T, ApiError>` (no throws).

18. **Circuit breaker** en el cliente:
    - Si un endpoint falla 5 veces en 1 min → "open" por 30s.
    - Mientras "open" → falla rápido sin pegar al server.
    - Después intenta "half-open" para probar.

19. **Retry con backoff** correcto:
    - 4xx → no reintentes (excepto 408, 429).
    - 5xx → hasta 3 reintentos.
    - Backoff exponencial con jitter random.
    - Total timeout configurable.

## Sección H — Decisión arquitectónica

20. **Caso de estudio**: empresa con backend monolito Rails, app React web, app React Native mobile, admin Vue. Equipos: 6 backend, 4 web, 3 mobile, 2 admin. ¿Qué API style sugerís? Argumentá pros y cons de:
    - Mantener REST.
    - Migrar a GraphQL.
    - Adoptar tRPC para web (manteniendo REST para mobile).
    - Introducir BFFs.

    Escribí el ADR como si fuera para tu equipo real.

## Desafío

21. **API completa de un mini Twitter**:
    - Diseñá el schema GraphQL con: User, Tweet, Like, Follow, Notification.
    - Implementá server con Apollo + Prisma.
    - Cliente con Apollo + codegen + optimistic updates en likes.
    - Subscriptions para notifications real-time.
    - DataLoader para evitar N+1.
    - Authorization granular (puedo borrar mi tweet, no el de otro).

22. **Migration paper**: tu empresa tiene API REST con 50 endpoints. Equipo quiere migrar a GraphQL. Escribí:
    - ADR con análisis costo/beneficio.
    - Plan de migración incremental (no big bang).
    - Métricas de éxito.
    - Plan de rollback si la migración falla.
    - Cómo manejar deprecation de endpoints REST.

## Entregable

Repo `cs-fe-senior-s07-api` con:
- API REST + OpenAPI + tipos generados (ej. 1-2).
- Mismo feature en REST y GraphQL para comparar (ej. 6).
- App tRPC completa (ej. 7-9).
- Mini Twitter con GraphQL real-time (ej. 21).
- ADR del análisis de migración (ej. 22).
