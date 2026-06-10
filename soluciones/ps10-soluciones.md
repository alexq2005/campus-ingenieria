# Soluciones — PS10: React

## Sección A — Componentes y props

### 1. Boton multipropósito

```tsx
type BotonProps = {
  children: React.ReactNode;
  variante?: 'primary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

export function Boton({
  children, variante = 'primary', size = 'md', icon, onClick, disabled
}: BotonProps) {
  return (
    <button
      className={`btn btn--${variante} btn--${size}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
}

// Uso
<Boton variante="danger" size="lg" icon={<TrashIcon />}>Borrar</Boton>
```

### 2. Rating de estrellas

```tsx
type RatingProps = { value: number; max?: number };

export function Rating({ value, max = 5 }: RatingProps) {
  return (
    <div role="img" aria-label={`${value} de ${max} estrellas`}>
      {Array.from({ length: max }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, value - i));  // 0, 0.5, 1 por estrella
        return (
          <span key={i} style={{ position: 'relative', display: 'inline-block' }}>
            <span style={{ color: '#ccc' }}>★</span>
            <span style={{
              position: 'absolute', top: 0, left: 0,
              color: 'gold',
              width: `${fill * 100}%`, overflow: 'hidden',
            }}>★</span>
          </span>
        );
      })}
    </div>
  );
}
```

### 3. Avatar

```tsx
type AvatarProps = { src?: string; name: string; size?: number };

const colorFromName = (name: string) => {
  const hash = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return `hsl(${hash * 37 % 360}, 70%, 50%)`;
};

export function Avatar({ src, name, size = 40 }: AvatarProps) {
  const initials = name.split(' ').slice(0, 2).map(s => s[0]).join('').toUpperCase();

  if (src) {
    return <img src={src} alt={name} width={size} height={size} style={{ borderRadius: '50%' }} />;
  }
  return (
    <div
      style={{
        width: size, height: size, borderRadius: '50%',
        background: colorFromName(name), color: 'white',
        display: 'grid', placeItems: 'center',
        fontWeight: 'bold', fontSize: size * 0.4,
      }}
      aria-label={name}
    >
      {initials}
    </div>
  );
}
```

## Sección B — useState

### 4. Contador con historial

```tsx
export function ContadorHistorial() {
  const [n, setN] = useState(0);
  const [hist, setHist] = useState<number[]>([0]);

  const update = (next: number) => {
    setN(next);
    setHist(h => [...h, next]);
  };

  return (
    <div>
      <h2>{n}</h2>
      <button onClick={() => update(n + 1)}>+1</button>
      <button onClick={() => update(n - 1)}>−1</button>
      <div>Historial: {hist.map((v, i) => <span key={i}>{v} </span>)}</div>
    </div>
  );
}
```

### 5. Temperatura (lifting state up)

```tsx
export function TempConverter() {
  const [celsius, setCelsius] = useState(20);

  return (
    <div>
      <label>
        °C: <input type="number" value={celsius}
          onChange={e => setCelsius(Number(e.target.value))} />
      </label>
      <label>
        °F: <input type="number" value={(celsius * 9/5 + 32).toFixed(1)}
          onChange={e => setCelsius((Number(e.target.value) - 32) * 5/9)} />
      </label>
    </div>
  );
}
```

El estado vive en el **padre** (aquí mismo). Los dos inputs lo leen y lo modifican → siempre consistentes.

### 6. Formulario con validación

```tsx
export function Registro() {
  const [form, setForm] = useState({ nombre: '', email: '', pwd: '', edad: 0 });
  const [tocado, setTocado] = useState<Record<string, boolean>>({});

  const errores = {
    nombre: form.nombre.length < 2 ? 'Mínimo 2 caracteres' : null,
    email: !/^\S+@\S+\.\S+$/.test(form.email) ? 'Email inválido' : null,
    pwd: form.pwd.length < 8 ? 'Mínimo 8 caracteres' : null,
    edad: form.edad < 13 ? 'Edad mínima 13' : null,
  };
  const hayErrores = Object.values(errores).some(Boolean);

  return (
    <form onSubmit={e => { e.preventDefault(); if (!hayErrores) console.log(form); }}>
      {(['nombre', 'email', 'pwd', 'edad'] as const).map(k => (
        <div key={k}>
          <input
            type={k === 'pwd' ? 'password' : k === 'edad' ? 'number' : 'text'}
            value={form[k]}
            onChange={e => setForm(f => ({ ...f, [k]: k === 'edad' ? Number(e.target.value) : e.target.value }))}
            onBlur={() => setTocado(t => ({ ...t, [k]: true }))}
            placeholder={k}
          />
          {tocado[k] && errores[k] && <small style={{color:'red'}}>{errores[k]}</small>}
        </div>
      ))}
      <button disabled={hayErrores}>Registrar</button>
    </form>
  );
}
```

## Sección C — useEffect

### 7. Hora en vivo

```tsx
export function Reloj() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);  // cleanup
  }, []);
  return <time>{now.toLocaleTimeString()}</time>;
}
```

### 8. Event listener global con Escape

```tsx
export function Modal({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);
  if (!open) return null;
  return <div className="modal">{children}</div>;
}
```

### 9. Fetch GitHub user

```tsx
export function GHProfile() {
  const [user, setUser] = useState('octocat');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const ctrl = new AbortController();
    setLoading(true); setError(null);

    fetch(`https://api.github.com/users/${user}`, { signal: ctrl.signal })
      .then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then(setData)
      .catch(e => { if (e.name !== 'AbortError') setError(e.message); })
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, [user]);

  return (
    <div>
      <input value={user} onChange={e => setUser(e.target.value)} />
      {loading && <p>Cargando...</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      {data && <div><img src={data.avatar_url} width={80} /><h3>{data.name}</h3></div>}
    </div>
  );
}
```

## Sección D — Custom hooks

### 10. useToggle

```ts
export function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  return [value, toggle, setTrue, setFalse] as const;
}
```

### 11. useDebounce

```ts
export function useDebounce<T>(value: T, ms = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return debounced;
}

// Uso
const [q, setQ] = useState('');
const debouncedQ = useDebounce(q, 300);
useEffect(() => { if (debouncedQ) buscar(debouncedQ); }, [debouncedQ]);
```

### 12. useOnlineStatus

```ts
export function useOnlineStatus() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const set = () => setOnline(navigator.onLine);
    window.addEventListener('online', set);
    window.addEventListener('offline', set);
    return () => {
      window.removeEventListener('online', set);
      window.removeEventListener('offline', set);
    };
  }, []);
  return online;
}
```

### 13. useMediaQuery

```ts
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => matchMedia(query).matches);
  useEffect(() => {
    const mq = matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);
  return matches;
}

// Uso
const isDesktop = useMediaQuery('(min-width: 1024px)');
```

## Sección E — React Router

### 14. 4 rutas

```tsx
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> ·
        <Link to="/about">About</Link> ·
        <Link to="/productos">Productos</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/productos/:id" element={<ProductoDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

function ProductoDetail() {
  const { id } = useParams<{ id: string }>();
  return <h2>Producto {id}</h2>;
}
```

### 15. Protected route

```tsx
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuth } = useAuth();
  return isAuth ? <>{children}</> : <Navigate to="/login" replace />;
}

<Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
```

## Sección F — Apps medianas

### 16. Buscador de películas (TMDB)

```tsx
export function MovieSearch() {
  const [q, setQ] = useState('');
  const debQ = useDebounce(q, 400);
  const { data, isLoading, error } = useQuery({
    queryKey: ['movies', debQ],
    queryFn: () => fetch(`${TMDB_URL}/search/movie?query=${debQ}&api_key=${KEY}`)
      .then(r => r.json()),
    enabled: debQ.length > 2,
  });

  return (
    <div>
      <input value={q} onChange={e => setQ(e.target.value)} />
      {isLoading && <Skeleton />}
      {error && <Error msg={String(error)} />}
      {data && <Grid movies={data.results} />}
    </div>
  );
}
```

Usando **TanStack Query** — te regala caché, refetch, dedupe, loading states "gratis".

## Sección G — Estado global

### 19. Context API para carrito

```tsx
type CarritoContextValue = {
  items: Item[];
  total: number;
  agregar: (p: Producto) => void;
  quitar: (id: number) => void;
};

const CarritoContext = createContext<CarritoContextValue | null>(null);

export function CarritoProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);

  const agregar = (p: Producto) => setItems(is => {
    const exist = is.find(i => i.id === p.id);
    return exist ? is.map(i => i.id === p.id ? { ...i, cant: i.cant + 1 } : i)
                 : [...is, { ...p, cant: 1 }];
  });
  const quitar = (id: number) => setItems(is => is.filter(i => i.id !== id));
  const total = items.reduce((t, i) => t + i.precio * i.cant, 0);

  return (
    <CarritoContext.Provider value={{ items, total, agregar, quitar }}>
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error('useCarrito debe usarse dentro de <CarritoProvider>');
  return ctx;
}
```

### 20. Zustand (mucho menos boilerplate)

```ts
import { create } from 'zustand';

type Store = {
  items: Item[];
  agregar: (p: Producto) => void;
  quitar: (id: number) => void;
  total: () => number;
};

export const useCarritoStore = create<Store>((set, get) => ({
  items: [],
  agregar: (p) => set(s => {
    const ex = s.items.find(i => i.id === p.id);
    const items = ex ? s.items.map(i => i.id === p.id ? { ...i, cant: i.cant+1 } : i)
                     : [...s.items, { ...p, cant: 1 }];
    return { items };
  }),
  quitar: (id) => set(s => ({ items: s.items.filter(i => i.id !== id) })),
  total: () => get().items.reduce((t, i) => t + i.precio * i.cant, 0),
}));

// Uso
const { items, agregar } = useCarritoStore();
```

Menos código, sin provider, sin contexto. Zustand es **el** state manager recomendado en 2026 para apps medianas.

---

**Patrones aprendidos**:
- Cleanup siempre en `useEffect` que suscribe a algo (interval, listener, controller)
- Custom hooks: nombre `use*`, extraen patrón reutilizable
- TanStack Query > `useEffect` + `useState` para server state
- Zustand > Context API para estado global complejo
- Protected routes con componente wrapper + `<Navigate>`
