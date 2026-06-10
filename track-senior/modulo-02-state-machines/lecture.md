# Módulo S-02 — State Machines & State Managers

> *"Most bugs are not bugs of code — are bugs of state you didn't know you had."*

---

## S2.0 Por qué este módulo importa

El 80% de los bugs en frontend complejo vienen de estado **mal modelado**. No de código mal escrito — de modelar el estado como booleans sueltos en vez de como una máquina de estados.

Junior: `loading`, `error`, `data` como 3 booleans separados. Sale: `loading=true && error=true && data!=null` (estado imposible).
Senior: 1 sola variable que solo puede ser `'idle' | 'loading' | 'success' | 'error'`. Estados imposibles imposibles.

Este módulo te da: vocabulario, patrones, herramientas para no volver al modelo de booleans sueltos.

---

## S2.1 El problema fundamental: estados imposibles

Mirá este componente típico:

```tsx
function UserProfile({ id }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/users/${id}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(e); setLoading(false); });
  }, [id]);
  // ...
}
```

Cuántos estados puede tener? `2 (loading) × 2 (error) × 2 (data) = 8`. Muchos son **imposibles**:
- `loading=true && data=X` → ¿está cargando o ya cargó?
- `loading=true && error=Y` → ¿falló o sigue intentando?
- `error=Y && data=X` → ¿falló o tuvo éxito?

Con discriminated union:

```ts
type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User }
  | { status: 'error'; error: Error };
```

4 estados, todos legales. Imposible tener `loading + data` simultáneamente. **TypeScript te obliga** a manejar cada caso.

Esa es la diferencia entre código frágil y código robusto. No es performance ni estética — es modelar bien el dominio.

---

## S2.2 El espectro del state management

```
┌─────────────────────────────────────────────────────────────────┐
│                     SCOPE DEL ESTADO                            │
├──────────────────┬──────────────────┬───────────────────────────┤
│  Componente      │  Compartido      │  Global                   │
│  (local)         │  (lift / context)│  (toda la app)            │
└──────────────────┴──────────────────┴───────────────────────────┘
        ↓                  ↓                       ↓
   useState          useState + props          Zustand / Redux
   useReducer        Context API              Jotai / Effector
   XState (local)                             XState (global)
```

```
┌─────────────────────────────────────────────────────────────────┐
│                     ORIGEN DEL ESTADO                           │
├──────────────────────────────┬──────────────────────────────────┤
│  Server state                │  Client state                    │
│  (viene del backend)         │  (UI, forms, prefs)              │
└──────────────────────────────┴──────────────────────────────────┘
              ↓                                ↓
       TanStack Query                    Zustand / Redux
       SWR                               Jotai
       Apollo                            useState
       RTK Query
```

**Regla mental**: NO mezclás server state con client state. Tienen vidas distintas, requirements distintos (caching, refetch, deduping para server; reactividad simple para client).

---

## S2.3 useState vs useReducer vs XState

### useState — para 1-2 valores independientes

```tsx
const [count, setCount] = useState(0);
const [open, setOpen] = useState(false);
```

Cuando empiezan a aparecer 3+ piezas de estado relacionadas, **escalá**.

### useReducer — para transiciones de estado conocidas

```tsx
type Action =
  | { type: 'add'; texto: string }
  | { type: 'remove'; id: string }
  | { type: 'toggle'; id: string };

function reducer(state: Todo[], action: Action): Todo[] {
  switch (action.type) {
    case 'add':    return [...state, { id: crypto.randomUUID(), texto: action.texto, done: false }];
    case 'remove': return state.filter(t => t.id !== action.id);
    case 'toggle': return state.map(t => t.id === action.id ? { ...t, done: !t.done } : t);
  }
}

const [todos, dispatch] = useReducer(reducer, []);
dispatch({ type: 'add', texto: 'comprar pan' });
```

Útil cuando:
- El estado tiene **forma compleja** (no un primitive).
- Las transiciones son **explícitas y enumerables**.
- Querés **separar el cómo** de las acciones del **dónde** se disparan.

### XState — para flujos con muchos estados y reglas complejas

Pensá en: checkout multi-step, drag-and-drop, video player, wizard, juego.

```ts
import { createMachine } from 'xstate';

const trafficLight = createMachine({
  id: 'traffic',
  initial: 'red',
  states: {
    red:    { on: { TIMER: 'green' }, after: { 5000: 'green' } },
    green:  { on: { TIMER: 'yellow' }, after: { 4000: 'yellow' } },
    yellow: { on: { TIMER: 'red' },   after: { 1000: 'red' } },
  }
});
```

Lo poderoso: **los estados imposibles son sintácticamente imposibles**. En ningún momento podés estar en `red+green` al mismo tiempo. Y todas las transiciones están **declaradas explícitamente**.

Ejemplo más práctico — formulario con validación async:

```ts
const formMachine = createMachine({
  id: 'form',
  initial: 'editing',
  context: { email: '', errors: {} },
  states: {
    editing: {
      on: {
        UPDATE: { actions: assign({ email: (_, e) => e.value }) },
        SUBMIT: 'validating',
      }
    },
    validating: {
      invoke: {
        src: (ctx) => validateEmail(ctx.email),
        onDone: 'submitting',
        onError: { target: 'editing', actions: assign({ errors: (_, e) => e.data }) }
      }
    },
    submitting: {
      invoke: {
        src: (ctx) => api.submit(ctx.email),
        onDone: 'success',
        onError: 'editing',
      }
    },
    success: { type: 'final' }
  }
});
```

Esto es VERIFICABLE: podés probar todas las transiciones automáticamente. No podés mandar `SUBMIT` desde `submitting` (no existe esa transition). XState te previene de bugs antes de runtime.

---

## S2.4 Cuándo Redux vs Zustand vs Jotai vs Effector

Esto es lo más preguntado en entrevistas senior. Cada uno tiene un trade-off claro.

### Redux Toolkit
**Modelo**: una store global, slices con reducers, dispatch de actions, selectores.

**Cuándo**:
- Equipo grande (>10 devs).
- Lógica con muchos side effects (sagas, observables).
- Necesitás **time-travel debugging** (Redux DevTools es legendario).
- Convenciones organizacionales pre-existentes.

**Cuándo NO**:
- App chica/mediana — boilerplate excesivo.
- Solo querés guardar `theme` y `user`.

```ts
// store.ts
import { configureStore, createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addItem: (state, action) => { state.items.push(action.payload); },  // Immer adentro
    removeItem: (state, action) => { state.items = state.items.filter(i => i.id !== action.payload); },
  }
});

export const store = configureStore({ reducer: { cart: cartSlice.reducer } });
export const { addItem, removeItem } = cartSlice.actions;
```

```tsx
// Component
const items = useSelector(s => s.cart.items);
const dispatch = useDispatch();
dispatch(addItem({ id: 1, name: 'Libro' }));
```

### Zustand
**Modelo**: hooks + closure store. Sin provider, sin actions formales.

**Cuándo**:
- App chica/mediana (1-15 devs).
- Querés API simple sin boilerplate.
- No necesitás middleware complejo.

**Cuándo NO**:
- App enterprise con saga-like flows.
- Time-travel debugging crítico.

```ts
import { create } from 'zustand';

type CartStore = {
  items: Item[];
  add: (item: Item) => void;
  remove: (id: string) => void;
  total: () => number;
};

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  add: (item) => set(s => ({ items: [...s.items, item] })),
  remove: (id) => set(s => ({ items: s.items.filter(i => i.id !== id) })),
  total: () => get().items.reduce((t, i) => t + i.price, 0),
}));
```

```tsx
// Component (sin provider)
const { items, add } = useCart();
const total = useCart(s => s.total());  // selector
```

5 líneas vs 30 de Redux. Por eso es popular.

### Jotai
**Modelo**: atoms — pequeñas unidades de estado componibles. Bottom-up.

**Cuándo**:
- Tenés muchos estados granulares interdependientes.
- Formularios complejos donde cada campo es reactivo.
- Querés evitar re-renders innecesarios automáticamente.

**Cuándo NO**:
- Estado sencillo y pocas piezas.

```ts
import { atom, useAtom } from 'jotai';

const countAtom = atom(0);
const doubleAtom = atom((get) => get(countAtom) * 2);   // derivado

// Component
const [count, setCount] = useAtom(countAtom);
const [double] = useAtom(doubleAtom);  // se actualiza solo cuando count cambia
```

Inspirado en Recoil pero más simple. Cero boilerplate.

### Effector
**Modelo**: events + stores + effects. Más opinionado, más declarativo.

**Cuándo**:
- Apps complejas con lógica reactiva.
- Equipo cómodo con paradigma reactivo (Rx-like).

**Cuándo NO**:
- Equipo nuevo a estos conceptos — curva de aprendizaje.

### Tabla comparativa final

| Aspecto | Redux | Zustand | Jotai | Effector | XState |
|---------|:-----:|:-------:|:-----:|:--------:|:------:|
| Boilerplate | Alto | Mínimo | Mínimo | Medio | Alto |
| Curva | Media | Baja | Baja | Alta | Alta |
| DevTools | Excelente | Bueno | Bueno | Excelente | Excelente |
| Server state built-in | Con RTK Query | No | No | No | No |
| Modelado de flujos complejos | Medio | Bajo | Bajo | Alto | **Excelente** |
| Adopción 2026 | Alta | Muy alta | Creciendo | Nicho | Especialista |

**Recomendación senior**:
- **Default**: Zustand para client state + TanStack Query para server state.
- **Si flujos complejos**: agregá XState para esas piezas específicas (no toda la app).
- **Si team grande con convenciones**: Redux Toolkit + RTK Query.

---

## S2.5 Server state vs Client state — la separación clave

Senior insight: TanStack Query (o SWR, Apollo, RTK Query) **NO es competencia** de Zustand/Redux. Resuelven problemas distintos.

```
SERVER STATE                    CLIENT STATE
- Viene de un fetch              - Vive en el browser
- Tiene caching, dedupe          - Sin red involved
- Refetch en focus/reconnect     - Reactivo simple
- Stale-while-revalidate         - Persiste en localStorage si querés
- Optimistic updates             - Forms, modals, theme
                                 
TanStack Query                   Zustand / Jotai / useState
```

Anti-patrón clásico de juniors: meter el response del fetch en Redux. Estás reinventando todo lo que TanStack Query te da gratis.

```tsx
// ❌ Anti-patrón
function UsersList() {
  const users = useSelector(s => s.users.list);
  const dispatch = useDispatch();
  useEffect(() => { dispatch(fetchUsers()); }, []);
  // ¿Dedupe? ¿Refetch? ¿Loading granular? ¿Cache invalidation?
  // Lo escribís todo a mano.
}

// ✅ Mejor
function UsersList() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.getUsers(),
  });
  // Todo lo demás viene gratis.
}
```

---

## S2.6 Patrones de optimización (senior level)

### Selectores granulares

```ts
// ❌ Re-renderiza con CADA cambio del store
const store = useStore();
return <div>{store.user.name}</div>;

// ✅ Solo re-renderiza si user.name cambia
const userName = useStore(s => s.user.name);
return <div>{userName}</div>;
```

Zustand, Jotai, Effector hacen esto auto. Redux requiere `useSelector` con shallowEqual.

### Context segmentado

```tsx
// ❌ Un solo Context para todo
<AppContext.Provider value={{ user, theme, locale, cart, ... }}>

// ✅ Múltiples contexts por dominio
<UserContext.Provider value={user}>
  <ThemeContext.Provider value={theme}>
    <CartContext.Provider value={cart}>
      ...
```

Razón: cuando cambia `theme`, solo re-renderizan los componentes que consumen `ThemeContext`.

### Derivar, no almacenar

```ts
// ❌ Almacenás derivados
const [items, setItems] = useState([]);
const [total, setTotal] = useState(0);
const [count, setCount] = useState(0);
// Tenés que sincronizar 3 cosas. Bug-prone.

// ✅ Derivás
const [items, setItems] = useState([]);
const total = useMemo(() => items.reduce((t, i) => t + i.price, 0), [items]);
const count = items.length;
```

Misma idea en stores: en Zustand `total: () => get().items.reduce(...)` se evalúa solo cuando lo lees.

---

## S2.7 ¿Cuándo XState gana sobre todos?

XState gana cuando:
1. El flujo tiene **&gt;3 estados con transiciones explícitas**.
2. Hay **transiciones imposibles** que querés prevenir en compile time.
3. Necesitás **statecharts** (estados anidados, paralelos, history).
4. Es crítico que el flujo sea **testeable y visualizable**.

Ejemplos típicos:
- Wizard de onboarding (10+ pasos con back/skip/validation).
- Video player (idle → loading → ready → playing → paused → ended).
- Drag-and-drop con cancel y validation.
- Carrito multi-step con confirmación, pago, error recovery.
- Juego (menu → playing → paused → game-over → restart).

XState tiene un **visualizador online** (https://stately.ai/viz) donde pegás tu máquina y ves el statechart como diagrama. Es oro para diseñar antes de codear.

---

## 🧑‍🎓 Worked Example — refactor de booleans a state machine

> Te pasan un componente de checkout con 4 booleans: `loading`, `submitting`, `success`, `error`. Hay bugs de "doble submit" y "loading queda colgado".

**Análisis:**

1. *¿Cuáles son los estados reales?* idle, loading datos, datos listos, enviando, success, error.
2. *¿Qué transiciones son válidas?*
   - `idle → loading` (al montar)
   - `loading → ready | error` (al volver el fetch)
   - `ready → submitting` (al click submit)
   - `submitting → success | error` (al volver el POST)
   - `error → loading` (al retry)
3. *¿Cuáles son inválidas?*
   - `submitting → loading` (no podés cargar mientras enviás)
   - `success → submitting` (terminó, no hay vuelta)

**Antes (problemático):**

```tsx
const [loading, setLoading] = useState(true);
const [submitting, setSubmitting] = useState(false);
const [success, setSuccess] = useState(false);
const [error, setError] = useState(null);

async function handleSubmit() {
  setSubmitting(true);
  // ❌ qué pasa si user clickea 2 veces? submitting=true las 2 veces, dispara 2 POSTs
  try {
    await api.submit(formData);
    setSuccess(true);
  } catch (e) { setError(e); }
  setSubmitting(false);
}
```

**Después (state machine simple sin librería):**

```ts
type CheckoutState =
  | { status: 'loading' }
  | { status: 'ready'; data: CheckoutData }
  | { status: 'submitting'; data: CheckoutData }
  | { status: 'success'; orderId: string }
  | { status: 'error'; data?: CheckoutData; message: string };

function reducer(state: CheckoutState, event: Event): CheckoutState {
  switch (state.status) {
    case 'loading':
      if (event.type === 'LOAD_DONE') return { status: 'ready', data: event.data };
      if (event.type === 'LOAD_FAIL') return { status: 'error', message: event.error };
      return state;  // ignora otros eventos

    case 'ready':
    case 'error':  // permite retry
      if (event.type === 'SUBMIT') return { status: 'submitting', data: state.data! };
      return state;

    case 'submitting':
      if (event.type === 'SUBMIT_DONE')
        return { status: 'success', orderId: event.orderId };
      if (event.type === 'SUBMIT_FAIL')
        return { status: 'error', data: state.data, message: event.error };
      // ❌ ignora SUBMIT — previene doble submit AUTOMÁTICAMENTE
      return state;

    case 'success':
      return state;  // estado final, ignora todo
  }
}
```

**Lo que ganamos:**
- Doble click en submit → segundo `SUBMIT` se ignora porque estamos en `submitting`.
- Imposible mostrar loading + success al mismo tiempo.
- TypeScript te obliga a manejar todos los casos en el render.
- El reducer es testeable sin React.

Pasalo a XState si necesitás transiciones temporales (timeouts), invocaciones async declarativas, o estados anidados.

---

## 🧠 Checkpoint Quiz

<details>
<summary><strong>1. ¿Por qué <code>loading + error + data</code> como 3 booleans es anti-patrón?</strong></summary>

Permite **estados imposibles** (`loading=true && error=true`) que rompen la UI.

Solución: discriminated union (`status: 'idle' | 'loading' | 'success' | 'error'`) — modela el estado como **uno de N**, no N independientes.
</details>

<details>
<summary><strong>2. ¿Cuándo elegir useReducer sobre useState?</strong></summary>

Cuando el estado tiene **3+ piezas relacionadas** y las transiciones son **explícitas y enumerables**.

useReducer separa el QUÉ (acciones) del CÓMO (cambios). Tests más fáciles, lógica concentrada, dispatch desacoplado.
</details>

<details>
<summary><strong>3. ¿Por qué TanStack Query no es "competencia" de Zustand?</strong></summary>

Resuelven problemas distintos:
- TanStack Query: server state (caching, refetch, dedupe, optimistic).
- Zustand: client state (theme, modals, forms, UI).

Mezclarlos (poner respuestas de fetch en Zustand) es reinventar lo que TanStack te da gratis.
</details>

<details>
<summary><strong>4. ¿Por qué un Context monolítico es lento?</strong></summary>

Cuando el value del Context cambia (cualquier campo), **todos los consumers re-renderizan**.

Solución: split en múltiples contexts por dominio (UserContext, ThemeContext, CartContext) — cada cambio solo afecta consumers de ese context.

Mejor aún: usá Zustand/Jotai que tienen subscripción granular automática.
</details>

<details>
<summary><strong>5. ¿Cuándo XState es overkill?</strong></summary>

Cuando el estado es trivial (booleans simples, lista de items). XState shines en flujos con &gt;3 estados, transiciones complejas, side-effects async coordinados.

Para `[loading, data] = useFetch()` no necesitás máquina de estados — sería como matar mosca con bazooka.

Regla: aplicalo a **piezas específicas** complejas, no a toda la app.
</details>

---

## Resumen ejecutivo

- **Estados imposibles** son la fuente #1 de bugs. Modelá con discriminated unions o state machines.
- **Server state ≠ client state**. TanStack Query para uno, Zustand/Redux para el otro.
- **Default 2026**: Zustand + TanStack Query. Suma XState para flujos complejos. Suma Redux solo si la organización lo requiere.
- **Selectores granulares** y derivación &gt; storage redundante.

## Ejemplos

Ver [`examples/`](./examples/):
- `01-state-machine-visualizer.html` — máquina de estados de un video player, interactiva.

## Ejercicios

Ver [`exercises.md`](./exercises.md).

---

**Siguiente módulo:** [`S-03 — Testing Strategy`](../modulo-03-testing-strategy/)
