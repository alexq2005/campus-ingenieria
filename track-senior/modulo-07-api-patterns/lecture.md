# Módulo S-07 — API Patterns

> *"The shape of your API determines the shape of every client that consumes it."*

---

## S7.0 Por qué este módulo

La API es el **contrato** entre frontend y backend. Decisiones acá definen:
- Cuántas requests hacés por página.
- Si los endpoints sirven exactamente lo que UI necesita o tenés que mezclar 5.
- Si cambios del backend rompen tu cliente o no.
- Cuán rápido podés iterar como equipo.

Senior frontend opina sobre API design. No solo "consume lo que le den".

---

## S7.1 REST — clásico, sigue dominante

Estilo basado en HTTP + recursos + verbos.

### Anatomía de una API REST bien diseñada

```
GET    /users             → lista
GET    /users/123         → uno específico
POST   /users             → crear
PUT    /users/123         → reemplazar (idempotente)
PATCH  /users/123         → actualizar parcial
DELETE /users/123         → borrar
GET    /users/123/orders  → recursos relacionados
```

### Pros y contras

✅ **Pros**:
- Estándar universal, todos los entienden.
- Caché HTTP nativo (browsers, CDNs lo usan).
- Tooling maduro (Postman, OpenAPI, Swagger).
- Stateless, escalable horizontalmente.

❌ **Contras**:
- **Over-fetching**: pedís un user y te trae 30 campos cuando necesitás 3.
- **Under-fetching**: para mostrar una página armás 5 requests.
- Versionado complejo (`/v1/`, `/v2/`).
- N+1 queries en el cliente (lista + 1 fetch por item).

### REST bien hecho — patrones senior

#### Paginación
```
GET /users?page=2&per_page=20
GET /users?cursor=abc123&limit=20    # cursor-based, mejor para datasets grandes
```

Response incluye:
```json
{
  "data": [...],
  "meta": { "total": 150, "page": 2, "per_page": 20 },
  "links": { "next": "/users?page=3", "prev": "/users?page=1" }
}
```

#### Filtering
```
GET /users?role=admin&status=active&sort=-created_at
```

#### Sparse fieldsets (solución a over-fetching)
```
GET /users?fields=id,name,email
```

#### Includes (solución a under-fetching)
```
GET /users/123?include=orders,profile
```

Estos patrones vienen de [JSON:API](https://jsonapi.org/) — convención formal para REST.

#### Versionado
- En URL: `/v1/users` ← simple, visible
- En header: `Accept: application/vnd.api+json; version=1` ← cleaner pero menos discoverable

#### Status codes correctos
```
200 OK              → éxito con body
201 Created         → POST exitoso
204 No Content      → DELETE/PUT exitoso sin body
400 Bad Request     → input inválido
401 Unauthorized    → no autenticado
403 Forbidden       → autenticado pero sin permiso
404 Not Found       → recurso inexistente
409 Conflict        → ej: duplicate key
422 Unprocessable   → válido pero no procesable
429 Too Many        → rate limited
500 Internal        → bug en el server
503 Unavailable     → mantenimiento
```

---

## S7.2 GraphQL — cuando REST se queda corto

GraphQL: query language donde el cliente especifica QUÉ quiere y el server retorna exactamente eso.

```graphql
query GetUserDashboard($id: ID!) {
  user(id: $id) {
    name
    avatar
    orders(last: 5) {
      id
      total
      status
      items {
        product { name, price }
        quantity
      }
    }
  }
}
```

**1 request → exacto lo que necesitás.** Resuelve over-fetching y under-fetching de una.

### Pros

- **Queries flexibles**: cada vista pide lo que necesita.
- **Tipado fuerte** (schema): contract garantizado.
- **Self-documenting** (introspection).
- **Subscripciones** (real-time built-in).
- **Tooling brutal**: GraphiQL, Apollo Studio, codegen automático de tipos TS.

### Contras

- **Caché HTTP no funciona** (todo es POST a `/graphql`).
- **N+1 backend** (sin DataLoader explota).
- **Complejidad operacional** (rate limiting por query, depth limiting, etc).
- **Curva de aprendizaje** mayor que REST.

### Cuándo GraphQL gana

- Mobile apps + web app + admin compartiendo backend (cada cliente con needs distintos).
- UI compleja con muchas relaciones (dashboards, redes sociales).
- Equipo frontend grande iterando rápido sin coordinarse con backend.

### Cuándo NO

- API simple, cliente único.
- Equipo sin experiencia (curva).
- File uploads o streaming (REST sigue siendo mejor).

### Stack moderno GraphQL

- **Server**: Hasura, PostGraphile (auto-genera schema desde DB), Apollo Server, Yoga.
- **Client**: Apollo Client, urql, **Relay** (Facebook's, optimizado).
- **Codegen**: `graphql-codegen` genera hooks TS tipados desde tu schema.

```ts
// Generado automáticamente
import { useGetUserQuery } from '@/generated/graphql';

function UserPage({ id }: { id: string }) {
  const { data, loading, error } = useGetUserQuery({ variables: { id } });
  if (loading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  return <h1>{data.user.name}</h1>;  // tipado!
}
```

---

## S7.3 tRPC — el favorito moderno para TS-only

tRPC: si tu backend Y frontend son TypeScript, eliminá la capa de schema. Llamás funciones del server **como si fueran locales**, con tipos compartidos.

```ts
// server/router.ts
export const appRouter = router({
  user: {
    byId: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return db.user.findUnique({ where: { id: input.id } });
      }),
    create: publicProcedure
      .input(z.object({ name: z.string(), email: z.string().email() }))
      .mutation(async ({ input }) => {
        return db.user.create({ data: input });
      }),
  }
});

export type AppRouter = typeof appRouter;
```

```tsx
// client (frontend) — tipos compartidos, sin codegen
import { trpc } from '@/lib/trpc';

function UserPage({ id }: { id: string }) {
  const { data, isLoading } = trpc.user.byId.useQuery({ id });
  // data es User | undefined, totalmente tipado
}
```

### Pros tRPC

- **Cero codegen**: el cliente "sabe" los tipos del server por TS imports.
- **Tipo seguro end-to-end**: refactor del server actualiza el cliente.
- **Velocidad de desarrollo brutal**: el equipo full-stack se vuelve 2x.
- Build sobre TanStack Query: caché, refetch, etc gratis.
- Validación con Zod: input validation + types desde el mismo schema.

### Contras tRPC

- **TS-only**: si tu backend es Go/Rust/Python, no aplica.
- **Acopla cliente y server**: deploys coordinados.
- **No es estándar**: mobile native apps requieren cliente custom.

### Cuándo tRPC

- App full-stack TypeScript con un cliente principal (web).
- Equipo full-stack pequeño/mediano.
- Iteración rápida es prioridad.

---

## S7.4 BFF — Backend for Frontend

Patrón: en vez de que el frontend hable directo con microservicios, hay una capa intermedia (BFF) que orquesta.

```
[Mobile App] → [BFF Mobile] →┐
                              │→ [Microservice A]
[Web App]    → [BFF Web]    →┤→ [Microservice B]
                              │→ [Microservice C]
[Admin]      → [BFF Admin]  →┘
```

### Por qué

- **Cada cliente tiene needs distintos**: mobile quiere menos data, admin quiere más.
- **Orquestación**: el BFF combina N llamadas a microservicios en 1 response.
- **Versionado por cliente**: rollback el BFF mobile sin afectar web.
- **Security**: BFF es trusted, expone API curada al cliente.

### Cuándo

- Microservices backend + múltiples tipos de cliente.
- Necesitás transformaciones específicas por cliente.
- Performance: combinar N requests en backend es más rápido que N requests del browser.

### Cuándo NO

- Backend monolítico simple — agrega capa innecesaria.
- 1 solo cliente — el BFF es overhead.

### Implementación típica

- Node.js/Express/Hono para web BFF (TS comparte tipos con el frontend).
- Endpoints específicos por vista: `GET /api/dashboard` que orquesta `users + orders + analytics`.
- Server-side caching con Redis para no machacar microservicios.

---

## S7.5 Caching strategies

El cache es la diferencia entre "1s para cargar" y "200ms".

### HTTP caching (Browser + CDN)

```
Cache-Control: public, max-age=3600, immutable
ETag: "abc123"
Last-Modified: Wed, 21 Oct 2025 07:28:00 GMT
```

- `max-age=N` → válido por N segundos.
- `immutable` → ni siquiera revalides, asumí que sigue.
- `ETag`/`Last-Modified` → revalidación condicional (304 Not Modified ahorra body).

**Pattern**: assets con hash en nombre (`main-abc123.js`) → `Cache-Control: max-age=31536000, immutable` (1 año).
HTML → `Cache-Control: no-cache` (siempre revalida).

### Client cache con TanStack Query

```ts
useQuery({
  queryKey: ['user', id],
  queryFn: () => api.getUser(id),
  staleTime: 5 * 60 * 1000,    // 5 min "fresco"
  gcTime: 10 * 60 * 1000,       // 10 min en memoria después
  refetchOnWindowFocus: true,    // refetch cuando vuelve la pestaña
});
```

### SWR (Stale-While-Revalidate)

Patrón: muestra el dato cacheado **inmediatamente**, y refetch en background.

```
1. User abre página → ve datos viejos al instante (UX rápida).
2. Cliente hace request en background.
3. Si llega data nueva → actualiza UI silently.
4. Si nada cambió → caché sigue fresco.
```

TanStack Query y SWR (la lib) implementan esto por default.

### Optimistic updates

```tsx
const mutation = useMutation({
  mutationFn: api.toggleLike,
  onMutate: async (post) => {
    await queryClient.cancelQueries({ queryKey: ['posts'] });
    const previous = queryClient.getQueryData(['posts']);

    // Update optimista
    queryClient.setQueryData(['posts'], (old) =>
      old.map(p => p.id === post.id ? { ...p, liked: !p.liked } : p)
    );

    return { previous };  // para rollback
  },
  onError: (_err, _vars, context) => {
    // Rollback si falla
    queryClient.setQueryData(['posts'], context.previous);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  }
});
```

UX: el like aparece **instantáneo**. Si falla, vuelve. Vs esperar el round-trip = 200-500ms de delay.

### Cache invalidation — el problema más difícil

> "There are only two hard things in Computer Science: cache invalidation and naming things." — Phil Karlton

Estrategias:

#### Time-based
TTL fijo. Simple pero data desactualizada hasta el TTL.

#### Event-based
Cambió el server? Notificá al cliente (WebSocket, SSE, polling).

#### Tag-based (TanStack Query, Redux Toolkit Query)
```ts
// Mutación que afecta posts
mutation.mutate({}, {
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] })
});
```

Cualquier query con `queryKey: ['posts', ...]` se refetchea automático.

---

## S7.6 Real-time: WebSocket vs SSE vs Polling

### Polling
Cliente hace request cada N segundos.

```ts
useQuery({
  queryKey: ['notifications'],
  queryFn: api.getNotifications,
  refetchInterval: 30_000,  // cada 30s
});
```

✅ Simple, funciona en todos lados, caché-friendly.
❌ Latency proporcional al intervalo. Carga al server proporcional a clients × frecuencia.

**Cuándo**: data que cambia ocasionalmente, latency no crítica.

### Server-Sent Events (SSE)
Conexión HTTP unidireccional servidor → cliente.

```ts
const events = new EventSource('/api/notifications/stream');
events.onmessage = (e) => {
  const notification = JSON.parse(e.data);
  // ...
};
```

✅ Built-in del browser, reconexión automática, simple.
❌ Solo server → client (cliente sigue usando POST normales).

**Cuándo**: notifications, feeds, dashboards de monitoreo.

### WebSockets
Conexión bidireccional persistente.

```ts
const ws = new WebSocket('wss://chat.miapp.com');
ws.send(JSON.stringify({ type: 'message', text: 'Hola' }));
ws.onmessage = (e) => { /* ... */ };
```

✅ Bidireccional, low latency, eficiente.
❌ Más complejo (heartbeat, reconnection, scaling), no usa caché HTTP.

**Cuándo**: chat, gaming, collaborative editing, trading.

Librerías: [Socket.IO](https://socket.io), [Ably](https://ably.com), [Pusher](https://pusher.com).

---

## S7.7 Errores y resilience

### Estructura de error tipada

```ts
type ApiError = {
  code: 'NOT_FOUND' | 'VALIDATION' | 'UNAUTHORIZED' | 'RATE_LIMITED' | 'INTERNAL';
  message: string;
  field?: string;       // para validation errors
  retryAfter?: number;  // para rate limited
};

// Cliente sabe qué hacer con cada code
```

### Retry strategies

```ts
useQuery({
  retry: (failureCount, error) => {
    if (error.status === 404) return false;  // no reintentes 404
    if (error.status >= 500) return failureCount < 3;  // 5xx, hasta 3 veces
    return false;
  },
  retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),  // exponential backoff
});
```

### Circuit breaker pattern

Si un endpoint falla repetidas veces, **dejá de pegarle** por X tiempo.

```ts
class CircuitBreaker {
  failures = 0;
  state: 'closed' | 'open' | 'half-open' = 'closed';
  openedAt = 0;

  async call(fn: () => Promise<any>) {
    if (this.state === 'open') {
      if (Date.now() - this.openedAt < 30_000) throw new Error('Circuit open');
      this.state = 'half-open';  // probamos de nuevo
    }
    try {
      const result = await fn();
      this.failures = 0;
      this.state = 'closed';
      return result;
    } catch (e) {
      this.failures++;
      if (this.failures >= 5) {
        this.state = 'open';
        this.openedAt = Date.now();
      }
      throw e;
    }
  }
}
```

Patrón crítico para que un microservicio caído no tire toda tu app.

---

## S7.8 OpenAPI y type generation

OpenAPI (antes Swagger) es el estándar de spec para REST APIs.

```yaml
openapi: 3.0.0
paths:
  /users/{id}:
    get:
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string }
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
```

Con esto generás:
- **Tipos TS** (`openapi-typescript`).
- **Cliente HTTP** (`openapi-fetch`).
- **Mock server** (`prism`).
- **Documentación interactiva** (Swagger UI, Redoc).

```ts
// Cliente generado, completamente tipado
import createClient from 'openapi-fetch';
import type { paths } from './generated/api';

const api = createClient<paths>({ baseUrl: '/api' });
const { data, error } = await api.GET('/users/{id}', { params: { path: { id: '123' } } });
// data es User, error es typed según el endpoint
```

**Esto es lo que un equipo serio hace**: el contrato OpenAPI vive en un repo, ambos consumen tipos generados, no hay desync.

---

## S7.9 La decisión: ¿qué API style usar?

| Situación | Recomendación |
|-----------|---------------|
| Backend público para terceros | **REST + OpenAPI** (estándar universal) |
| Backend interno + múltiples clientes con needs distintos | **GraphQL** o BFF + REST |
| Full-stack TypeScript, un cliente, equipo chico | **tRPC** (productividad max) |
| Mobile + web, datos relacionales complejos | **GraphQL** (Apollo) |
| Microservices + multiple clients | **BFF + REST/GraphQL** según cliente |
| Real-time crítico | **REST/GraphQL para CRUD + WebSockets** para realtime |

**Anti-patrón**: GraphQL "porque es moderno" en una app simple con 1 cliente. Termina siendo over-engineering.

---

## 🧑‍🎓 Worked Example — diseñar la API de un dashboard

> Te piden hacer un dashboard que muestra: usuarios online, ventas del día, top 5 productos, últimas 10 transacciones, gráfico de ventas última semana.

**Mid junior approach**:
```
GET /users/online            (devuelve count)
GET /sales/today             (devuelve total)
GET /products/top?limit=5
GET /transactions?limit=10
GET /sales?from=last_week
```

5 requests al cargar la página. Cada una con su loading state. UX: aparecen secuencialmente.

**Senior approach**:

### Opción A: BFF endpoint específico

```
GET /api/dashboard
```

Backend:
```ts
app.get('/api/dashboard', async (req, res) => {
  const [online, sales, top, txs, weekSales] = await Promise.all([
    usersService.online(),
    salesService.today(),
    productsService.top(5),
    transactionsService.recent(10),
    salesService.last7Days(),
  ]);
  res.json({ online, sales, top, transactions: txs, weekSales });
});
```

1 request, 1 round-trip, todo cargas a la vez. UX consistente.

### Opción B: GraphQL

```graphql
query Dashboard {
  onlineUsers
  todaySales { total, count }
  topProducts(limit: 5) { id, name, soldCount }
  recentTransactions(limit: 10) { id, amount, user { name } }
  weeklySales { date, amount }
}
```

Mismo: 1 request, devuelve solo lo pedido. Si después el dashboard cambia (quita weeklySales), no requiere endpoint nuevo.

### Decisión

- Si solo este dashboard → BFF endpoint (más simple).
- Si hay 10 dashboards distintos con datos parecidos → GraphQL (flexibilidad gana).

### Caching

- TanStack Query con `staleTime: 30_000` (30s, datos no críticos en tiempo real).
- O SSE para online users + transactions, REST para el resto.

### Errores

```tsx
function Dashboard() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: api.getDashboard,
    staleTime: 30_000,
  });

  if (isLoading) return <DashboardSkeleton />;
  if (error) return <ErrorState onRetry={() => queryClient.invalidateQueries(['dashboard'])} />;

  // Render con partial data: si una sección falla del backend (null), mostrá fallback
  return (
    <div>
      <Card title="Online">{data.online ?? 'N/A'}</Card>
      {data.weekSales ? <Chart data={data.weekSales} /> : <ChartFallback />}
    </div>
  );
}
```

Ese tipo de pensamiento (1 request en vez de 5, tipos correctos, partial fallback) es lo que se ve en code reviews de senior.

---

## 🧠 Checkpoint Quiz

<details>
<summary><strong>1. ¿Cuándo elegir GraphQL sobre REST?</strong></summary>

Cuando:
- Tenés múltiples clientes (web + mobile + admin) con needs distintos.
- UI tiene relaciones complejas (dashboards, redes sociales).
- Equipo frontend grande iterando rápido sin coordinarse con backend.

Cuándo NO:
- API simple, 1 cliente.
- Equipo sin experiencia GraphQL.
- File uploads, streaming.
</details>

<details>
<summary><strong>2. ¿Por qué tRPC es popular en 2026 pero no aplica a todos?</strong></summary>

Pros: tipos end-to-end sin codegen, productividad máxima full-stack TS.

Limitación clave: **TS-only**. Si tu backend es Go/Rust/Python, no funciona. Si vas a tener mobile native (Swift/Kotlin), tampoco.

Cuándo: app full-stack TS, un cliente principal, equipo chico/mediano.
</details>

<details>
<summary><strong>3. ¿Qué resuelve un BFF que un backend monolítico no?</strong></summary>

- **Per-client orchestration**: cada cliente (web, mobile) recibe data shaped para su UI.
- **Reduce N+1 round-trips**: el BFF combina llamadas a microservicios en 1 response.
- **Independent deploys** por cliente: cambios en mobile BFF no afectan web.
- **Security boundary**: BFF es trusted layer entre cliente y microservicios internos.

Cuándo: tenés microservices + múltiples tipos de cliente con needs distintos.
</details>

<details>
<summary><strong>4. ¿Qué es stale-while-revalidate y por qué es game-changer en UX?</strong></summary>

Patrón: muestra data cacheada al instante (UX rápida), y refetch en background. Si llega data nueva, actualizá silenciosamente.

Resultado: el usuario NUNCA ve loading después de la primera carga. Y siempre tiene datos eventualmente frescos.

TanStack Query y SWR lo implementan por default.
</details>

<details>
<summary><strong>5. ¿Cuándo WebSockets vs SSE vs Polling?</strong></summary>

- **Polling**: data que cambia ocasionalmente, latency no crítica. Más simple.
- **SSE**: notifications, feeds, dashboards (server → cliente solamente). Built-in del browser.
- **WebSockets**: chat, gaming, collaborative (bidireccional, low latency).

Costo aumenta del primero al último. Empezá con polling, escalá si la UX lo justifica.
</details>

<details>
<summary><strong>6. ¿Por qué optimistic updates son senior-level UX?</strong></summary>

Sin: usuario clickea "like" → espera 300ms → ve actualización. Se siente lento.

Con optimistic: usuario clickea → like aparece **instantáneo**. Si el server falla, rollback automático con feedback.

UX percibida 10x mejor. Costo: ~20 líneas de código con TanStack Query.

Crítico: el rollback DEBE existir, sino tu app miente al usuario.
</details>

---

## Resumen ejecutivo

- **REST** sigue dominando. Aprendelo bien, OpenAPI para tipos.
- **GraphQL** brilla con múltiples clientes y data relacional compleja.
- **tRPC** es productividad máxima en full-stack TS — pero acopla.
- **BFF** orquesta para cada cliente cuando hay microservices.
- **Cache strategy** y **optimistic updates** definen UX moderna.
- **Real-time**: polling → SSE → WebSocket en orden creciente de complejidad.

## Ejercicios

Ver [`exercises.md`](./exercises.md).

---

**Siguiente módulo:** [`S-08 — Liderazgo Técnico`](../modulo-08-liderazgo-tecnico/)
