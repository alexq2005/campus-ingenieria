# Módulo 10 — React: Componentes, hooks, estado, routing

> *"UI = f(state). React just re-runs f when state changes."*

---

## 🎥 Multimedia de este módulo

**Virtual DOM Diff en vivo** — 5 escenarios que muestran cómo React compara árboles y calcula los patches mínimos al DOM real:

<iframe
  src="../multimedia/virtual-dom-diff.html"
  width="100%" height="950"
  style="border: 1px solid #334155; border-radius: 10px;"
  loading="lazy"
  title="Virtual DOM Diff — visualización interactiva"></iframe>

> Si el iframe no renderiza, abrí directamente [`multimedia/virtual-dom-diff.html`](../multimedia/virtual-dom-diff.html).

> 💡 **Probá los escenarios 4 y 5** (reordenar CON vs SIN key) — comparar el número de patches es la mejor forma de entender por qué `key={id}` &gt; `key={index}`.

**Videos recomendados:** [📺 Playlist del módulo 10 →](../multimedia/videos.html#m10)

---

## 10.1 ¿Qué es React y por qué existe?

**React** fue creado por Facebook en 2013. Resolvió un problema concreto: cuando una app tiene muchos componentes interactivos, manipular el DOM manualmente se vuelve inmantenible.

La idea de React:
1. Escribís **componentes** (funciones que retornan UI).
2. Declarás **estado**.
3. Cuando el estado cambia, React **re-renderiza** y actualiza el DOM de forma óptima.

```
   estado cambia
       ↓
  se vuelve a ejecutar el componente (función)
       ↓
  React compara el virtual DOM nuevo con el anterior
       ↓
  aplica solo los cambios mínimos al DOM real
```

## 10.2 Setup

```bash
npm create vite@latest mi-app -- --template react
cd mi-app
npm install
npm run dev
```

Estructura:

```
src/
├── main.jsx           # entry (renderiza <App /> al DOM)
├── App.jsx
├── components/
├── hooks/
└── index.css
```

`main.jsx`:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## 10.3 JSX — HTML dentro de JS

```jsx
const saludo = <h1>Hola, mundo</h1>;

const Card = () => (
  <article className="card">
    <h2>Título</h2>
    <p>Contenido</p>
  </article>
);
```

### Reglas de JSX

1. **Un solo elemento raíz** (o `<>...</>` Fragment).
2. `className` en vez de `class`.
3. `htmlFor` en vez de `for`.
4. `onClick`, `onChange`, `onSubmit` (camelCase).
5. `{expresion}` para interpolar JS.
6. Estilos como objetos: `style={{ color: 'red', fontSize: 16 }}`.
7. Self-closing: `<img />`, `<br />`.

```jsx
const nombre = 'Ada';
const edad = 30;

return (
  <>
    <h1>Hola {nombre}</h1>
    <p>Edad: {edad > 18 ? 'adulto' : 'menor'}</p>
    {edad > 18 && <button>Zona VIP</button>}
    <ul>
      {['a', 'b', 'c'].map(letra => <li key={letra}>{letra}</li>)}
    </ul>
  </>
);
```

## 10.4 Componentes

Un componente = una **función** que retorna JSX. Por convención, **empieza con mayúscula**.

```jsx
function Saludo() {
  return <h1>Hola</h1>;
}

// O con arrow
const Saludo = () => <h1>Hola</h1>;
```

### Props — inputs del componente

```jsx
function Boton({ texto, onClick, variante = 'primary' }) {
  return (
    <button className={`btn btn--${variante}`} onClick={onClick}>
      {texto}
    </button>
  );
}

<Boton texto="Guardar" onClick={() => alert('ok')} variante="success" />
```

### `children` — el contenido entre etiquetas

```jsx
function Card({ titulo, children }) {
  return (
    <article className="card">
      <h3>{titulo}</h3>
      <div className="card-body">{children}</div>
    </article>
  );
}

<Card titulo="Mi Card">
  <p>Esto es children.</p>
  <button>Soy children también.</button>
</Card>
```

## 10.5 useState — estado local

```jsx
import { useState } from 'react';

function Contador() {
  const [n, setN] = useState(0);  // valor inicial

  return (
    <div>
      <p>Contador: {n}</p>
      <button onClick={() => setN(n + 1)}>+1</button>
      <button onClick={() => setN(0)}>Reset</button>
    </div>
  );
}
```

### Actualizar basado en el valor anterior

```jsx
setN(prev => prev + 1);   // ← preferido cuando depende del anterior
```

### Estado con objetos y arrays (inmutabilidad)

React compara referencias. **Nunca mutes** el estado:

```jsx
// ❌ MAL
usuarios.push(nuevo);
setUsuarios(usuarios);  // no re-renderiza (misma referencia)

// ✅ BIEN
setUsuarios([...usuarios, nuevo]);

// Objetos:
setUser({ ...user, edad: user.edad + 1 });
```

## 10.6 useEffect — efectos secundarios

`useEffect` corre **después del render**. Lo usás para:
- Fetch de datos.
- Subscripciones (listeners, timers).
- Sincronización con algo externo al componente.

```jsx
import { useState, useEffect } from 'react';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch('/api/posts', { signal: ctrl.signal })
      .then(r => r.json())
      .then(data => { setPosts(data); setLoading(false); })
      .catch(err => { if (err.name !== 'AbortError') console.error(err); });

    return () => ctrl.abort();  // cleanup al desmontar o antes del próximo effect
  }, []);  // array de dependencias vacío → corre una sola vez al montar

  if (loading) return <p>Cargando...</p>;
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}
```

### Dependencias

```jsx
useEffect(() => {
  // corre cada vez que id cambia
  fetch(`/api/user/${id}`).then(...);
}, [id]);
```

**Regla**: todo lo que usás del scope exterior (variables, props) debe estar en las dependencias.

## 10.7 Manejo de formularios (controlled components)

```jsx
function Formulario() {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    console.log({ email, pwd });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={e => setEmail(e.target.value)} type="email" required />
      <input value={pwd} onChange={e => setPwd(e.target.value)} type="password" required />
      <button>Login</button>
    </form>
  );
}
```

Para formularios complejos → librerías como `react-hook-form`.

## 10.8 Otros hooks esenciales

### useRef — acceder al DOM o valores persistentes

```jsx
function Focus() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();  // focus al montar
  }, []);

  return <input ref={inputRef} />;
}
```

### useMemo — memoizar cálculos caros

```jsx
const resultado = useMemo(
  () => calculoCaro(datos),
  [datos]  // solo recalcula si datos cambia
);
```

### useCallback — memoizar funciones

```jsx
const handler = useCallback(
  (id) => { /* ... */ },
  [dep1, dep2]
);
```

Útil cuando pasás callbacks a componentes hijos memoizados con `React.memo`.

### useContext — compartir estado global

```jsx
// ThemeContext.jsx
const ThemeContext = createContext('light');

function App() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Layout />
    </ThemeContext.Provider>
  );
}

// En cualquier descendiente:
function Boton() {
  const { theme, setTheme } = useContext(ThemeContext);
  return <button className={theme}>Hola</button>;
}
```

### useReducer — estado complejo

Alternativa a múltiples `useState` cuando la lógica de actualización es compleja:

```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'add': return { ...state, count: state.count + 1 };
    case 'reset': return { count: 0 };
    default: throw new Error();
  }
}
const [state, dispatch] = useReducer(reducer, { count: 0 });
dispatch({ type: 'add' });
```

## 10.9 Custom hooks — reutilizar lógica

```jsx
// useLocalStorage.js
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initial;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Uso:
const [tema, setTema] = useLocalStorage('tema', 'claro');
```

**Los custom hooks son la forma de React de compartir lógica** entre componentes. Convención: nombre empieza con `use`.

## 10.10 Composition vs Inheritance

React favorece **composición**, no herencia. No hay `class Boton extends BotonBase`. En su lugar:

```jsx
// Un componente que renderiza otro
function BotonPrimary({ children, ...rest }) {
  return <button className="btn btn-primary" {...rest}>{children}</button>;
}

// Un wrapper genérico
function WithLoading({ loading, children }) {
  if (loading) return <Spinner />;
  return children;
}

<WithLoading loading={cargando}>
  <Dashboard />
</WithLoading>
```

## 10.11 Routing con React Router

```bash
npm install react-router-dom
```

```jsx
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/users/42">Usuario 42</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users/:id" element={<UserDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function UserDetail() {
  const { id } = useParams();
  return <h2>Usuario #{id}</h2>;
}
```

## 10.12 Fetching de datos — patrones modernos

### Opción 1: `useEffect` manual (vimos arriba)

### Opción 2: **TanStack Query** (recomendado para apps reales)

```bash
npm install @tanstack/react-query
```

```jsx
import { useQuery } from '@tanstack/react-query';

function Posts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('/api/posts').then(r => r.json())
  });

  if (isLoading) return <Spinner />;
  if (error)     return <p>Error: {error.message}</p>;
  return <ul>{data.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}
```

TanStack Query te da: caché, refetch automático, optimistic updates, infinite scroll — todo "gratis".

## 10.13 Performance: cuándo preocuparse

**Regla 2026**: no optimices hasta medir. React es rápido por defecto.

Herramientas:
- **React DevTools** (extensión de Chrome/Firefox) → Profiler.
- Colocá `React.memo()` solo en componentes que re-renderizan mucho sin razón.
- `useMemo` y `useCallback` solo cuando medís que aporta.

Anti-patrones:
- Crear objetos/arrays en el render (`<Comp data={[1,2,3]} />`) fuerza re-render.
- `key={index}` en listas que se reordenan → usá IDs estables.

## 10.14 Gestión de estado global

Opciones en 2026, de menor a mayor complejidad:
1. **useState + lift up** → para la mayoría de apps.
2. **useContext** → para temas, auth, i18n.
3. **Zustand** (recomendado para apps medianas).
4. **Redux Toolkit** (enterprise, más boilerplate).
5. **Server state** (TanStack Query) aparte del client state.

Ejemplo Zustand:

```jsx
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 }))
}));

function Contador() {
  const { count, increment } = useStore();
  return <button onClick={increment}>{count}</button>;
}
```

---

## 🧑‍🎓 Worked Example

> **Ejercicio**: "Tengo un modal. Al abrirlo, el foco debe ir al input adentro. Al cerrarlo, debe volver al botón que lo abrió. En teclado."

**Mi proceso (esto es a11y + React real):**

1. *¿Estado controlado o uncontrolled?* Controlado — el padre decide `open`.
2. *¿Cómo detecto que se abrió?* Un `useEffect` con `[open]` en dependencias.
3. *¿Cómo foco el input?* `useRef` + `.current.focus()`.
4. *¿Cómo devuelvo foco al botón al cerrar?* Guardo qué elemento tenía el foco **antes** de abrir; al cerrar, lo recupero con `.focus()`.

```tsx
function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const prevActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      // Guardar qué tenía foco antes de abrir
      prevActiveElement.current = document.activeElement as HTMLElement;
      // Focus al input al siguiente tick
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      // Al cerrar, devolver foco al elemento que lo tenía
      prevActiveElement.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" className="modal">
      <button onClick={onClose} aria-label="Cerrar">×</button>
      <input ref={inputRef} placeholder="Tu nombre" />
      {children}
    </div>
  );
}
```

**Puntos clave**:
- `role="dialog"` + `aria-modal="true"` para screen readers.
- Escape para cerrar.
- Focus restauration al cerrar (UX crítico con teclado).
- El `setTimeout(..., 0)` garantiza que el input exista en el DOM antes del focus.

Un modal accesible de verdad es más complejo (focus trap, backdrop, scroll lock). Para prod usá [Radix UI Dialog](https://www.radix-ui.com/primitives/docs/components/dialog). Pero conceptualmente es esto.

## 🧠 Checkpoint Quiz

<details>
<summary><strong>1. ¿Por qué <code>key</code> en listas?</strong></summary>

React necesita identificar cada item entre renders. Con `key={item.id}` puede:
- Detectar si un item es el mismo aunque cambie de posición → lo **mueve** en vez de destruir/recrear.
- Preservar estado interno (inputs con foco, animaciones).

Con `key={index}`: si reordenás, React cree que todos cambiaron → bugs sutiles (inputs pierden foco, state del componente se mezcla).

**Regla**: usa IDs estables. Nunca `key={index}` en listas reordenables.
</details>

<details>
<summary><strong>2. Este <code>useEffect</code> corre cada render. ¿Por qué?</strong></summary>

```jsx
useEffect(() => {
  console.log('render');
});
```

**No tiene array de dependencias.** Sin array → corre después de cada render.
Array vacío `[]` → solo al montar.
Array con deps → cuando alguna cambia.

Regla: siempre explicitá las dependencias (ESLint rule `react-hooks/exhaustive-deps` te ayuda).
</details>

<details>
<summary><strong>3. ¿Mutás o no mutás?</strong></summary>

```jsx
const [users, setUsers] = useState([]);
users.push(newUser);
setUsers(users);
```

**Mal**. `push` muta el array original. React compara por **referencia**: mismo array → no re-renderiza.

Fix:
```jsx
setUsers([...users, newUser]);
setUsers(prev => [...prev, newUser]);  // mejor, usa el valor más fresco
```

Regla: nunca mutes state. Siempre creá copias con spread o `.map`/`.filter`.
</details>

<details>
<summary><strong>4. ¿Qué hacen <code>useMemo</code> y <code>useCallback</code>?</strong></summary>

- `useMemo(fn, [deps])` → memoiza el **resultado** de `fn`. Recalcula solo si `deps` cambian.
- `useCallback(fn, [deps])` → memoiza la **función** misma. Devuelve la misma referencia si `deps` no cambiaron.

**No los uses por default**. Solo cuando:
1. El cálculo es caro (`useMemo`).
2. La función se pasa a un `React.memo` hijo (`useCallback`).

Premature optimization = más código, peor performance por el overhead del hook.
</details>

<details>
<summary><strong>5. ¿Cuándo usar Context vs levantar state?</strong></summary>

- **Levantar state** (lift state up) → cuando 2-3 componentes cercanos comparten datos.
- **Context** → cuando el estado se comparte con **muchos** descendientes a través de **varios niveles**.
- **Librería (Zustand, Jotai)** → cuando el estado es complejo, mutado desde muchos lados, o hay problemas de performance con Context.

Context causa re-render de **todos** los consumers cuando el valor cambia. Para estado global mutable, Zustand es más eficiente y menos verboso.
</details>

---

## Resumen ejecutivo

- Componentes = funciones que retornan JSX.
- `useState` para estado local; `useEffect` para efectos.
- Estado es **inmutable** — creá copias.
- Custom hooks para reutilizar lógica.
- React Router para navegación, TanStack Query para server state.
- No optimices hasta medir.

## Ejemplos

Ver [`examples/`](./examples/):
- `01-contador/` — componente básico con useState.
- `02-todo-app-react/` — TODO en React (comparalo con el vanilla del módulo 6).
- `03-fetch-usuarios/` — useEffect + fetch + loading states.

## Ejercicios

Ver [`exercises.md`](./exercises.md).

---

**Siguiente módulo:** [`11 — TypeScript`](../modulo-11-typescript/)
