# Módulo S-01 — Patterns & Architecture

> *"Architecture is about the important stuff. Whatever that is."* — Ralph Johnson

---

## S1.0 Por qué este módulo abre el track

La diferencia entre un mid y un senior no es saber más React. Es ver el sistema completo y poder responder con argumentos:
- ¿Por qué este código está acá y no allá?
- ¿Por qué este patrón y no aquel?
- Si la app crece 10×, ¿qué se rompe primero?
- Si entran 5 devs nuevos al equipo, ¿pueden entender la estructura sin un mes de onboarding?

Estas preguntas no se resuelven con frameworks — se resuelven con **arquitectura**.

Este módulo te da el vocabulario y los modelos mentales para responder.

---

## S1.1 Qué es "arquitectura" (vs diseño vs implementación)

| Capa | Pregunta | Cambia con frecuencia | Ejemplo |
|------|----------|:---:|---------|
| **Arquitectura** | ¿Qué piezas existen y cómo se relacionan? | Casi nunca | "Tenemos un BFF entre el cliente y los microservicios" |
| **Diseño** | ¿Cómo está organizada cada pieza por dentro? | Rara vez | "El módulo de checkout sigue el patrón Repository" |
| **Implementación** | ¿Cómo está escrita cada función? | Constantemente | "Este componente usa `useReducer` en vez de `useState`" |

Un senior pasa el 30% de su tiempo en **arquitectura**, 50% en **diseño**, 20% en **implementación**. Un junior, lo opuesto.

**Regla**: las decisiones de arquitectura son **caras de revertir**. Por eso se documentan (ADRs — módulo 8).

---

## S1.2 Los 5 principios SOLID, traducidos al frontend

SOLID es un conjunto de principios de diseño OOP, pero aplican a cualquier paradigma. Releélos pensando en componentes React:

### S — Single Responsibility Principle

Un componente / módulo / función tiene **una sola razón para cambiar**.

```tsx
// ❌ Múltiples responsabilidades
function UserDashboard({ userId }) {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [theme, setTheme] = useState('light');

  useEffect(() => { fetch(`/users/${userId}`).then(r => r.json()).then(setUser); }, [userId]);
  useEffect(() => { fetch(`/orders?user=${userId}`).then(r => r.json()).then(setOrders); }, [userId]);

  return (<div className={theme}>{/* user info, orders, theme toggle, etc */}</div>);
}

// ✅ Una responsabilidad por componente
function UserDashboard({ userId }) {
  return (
    <ThemeProvider>
      <UserProfile userId={userId} />
      <UserOrders userId={userId} />
    </ThemeProvider>
  );
}
```

### O — Open/Closed Principle

Abierto a extensión, cerrado a modificación. Para agregar una variante, **no tocás** el código existente.

```tsx
// ❌ Para agregar una variante hay que tocar el componente
function Button({ variant }) {
  if (variant === 'primary') return <button className="bg-blue">...</button>;
  if (variant === 'danger')  return <button className="bg-red">...</button>;
  // Cada nueva variante = `if` nuevo
}

// ✅ Las variantes son data, no código
const VARIANTS = {
  primary: 'bg-blue-500 hover:bg-blue-600',
  danger:  'bg-red-500 hover:bg-red-600',
  ghost:   'border border-slate-300',
};
function Button({ variant = 'primary', ...rest }) {
  return <button className={VARIANTS[variant]} {...rest} />;
}
// Agregar 'success': solo ampliar VARIANTS, no tocar Button.
```

### L — Liskov Substitution Principle

Si `B` extiende `A`, `B` debe poder usarse donde `A` se usa **sin sorpresas**.

En frontend: tus componentes "wrapper" no deben romper la interfaz del wrapped.

```tsx
// ❌ FancyInput rompe la API esperada de un input
function FancyInput({ value, onChange }) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} />;
  // Pasa `value` (string) en vez de `event` — no es drop-in replacement de <input>.
}

// ✅ Mantiene la API
function FancyInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="ring-2 ring-blue-500" />;
}
```

### I — Interface Segregation Principle

No obligues a un componente a depender de props que no usa.

```tsx
// ❌ "God prop"
type Props = { user: User; onSave: () => void; permissions: Permission[]; theme: Theme; locale: string; ... };

// ✅ Componentes específicos con interfaces pequeñas
type AvatarProps = { user: Pick<User, 'name' | 'avatarUrl'> };
type SaveButtonProps = { onSave: () => void; disabled?: boolean };
```

Útil con `Pick<T, K>` y `Omit<T, K>` de TypeScript.

### D — Dependency Inversion Principle

Los módulos de alto nivel **no** deben depender de los de bajo nivel. Ambos dependen de **abstracciones**.

```tsx
// ❌ El componente conoce fetch, JSON, headers
function UserList() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch('/api/users', { headers: { 'X-Token': '...' } })
      .then(r => r.json())
      .then(setUsers);
  }, []);
  // ...
}

// ✅ El componente depende de una abstracción `userRepository`
function UserList({ userRepository }) {
  const [users, setUsers] = useState([]);
  useEffect(() => { userRepository.list().then(setUsers); }, []);
  // En tests, inyectás un mock. En prod, una implementación HTTP.
}
```

Este es el principio más importante para arquitectura. Lo retomamos abajo.

---

## S1.3 Hexagonal Architecture (a.k.a. Ports & Adapters)

Inventada por Alistair Cockburn (2005). La idea: tu **lógica de negocio** no debe saber nada del framework, la base de datos, ni el browser.

```
              ┌─────────────────────────────────┐
              │          BROWSER                │
              │  (DOM, fetch, localStorage)     │
              └────────────────┬────────────────┘
                               │  Adapter
              ┌────────────────▼────────────────┐
              │       PORT (interface)          │
              │   ─ userRepository.list()       │
              │   ─ paymentGateway.charge()     │
              └────────────────┬────────────────┘
                               │
              ┌────────────────▼────────────────┐
              │   APPLICATION CORE              │
              │   (use cases, business rules)   │
              │   No conoce React, fetch, etc.  │
              └─────────────────────────────────┘
```

### Ejemplo concreto: módulo de carrito

```ts
// ─── Core (puro, sin dependencias del browser) ───
// domain/cart.ts
export type CartItem = { productId: string; quantity: number };
export type Cart = { items: CartItem[] };

export const cart = {
  add(c: Cart, item: CartItem): Cart {
    const existing = c.items.find(i => i.productId === item.productId);
    if (existing) {
      return { items: c.items.map(i =>
        i.productId === item.productId
          ? { ...i, quantity: i.quantity + item.quantity }
          : i)
      };
    }
    return { items: [...c.items, item] };
  },
  total(c: Cart, prices: Record<string, number>): number {
    return c.items.reduce((sum, i) => sum + (prices[i.productId] ?? 0) * i.quantity, 0);
  }
};
```

```ts
// ─── Port (interface) ───
// ports/cartStorage.ts
export interface CartStorage {
  load(): Promise<Cart>;
  save(cart: Cart): Promise<void>;
}
```

```ts
// ─── Adapter (implementación concreta) ───
// adapters/localStorageCart.ts
import type { CartStorage } from '../ports/cartStorage';
const KEY = 'cart_v1';
export const localStorageCart: CartStorage = {
  async load() {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { items: [] };
  },
  async save(cart) {
    localStorage.setItem(KEY, JSON.stringify(cart));
  }
};
```

```ts
// ─── Otro adapter — para SSR o tests ───
// adapters/inMemoryCart.ts
export function createInMemoryCart(): CartStorage {
  let state: Cart = { items: [] };
  return {
    async load() { return state; },
    async save(cart) { state = cart; }
  };
}
```

```tsx
// ─── React (capa más externa) ───
// components/CartProvider.tsx
function CartProvider({ storage }: { storage: CartStorage }) {
  const [c, setC] = useState<Cart>({ items: [] });

  useEffect(() => { storage.load().then(setC); }, [storage]);

  const addItem = async (item: CartItem) => {
    const next = cart.add(c, item);   // ← lógica pura, testeable sin React
    setC(next);
    await storage.save(next);
  };
  // ...
}
```

**Beneficios**:
1. **Testás** la lógica del carrito sin React, sin localStorage, sin DOM.
2. **Cambiás el storage** (a IndexedDB, a un backend) sin tocar la lógica.
3. **Reusás** la misma lógica en una app móvil React Native.

**Cuándo NO aplicar Hexagonal**: para una to-do list de juguete es over-engineering. Aplica cuando la lógica de negocio tiene **complejidad real** (ej: reglas de pricing, validaciones, workflows).

---

## S1.4 Feature-Sliced Design (FSD)

Surgió ~2020 en la comunidad rusa de React/Vue. Hoy es el estándar de facto en muchas startups.

### La idea

Organizá el código por **dominio de negocio**, no por tipo técnico.

```
❌ Por tipo técnico (mid-level típico)
src/
├── components/
│   ├── Button.tsx
│   ├── UserAvatar.tsx
│   ├── ProductCard.tsx
│   └── CheckoutForm.tsx
├── hooks/
├── api/
└── pages/

✅ Feature-Sliced Design
src/
├── app/                       # ① init, providers, router
├── pages/                     # ② una página = una composición de widgets
├── widgets/                   # ③ composiciones grandes (Header, Sidebar)
├── features/                  # ④ acciones del usuario (auth/login, cart/add-item)
├── entities/                  # ⑤ entidades de negocio (user, product, order)
└── shared/                    # ⑥ utilidades reusables sin lógica de negocio
    ├── ui/                    #     Button, Modal, etc.
    ├── api/                   #     fetch wrapper, auth interceptor
    └── lib/                   #     utils
```

### Las reglas duras

1. **Capas superiores importan de inferiores, nunca al revés.**
   `pages` puede importar `widgets`, `features`, `entities`, `shared`. `shared` no importa nada de las superiores.

2. **Slices del mismo nivel no se importan entre sí.**
   `features/cart` no importa de `features/wishlist`. Si lo necesitan, comparten via `entities` o `shared`.

3. **Cada slice es una "minicapa"** con su propia estructura interna:
   ```
   features/auth/login/
   ├── api/         # endpoints específicos
   ├── model/       # types, store local
   ├── ui/          # componentes
   └── index.ts     # public API
   ```

### Ejemplo: agregar al carrito

```
src/
├── entities/
│   ├── product/
│   │   └── model/types.ts          # type Product = {...}
│   └── cart/
│       ├── model/cart.ts           # lógica pura del carrito (Hexagonal core)
│       └── api/cartStorage.ts      # adapter localStorage
├── features/
│   └── cart/
│       └── add-item/
│           ├── ui/AddToCartButton.tsx
│           └── model/useAddToCart.ts
├── widgets/
│   └── ProductCard/
│       └── ui/ProductCard.tsx      # usa AddToCartButton + product type
└── pages/
    └── product-page/
        └── ui/ProductPage.tsx      # compone widgets
```

**Regla mental**: si te preguntás "¿esto es feature o widget?", probá:
- ¿Sabe del flujo de la app? → feature.
- ¿Es solo composición visual? → widget.

---

## S1.5 Cuándo usar qué arquitectura

| Tamaño / contexto | Recomendación |
|-------------------|---------------|
| Landing / sitio estático | Estructura simple por carpetas (sin arquitectura formal) |
| App pequeña (1-3 devs, &lt; 10 features) | Por carpetas técnicas (`components`, `hooks`) ✅ |
| App mediana (4-15 devs, &lt; 50 features) | **Feature-Sliced Design** ✅ |
| App grande con lógica compleja | **Hexagonal** core + FSD afuera |
| Multi-app, múltiples equipos | Monorepo + Module Federation (módulo 06) |

**No te suba la fiebre**: aplicar Hexagonal a una app de 5 componentes te hace lento. Aplicarlo a una con 50 te salva.

---

## S1.6 Design patterns que importan en frontend

Los 23 patterns del Gang of Four (1994) son OOP-centric. En frontend moderno, estos son los que más vas a aplicar:

### Repository
Encapsular el acceso a datos. Misma idea que el "port" en Hexagonal.

```ts
interface UserRepository {
  byId(id: string): Promise<User>;
  list(): Promise<User[]>;
  save(u: User): Promise<void>;
}
```

### Strategy
Intercambiar algoritmos en runtime.

```ts
type SortStrategy<T> = (a: T, b: T) => number;
const byPrice: SortStrategy<Product>  = (a, b) => a.price - b.price;
const byName:  SortStrategy<Product>  = (a, b) => a.name.localeCompare(b.name);

products.sort(currentStrategy);
```

### Factory
Centralizar la creación de objetos complejos.

```ts
function createApiClient(env: 'dev' | 'staging' | 'prod') {
  const baseURL = { dev: 'http://localhost:3001', staging: '...', prod: '...' }[env];
  return new ApiClient({ baseURL, timeout: env === 'prod' ? 5000 : 30000 });
}
```

### Observer / Pub-Sub
Notificar cambios sin acoplar emisor y receptor.

```ts
class EventBus<TEvents extends Record<string, unknown>> {
  #listeners = new Map<keyof TEvents, Set<(payload: any) => void>>();
  on<K extends keyof TEvents>(event: K, fn: (p: TEvents[K]) => void) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, new Set());
    this.#listeners.get(event)!.add(fn);
    return () => this.#listeners.get(event)!.delete(fn);
  }
  emit<K extends keyof TEvents>(event: K, payload: TEvents[K]) {
    this.#listeners.get(event)?.forEach(fn => fn(payload));
  }
}
```

### Command
Encapsular una acción como objeto. Habilita undo/redo, queues, logging.

```ts
type Command = {
  execute(): void;
  undo(): void;
};

class AddItemCommand implements Command {
  constructor(private cart: Cart, private item: CartItem) {}
  execute() { /* ... */ }
  undo() { /* ... */ }
}
// Útil en editores, drawing apps, IDEs.
```

### Adapter
Hacer que dos interfaces incompatibles colaboren. Ya lo viste en Hexagonal.

### Singleton (cuidado)
Una sola instancia global. **Abusado**. En frontend casi siempre hay alternativas mejores (Context, Zustand, módulos ES con state interno).

---

## S1.7 Anti-patrones que delatan a un mid

Cuando reviso código de mid-level, busco estos olores:

### 1. "God component" de 500 líneas
Síntoma: scrolear el archivo cansa.
Cura: identifica responsabilidades distintas, extraé subcomponentes.

### 2. Prop drilling profundo (4+ niveles)
Síntoma: pasás props que no usa el intermedio, solo para reenviarlos.
Cura: Context API o state manager (módulo 02).

### 3. `useEffect` para todo
Síntoma: 5+ useEffects en el mismo componente.
Cura: probablemente la lógica debería estar fuera de React (en un module puro), o derivar valores con `useMemo`.

### 4. Fetch directo en componentes
Síntoma: `useEffect(() => fetch(...))` en cada componente.
Cura: TanStack Query + repository pattern. Centralización de caché, retry, dedupe.

### 5. Tipo `any` en TS
Síntoma: cuando algo no compila, le ponés `any` y seguís.
Cura: `unknown` + narrowing. Si es realmente desconocido, validá con Zod.

### 6. Magic numbers / strings
```tsx
if (status === 3) { ... }    // ❌ ¿qué es 3?
if (status === STATUS.SHIPPED) { ... }  // ✅
```

### 7. Comentarios que explican qué hace el código
Si necesitás un comentario, probablemente el código no es leíble. Renombrá variables/funciones.

```tsx
// ❌
const x = arr.filter(i => i.s === 'a');  // filtra los activos

// ✅
const activos = personas.filter(p => p.estado === 'activo');
```

### 8. Tests que verifican implementación en vez de comportamiento
```tsx
// ❌ Frágil: cambia con refactor
expect(componente.state.count).toBe(1);

// ✅ Robusto: test de comportamiento
expect(screen.getByText('1 item')).toBeInTheDocument();
```

---

## S1.8 Cómo decide un senior

El framework mental que diferencia un mid de un senior es el **trade-off explícito**:

```
PROBLEMA: ¿usamos Redux o Zustand para esta nueva app?

MID:
  "Zustand. Es más nuevo y la comunidad dice que es mejor."

SENIOR:
  "Depende. ¿Cuántos devs? ¿Vamos a tener middleware complejo?
   ¿Necesitamos time-travel debugging?
   Si la app es simple y el equipo chico → Zustand (menos boilerplate).
   Si tenemos flujos complejos con saga-like → Redux Toolkit + RTK Query.
   Si tenemos formularios complejos y reactivos → Jotai.
   Mi recomendación: Zustand por defecto, escalamos si se vuelve duro.
   Documento la decisión en un ADR para que no la cuestionemos en 6 meses."
```

La diferencia: **opciones, criterios, recomendación, documentación**.

Eso es un senior pensando en voz alta.

---

## 🧑‍🎓 Worked Example — refactor de mid a senior

Te pasan este componente. Te piden "agregar la opción de eliminar items".

```tsx
function CartPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cart').then(r => r.json()).then(data => {
      setItems(data.items);
      setLoading(false);
    });
  }, []);

  const addItem = async (productId) => {
    const item = { productId, quantity: 1 };
    setItems(prev => [...prev, item]);
    await fetch('/api/cart', { method: 'POST', body: JSON.stringify(item) });
  };

  if (loading) return <p>Cargando...</p>;
  return (
    <div>
      {items.map((item, i) => (
        <div key={i}>{item.productId} x {item.quantity}</div>
      ))}
      <button onClick={() => addItem('p1')}>Add P1</button>
    </div>
  );
}
```

**El mid haría**: agrega `removeItem`, lo plopea en el mismo componente, sigue.

**El senior piensa**:
1. *¿Esto va a crecer?* Sí — después viene "actualizar cantidad", "aplicar cupón", etc. Mejor refactor ahora que más tarde.
2. *¿La lógica del carrito está acoplada a fetch y a React?* Sí — eso es deuda. Aplico Hexagonal.
3. *¿El error handling existe?* No — agregar.
4. *¿`key={i}` está bien?* No — usar `productId` (estable).
5. *¿Hay race conditions?* Sí — si clickeás dos veces rápido, los dos fetches pueden completar fuera de orden.

```ts
// 1. Lógica pura del carrito (testeable sin React)
// domain/cart.ts
export type CartItem = { productId: string; quantity: number };
export type Cart = { items: CartItem[] };

export const cart = {
  add(c: Cart, productId: string, qty = 1): Cart {
    const existing = c.items.find(i => i.productId === productId);
    return existing
      ? { items: c.items.map(i => i.productId === productId ? { ...i, quantity: i.quantity + qty } : i) }
      : { items: [...c.items, { productId, quantity: qty }] };
  },
  remove(c: Cart, productId: string): Cart {
    return { items: c.items.filter(i => i.productId !== productId) };
  },
  totalItems(c: Cart): number {
    return c.items.reduce((sum, i) => sum + i.quantity, 0);
  }
};
```

```ts
// 2. Port + adapter
// ports/cartApi.ts
export interface CartApi {
  load(): Promise<Cart>;
  save(cart: Cart): Promise<void>;
}

// adapters/httpCart.ts
export const httpCart: CartApi = {
  async load() {
    const r = await fetch('/api/cart');
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  },
  async save(cart) {
    const r = await fetch('/api/cart', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cart),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
  }
};
```

```tsx
// 3. React solo orquesta
// pages/CartPage.tsx
function useCart(api: CartApi) {
  const [c, setC] = useState<Cart>({ items: [] });
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.load().then(c => { setC(c); setStatus('ready'); })
              .catch(e => { setError(e.message); setStatus('error'); });
  }, [api]);

  // Optimistic update + rollback en error
  const update = async (next: Cart) => {
    const prev = c;
    setC(next);
    try { await api.save(next); }
    catch (e) { setC(prev); throw e; }
  };

  return {
    cart: c, status, error,
    add:    (productId: string) => update(cart.add(c, productId)),
    remove: (productId: string) => update(cart.remove(c, productId)),
  };
}

function CartPage() {
  const { cart: c, status, add, remove } = useCart(httpCart);

  if (status === 'loading') return <p>Cargando...</p>;
  if (status === 'error')   return <p>Error</p>;
  return (
    <div>
      {c.items.map(item => (
        <div key={item.productId}>
          {item.productId} × {item.quantity}
          <button onClick={() => remove(item.productId)}>✕</button>
        </div>
      ))}
      <button onClick={() => add('p1')}>Add P1</button>
    </div>
  );
}
```

**Lo que ganamos**:
- ✅ La lógica del carrito es **testeable sin React** ni HTTP.
- ✅ Cambiar el adapter (a localStorage para offline) es trivial.
- ✅ Optimistic UI con rollback en error.
- ✅ Estados loading/error/ready explícitos.
- ✅ `key` estable con productId.
- ✅ Custom hook reusable.

Eso es pensar como senior. Y se nota en code review.

---

## 🧠 Checkpoint Quiz

<details>
<summary><strong>1. ¿Qué es Dependency Inversion y por qué importa en frontend?</strong></summary>

Significa que tu código de "alto nivel" (lógica de negocio, componentes) no debe depender directamente de implementaciones de "bajo nivel" (fetch, localStorage). Ambos dependen de **abstracciones** (interfaces).

Importa porque:
- Tests unitarios sin mocks complejos.
- Cambiar la fuente de datos sin reescribir la lógica.
- El equipo entiende mejor qué hace cada capa.

Es el principio más importante para arquitectura.
</details>

<details>
<summary><strong>2. ¿Cuándo NO aplicar Hexagonal Architecture?</strong></summary>

Cuando la lógica de negocio es **trivial**. Si tu componente solo lee datos y los muestra, agregar puertos/adapters es over-engineering.

Aplica cuando hay reglas de negocio reales (pricing, validaciones, workflows, calculations) que querés testear independientemente del UI/HTTP.
</details>

<details>
<summary><strong>3. En FSD, ¿puede <code>features/cart</code> importar de <code>features/wishlist</code>?</strong></summary>

**No**. Las reglas de FSD prohíben imports horizontales entre slices del mismo nivel. Si necesitan compartir, lo hacen via:
- `entities` (datos compartidos: `entities/product`)
- `shared` (utilidades sin lógica de negocio)
- O un nuevo feature en una capa superior (`widgets/`).
</details>

<details>
<summary><strong>4. ¿Por qué <code>useEffect(() => fetch(...))</code> directamente en el componente es anti-patrón?</strong></summary>

Razones múltiples:
1. **No hay caché** entre componentes que pidan lo mismo.
2. **Cada cambio** de estado del componente reejecuta el effect (a menos que controles deps con cuidado).
3. **No hay retry/deduplication**.
4. **Race conditions** si el componente se desmonta o cambia de prop antes que vuelva el response.
5. **Imposible testear** sin mocks complejos.

Solución: TanStack Query + repository pattern.
</details>

<details>
<summary><strong>5. Te piden elegir entre Redux y Zustand para una app nueva. ¿Qué decís?</strong></summary>

"Depende". Y armás un trade-off:

**Zustand** si:
- Equipo chico/mediano.
- Estado relativamente simple.
- Querés menos boilerplate.

**Redux Toolkit** si:
- Equipo grande con muchos colaboradores.
- Necesitás time-travel debugging.
- Tenés middleware complejo (sagas, observables).
- Hay convenciones organizacionales pre-existentes.

**Recomendación por defecto en 2026**: Zustand. Si necesitás más, escalás.

Y documentás la decisión en un ADR (módulo 08).
</details>

<details>
<summary><strong>6. ¿Qué es un "trade-off explícito" y por qué es el sello del senior?</strong></summary>

Un trade-off explícito es: "elijo X **a costa de** Y, **porque** Z".

Un mid dice "usemos X". Un senior dice "X es mejor que Y para nuestro caso porque tenemos {contexto}, sacrificamos {qué}, ganamos {qué}".

Documentar trade-offs (ADRs) evita que el equipo en 6 meses olvide POR QUÉ se decidió algo y lo cambie sin saber.
</details>

---

## Resumen ejecutivo

- **Arquitectura ≠ implementación**: arquitectura es lo que casi nunca cambia.
- **SOLID** aplicado: SRP, OCP, LSP, ISP, DIP — DIP es el más importante.
- **Hexagonal** = aislás la lógica de negocio del framework.
- **FSD** organiza por dominio, no por tipo técnico — ideal para apps medianas.
- **Patterns útiles** en frontend: Repository, Strategy, Factory, Observer, Command, Adapter.
- **Anti-patterns** comunes de mid: god components, prop drilling, useEffect para todo, fetch directo, `any`, magic strings.
- **Senior = trade-offs explícitos + decisiones documentadas** (ADRs).

## Ejemplos

Ver [`examples/`](./examples/):
- `01-hexagonal-cart.html` — el carrito refactorizado a Hexagonal, ejecutable.
- `02-fsd-estructura.html` — visualización interactiva de la estructura FSD.
- `03-solid-comparativo.html` — antes/después de cada principio SOLID.

## Ejercicios

Ver [`exercises.md`](./exercises.md).

---

**Siguiente módulo:** [`S-02 — State Machines & State Managers`](../modulo-02-state-machines/) (próximamente)
