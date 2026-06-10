# Problem Set S-01 — Patterns & Architecture

> ⚠️ Senior-track. Cada ejercicio te toma 2-4 horas si lo hacés bien. Sin atajos.

## Sección A — Análisis (lectura crítica)

### 1. Audit de god component

Tomá una pieza de código real (puede ser de un proyecto tuyo) que tenga **más de 200 líneas en un solo componente**. Aplicá este checklist:

- [ ] ¿Cuántas responsabilidades tiene? (Listalas)
- [ ] ¿Cuántas razones distintas tendría para cambiar? (Single Responsibility)
- [ ] ¿Qué piezas podrías extraer a custom hooks?
- [ ] ¿Qué partes son lógica pura (testeable sin React)?
- [ ] ¿Hay prop drilling? ¿Cuán profundo?

**Entregable**: documento con la lista de smells + plan de refactor con orden de pasos.

### 2. Identificar la arquitectura de un open source

Cloná uno de estos repos y describí su arquitectura **en una página**:

- [excalidraw/excalidraw](https://github.com/excalidraw/excalidraw)
- [TanStack/query](https://github.com/TanStack/query)
- [shadcn-ui/ui](https://github.com/shadcn-ui/ui)

Preguntas a responder:
- ¿Qué patrón de organización usan (FSD, técnica, ad-hoc)?
- ¿Hay separación entre lógica de negocio y framework?
- ¿Cómo manejan el estado?
- ¿Qué decisiones admiraría yo?
- ¿Qué decisiones cuestiono y por qué?

## Sección B — SOLID aplicado

### 3. Refactor SOLID

Tomá este componente y aplicá los 5 principios SOLID. Documentá qué cambió por cada uno:

```tsx
// Antes
function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/products/${productId}`).then(r => r.json()),
      fetch(`/api/reviews?product=${productId}`).then(r => r.json()),
      fetch('/api/me').then(r => r.json()),
    ]).then(([p, r, u]) => {
      setProduct(p); setReviews(r); setUser(u); setLoading(false);
    });
  }, [productId]);

  function handleAddReview(text) {
    if (!user) { alert('Login first'); return; }
    if (text.length < 10) { alert('Too short'); return; }
    fetch('/api/reviews', { method: 'POST', body: JSON.stringify({ text, productId }) })
      .then(r => r.json())
      .then(newR => setReviews([...reviews, newR]));
  }

  return (
    <div className={theme === 'dark' ? 'bg-black text-white' : 'bg-white'}>
      {loading ? <p>Loading...</p> : (
        <>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <p>${product.price}</p>
          <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>Toggle theme</button>
          <h2>Reviews</h2>
          {reviews.map((r, i) => <div key={i}>{r.text} — {r.user}</div>)}
          <textarea id="review" />
          <button onClick={() => handleAddReview(document.getElementById('review').value)}>
            Add review
          </button>
        </>
      )}
    </div>
  );
}
```

**Entregable**: el componente refactorizado + un documento explicando qué principio aplicaste en cada cambio.

## Sección C — Hexagonal Architecture

### 4. Refactor a Hexagonal: módulo de notificaciones

Tenés que construir un módulo "Notificaciones" que:
- Carga la lista de notificaciones del backend.
- Permite marcar como leída (1 a la vez o todas).
- Permite eliminar.
- Cuenta unread.
- Polling cada 30s para nuevas.

**Aplicá Hexagonal**:
- `domain/notification.ts` — lógica pura (markAsRead, count, etc.)
- `ports/notificationApi.ts` — interface
- `adapters/httpNotificationApi.ts` — implementación HTTP
- `adapters/mockNotificationApi.ts` — para tests
- `components/Notifications.tsx` — UI

Bonus: tests unitarios del domain **sin renderizar React ni mockear fetch**.

### 5. Adapter swappable

Construí un módulo `userPreferences` con dos adapters:
- `localStorageAdapter`
- `cookieAdapter`

La app debe poder cambiar entre los dos via env var. Demostrá que ambos satisfacen la misma interface.

## Sección D — Feature-Sliced Design

### 6. Reorganizar un proyecto

Tomá un proyecto chico tuyo (o creá uno desde cero) con **4-6 features**. Implementalo siguiendo FSD estrictamente:

```
src/
├── app/
├── pages/
├── widgets/
├── features/
├── entities/
└── shared/
```

Reglas a respetar:
- ✅ Imports solo descendentes.
- ✅ Slices del mismo nivel no se importan.
- ✅ Cada slice tiene un `index.ts` con su public API.

**Entregable**: repo en GitHub. Comentá en el README qué decisiones tomaste y por qué.

### 7. Detectar violaciones de FSD

Auditá el siguiente import statement por archivo. ¿Cuáles violan FSD y cómo lo arreglarías?

```ts
// shared/api/apiClient.ts
import { useAuth } from '../../features/auth';   // ?

// features/cart/add-item/ui/AddToCartButton.tsx
import { Wishlist } from '../../wishlist';   // ?

// pages/product/ProductPage.tsx
import { ProductCard } from 'widgets/ProductCard';
import { AddToCartButton } from 'features/cart/add-item';
import { useUser } from 'entities/user';   // ?

// widgets/Header/Header.tsx
import { Login } from 'pages/login';   // ?
```

## Sección E — Patterns

### 8. Implementá un Repository para "tareas"

```ts
interface TaskRepository {
  findById(id: string): Promise<Task | null>;
  list(filters?: { status?: 'todo' | 'done'; tag?: string }): Promise<Task[]>;
  save(task: Task): Promise<Task>;
  delete(id: string): Promise<void>;
}
```

Implementá 3 versiones:
- `InMemoryTaskRepository` (para tests)
- `LocalStorageTaskRepository`
- `HttpTaskRepository` (con fetch)

Tu app debe poder usar cualquiera sin cambiar.

### 9. EventBus tipado

Ampliá el `EventEmitter` del módulo 7 (curso base) a un EventBus **tipado** con TypeScript:

```ts
const bus = new EventBus<{
  'user:login':    { userId: string };
  'cart:item-added': { productId: string; quantity: number };
  'order:placed':  { orderId: string; total: number };
}>();

bus.on('user:login', ({ userId }) => { /* userId es string ✅ */ });
// bus.on('user:login', ({ wrong }) => {});  // ❌ error de tipo
```

Bonus: persistencia opcional (eventos guardados a `localStorage` para replay).

## Sección F — Trade-off papers (estilo senior)

### 10. ADR mock

Escribí un **Architecture Decision Record** real para una decisión que estés evaluando (o haya evaluado tu equipo). Formato estándar:

```markdown
# ADR-001: [Título corto]

## Status
Aceptado | Propuesto | Deprecado | Reemplazado por ADR-XXX

## Contexto
¿Cuál es el problema? ¿Qué fuerzas lo presionan?

## Opciones consideradas
1. Opción A — pros, cons
2. Opción B — pros, cons
3. Opción C — pros, cons

## Decisión
Elegimos X.

## Consecuencias
+ Beneficio 1
+ Beneficio 2
- Costo 1
- Costo 2

## Notas
Otras consideraciones, links, papers de referencia.
```

Ejemplos posibles:
- "Migrar de Redux a Zustand"
- "Adoptar TanStack Query"
- "Pasar de CSS Modules a Tailwind"
- "Adoptar TypeScript strict mode"

Enviámelo en formato `.md`. Esto es lo que te diferencia en la entrevista de senior.

## Desafío

### 11. Build a "Notion-lite" con arquitectura completa

Construí una app de notas que:
- Usa **FSD** estrictamente.
- Aplica **Hexagonal** en el dominio "note" (con add, update, delete, search puros).
- Tiene **2 adapters** intercambiables (localStorage + IndexedDB).
- Tests unitarios del dominio (sin React).
- Tests integration de los adapters.
- Documentación con un ADR sobre las decisiones clave.

**Tiempo realista**: 2-3 días de trabajo concentrado. Es un proyecto digno de portfolio para un mid avanzado / senior junior.

## Entregables

Crear repo `cs-fe-senior-s01-patterns` en GitHub con:
- Carpeta por ejercicio (cuando aplica).
- Tu ADR redactado.
- README con instrucciones para correrlo.

**Lo que vas a aprender**: pensar en sistemas, no en código. Eso es lo que te eleva a senior.
