# Problem Set S-02 — State Machines & State Managers

## Sección A — Detectar estados imposibles

1. En este componente, listá **todos los estados imposibles** que puede alcanzar:

```tsx
const [loading, setLoading] = useState(false);
const [submitting, setSubmitting] = useState(false);
const [success, setSuccess] = useState(false);
const [error, setError] = useState(null);
const [data, setData] = useState(null);
```

2. Refactorizalo a un solo `state: 'idle' | 'loading' | 'success' | 'error' | 'submitting'` con discriminated union. Listá cuántos estados tenías antes vs después.

## Sección B — useReducer

3. Construí un **carrito de compras** con `useReducer`. Tipo:
   - `add(item)` — si ya existe, incrementa cantidad; si no, agrega.
   - `remove(id)` — quita totalmente.
   - `updateQty(id, qty)` — si qty=0, equivale a remove.
   - `clear()`
   - `applyCoupon(code)` — actualiza un descuento si el cupón es válido.

4. Tests del reducer (sin React, con Vitest):
```ts
test('add item nuevo lo agrega con cantidad 1', () => { ... });
test('add item existente incrementa cantidad', () => { ... });
test('updateQty con 0 lo elimina', () => { ... });
```

## Sección C — XState básico

5. Modelá la máquina de un **semáforo de 3 luces** con XState. Transiciones automáticas con `after` (delays). Verde dura 5s, amarillo 1s, rojo 4s.

6. Modelá un **lead form de 3 pasos**: `step1 → step2 → step3 → submitting → success | error`. Permití `back` desde cualquier step. En `submitting`, NO se permite ir back ni adelante.

7. Convertí esta lógica imperativa a XState:

```ts
let isLoading = false;
let isAuth = false;
let user = null;
async function login() {
  if (isLoading) return;
  isLoading = true;
  try {
    user = await api.login();
    isAuth = true;
  } catch (e) { /* show error */ }
  isLoading = false;
}
```

## Sección D — Trade-off: Redux vs Zustand

8. Para cada escenario, decidí qué usarías y argumentá:
   - a) Startup, 3 devs, app de tracking de tareas con persistencia local.
   - b) Empresa fintech, 25 devs, audit trail estricto, time-travel debugging clave.
   - c) Single-page tool con muchos formularios reactivos interdependientes.
   - d) E-commerce con catálogo + carrito + checkout multi-step + auth.

9. Mismo carrito del ejercicio 3 — ahora implementalo en:
   - **a) Zustand**
   - **b) Jotai** (pista: un atom por categoría de estado)
   - **c) Redux Toolkit** con `createSlice`

   Compará líneas de código, número de archivos, y cuán "natural" se siente cada API.

## Sección E — Server vs Client state

10. **Refactor**: tomá esta app y separá server state (a TanStack Query) de client state (a Zustand):

```tsx
function App() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [theme, setTheme] = useState('light');
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(setUsers);
  }, []);

  const filtered = filter === 'all' ? users : users.filter(u => u.role === filter);
  // ...
}
```

¿Qué va a TanStack Query? ¿Qué a Zustand? ¿Qué queda como `useState` local?

## Sección F — Patterns de optimización

11. Identificá los **3 anti-patrones de performance** en este componente y arreglalos:

```tsx
function Dashboard() {
  const store = useStore();  // ← anti-patrón 1
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);  // ← anti-patrón 2

  const handleClick = () => { /* ... */ };  // ← anti-patrón 3 (en hijos memoizados)

  return (
    <div>
      <UserName user={store.user} />
      <Cart items={items} total={total} onItemClick={handleClick} />
    </div>
  );
}
```

## Sección G — XState avanzado

12. Diseñá una **máquina de upload de archivo** con estos requirements:
   - Estados: `idle, selecting, uploading, paused, success, error`.
   - En `uploading`: progreso con `context.percent`, eventos `PROGRESS`, `PAUSE`, `CANCEL`.
   - En `paused`: puede `RESUME` o `CANCEL`.
   - Auto-retry x3 en `error` con exponential backoff.
   - Usá `invoke` para el upload async, y `assign` para el progress.

13. Visualizalo en **stately.ai/viz** y exportá el screenshot del statechart.

## Desafío

14. **Mini Spotify**: implementá un music player con estos estados:
    - `idle, loading, playing, paused, ended, error`
    - Cola de canciones (`queue`)
    - Auto-next al `ended`
    - Repeat one / repeat all / shuffle
    - Volume (con context)
    - Persistencia de la cola en localStorage

    Modelalo con XState. Sin librería de UI específica — solo el state.

15. **Trade-off paper**: escribí un **ADR** decidiendo el stack de state management para una hipótetica app nueva (vos elegís el dominio). Considerá:
    - Tamaño del equipo
    - Complejidad esperada
    - Server state vs client state
    - Costo de cambio futuro
    - Curva de aprendizaje

Mínimo 2 páginas. Esto es lo que un senior escribe en su trabajo real.

## Entregable

Repo `cs-fe-senior-s02-state` con:
- Implementación del carrito en las 3 librerías (ej. 9).
- Máquina de upload con XState (ej. 12).
- Mini Spotify (ej. 14).
- Tu ADR (ej. 15).

Tu portafolio empieza a verse senior con este tipo de proyectos.
