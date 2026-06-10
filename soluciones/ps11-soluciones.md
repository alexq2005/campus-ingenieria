# Soluciones — PS11: TypeScript

## Sección A — Tipos básicos

### 1. Tipo Libro + buscarPorEtiqueta

```ts
type Libro = {
  titulo: string;
  autor: string;
  año: number;
  paginas: number;
  etiquetas: string[];
  disponible: boolean;
  editor?: string;   // opcional
};

const libros: Libro[] = [
  { titulo: 'Clean Code', autor: 'Robert Martin', año: 2008, paginas: 464, etiquetas: ['coding', 'clean'], disponible: true },
  { titulo: 'Refactoring', autor: 'Martin Fowler', año: 1999, paginas: 448, etiquetas: ['coding', 'refactor'], disponible: true, editor: 'Addison-Wesley' },
  { titulo: 'Pragmatic Programmer', autor: 'Hunt & Thomas', año: 1999, paginas: 320, etiquetas: ['coding', 'career'], disponible: false },
];

function buscarPorEtiqueta(libros: Libro[], tag: string): Libro[] {
  return libros.filter(l => l.etiquetas.includes(tag));
}
```

### 2. Discriminated union Forma

```ts
type Forma =
  | { tipo: 'circulo'; radio: number }
  | { tipo: 'cuadrado'; lado: number }
  | { tipo: 'triangulo'; base: number; altura: number };

function area(f: Forma): number {
  switch (f.tipo) {
    case 'circulo':   return Math.PI * f.radio ** 2;
    case 'cuadrado':  return f.lado ** 2;
    case 'triangulo': return (f.base * f.altura) / 2;
  }
  // ✅ TS verifica EXHAUSTIVIDAD: si agregás un tipo nuevo, error de compilación aquí.
}
```

Patrón clave: el `switch` sin `default` + `return` en cada case fuerza exhaustividad.

### 3. primero genérico

```ts
function primero<T>(arr: T[]): T | undefined {
  return arr[0];
}

const a: number | undefined = primero([1, 2, 3]);       // TS infiere number
const b: string | undefined = primero(['a', 'b']);      // TS infiere string
```

Con `noUncheckedIndexedAccess: true` en tsconfig, `arr[0]` ya es `T | undefined` automáticamente.

## Sección B — Utility types

### 4. Variantes de User

```ts
type User = {
  id: number;
  nombre: string;
  email: string;
  password: string;
};

type UserPublic = Omit<User, 'password'>;
type UserCreate = Omit<User, 'id'>;
type UserUpdate = Partial<Omit<User, 'id'>> & Pick<User, 'id'>;
// id es obligatorio, todo lo demás opcional
```

### 5. Parameters + ReturnType

```ts
const fn = (x: number, y: string) => ({ x, y });

type FnArgs = Parameters<typeof fn>;    // [number, string]
type FnRet  = ReturnType<typeof fn>;     // { x: number; y: string }
```

## Sección C — Generics

### 6. Pair

```ts
type Pair<A, B> = { first: A; second: B };

const p1: Pair<string, number> = { first: 'Ada', second: 30 };
const p2: Pair<boolean, boolean[]> = { first: true, second: [false, true] };
```

### 7. agrupar

```ts
function agrupar<T, K extends keyof T>(
  items: T[],
  key: K
): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    const k = String(item[key]);
    (acc[k] ??= []).push(item);
    return acc;
  }, {});
}

const users = [
  { nombre: 'Ada', rol: 'admin' },
  { nombre: 'Lin', rol: 'user' },
  { nombre: 'Bob', rol: 'admin' },
];
const porRol = agrupar(users, 'rol');
// { admin: [Ada, Bob], user: [Lin] }
```

### 8. Lazy

```ts
class Lazy<T> {
  #factory: () => T;
  #cached?: T;
  #resolved = false;

  constructor(factory: () => T) {
    this.#factory = factory;
  }

  get value(): T {
    if (!this.#resolved) {
      this.#cached = this.#factory();
      this.#resolved = true;
    }
    return this.#cached as T;
  }
}

const l = new Lazy(() => {
  console.log('Cálculo caro!');
  return 42;
});
l.value;  // Cálculo caro! → 42
l.value;  // 42 (no recalcula)
```

## Sección D — Discriminated unions

### 9. RequestState

```ts
type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };

function render<T>(state: RequestState<T>): string {
  switch (state.status) {
    case 'idle':    return 'Esperando...';
    case 'loading': return 'Cargando...';
    case 'success': return `Datos: ${JSON.stringify(state.data)}`;
    case 'error':   return `Error: ${state.message}`;
  }
}
```

### 10. TodoAction reducer

```ts
type Todo = { id: number; texto: string; done: boolean };
type Action =
  | { type: 'ADD'; texto: string }
  | { type: 'REMOVE'; id: number }
  | { type: 'TOGGLE'; id: number };

function reducer(state: Todo[], action: Action): Todo[] {
  switch (action.type) {
    case 'ADD':
      return [...state, { id: Date.now(), texto: action.texto, done: false }];
    case 'REMOVE':
      return state.filter(t => t.id !== action.id);
    case 'TOGGLE':
      return state.map(t => t.id === action.id ? { ...t, done: !t.done } : t);
  }
}
```

Si agregás `{ type: 'CLEAR' }` a `Action` y no lo manejás en el switch, TS te avisa con un error.

## Sección E — React + TS

### 11. TODO tipado

```tsx
// types.ts
export type Todo = { id: string; texto: string; done: boolean };

// useLocalStorage.ts (genérico)
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) as T : initial;
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
  return [value, setValue] as const;
}

// TodoItem.tsx
type TodoItemProps = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};
export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li className={todo.done ? 'done' : ''}>
      <input type="checkbox" checked={todo.done} onChange={() => onToggle(todo.id)} />
      <span>{todo.texto}</span>
      <button onClick={() => onDelete(todo.id)}>✕</button>
    </li>
  );
}
```

### 12. Select genérico

```tsx
type SelectProps<T> = {
  items: T[];
  value: T | null;
  onChange: (item: T) => void;
  getKey: (item: T) => string | number;
  render: (item: T) => React.ReactNode;
};

export function Select<T>({ items, value, onChange, getKey, render }: SelectProps<T>) {
  return (
    <ul className="select">
      {items.map(item => (
        <li
          key={getKey(item)}
          className={value === item ? 'active' : ''}
          onClick={() => onChange(item)}
        >
          {render(item)}
        </li>
      ))}
    </ul>
  );
}

// Uso:
<Select<User>
  items={users}
  value={selectedUser}
  onChange={setSelectedUser}
  getKey={u => u.id}
  render={u => <><strong>{u.name}</strong> · {u.email}</>}
/>
```

## Sección F — Type gymnastics

### 13. DeepReadonly

```ts
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
};

type Config = {
  server: { host: string; port: number };
  db: { user: string; pwd: string };
};

type RO = DeepReadonly<Config>;
const c: RO = { server: { host: 'x', port: 1 }, db: { user: 'a', pwd: 'b' } };
// c.server.host = 'y';  // ERROR: readonly
```

### 14. DeepPartial

```ts
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
};

const patch: DeepPartial<Config> = {
  server: { port: 8080 }   // OK, host no es requerido
};
```

### 15. Paths de objeto anidado

```ts
type Paths<T, Prefix extends string = ''> = {
  [K in keyof T & string]:
    T[K] extends object
      ? `${Prefix}${K}` | Paths<T[K], `${Prefix}${K}.`>
      : `${Prefix}${K}`
}[keyof T & string];

type P = Paths<{ a: { b: { c: 1 }; d: 2 } }>;
// "a" | "a.b" | "a.b.c" | "a.d"
```

Estos tipos recursivos son avanzados — no necesitás escribirlos todos los días, pero son la base de librerías como `react-hook-form` y `lodash.get` tipados.

## Desafío

### 16. API tipada con chaining

```ts
class Api {
  constructor(private base = '') {}

  async get<T>(path: string): Promise<T> {
    const r = await fetch(this.base + path);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json() as Promise<T>;
  }

  async post<TRes, TBody = unknown>(path: string, body: TBody): Promise<TRes> {
    const r = await fetch(this.base + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json() as Promise<TRes>;
  }

  async delete(path: string): Promise<void> {
    const r = await fetch(this.base + path, { method: 'DELETE' });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
  }
}

const api = new Api('/api');
const users = await api.get<User[]>('/users');
const nuevo = await api.post<User, { name: string }>('/users', { name: 'Ada' });
await api.delete('/users/42');
```

### 17. Expresión algebraica

```ts
type Expr =
  | { kind: 'num'; value: number }
  | { kind: 'add'; left: Expr; right: Expr }
  | { kind: 'mul'; left: Expr; right: Expr };

function evaluar(e: Expr): number {
  switch (e.kind) {
    case 'num': return e.value;
    case 'add': return evaluar(e.left) + evaluar(e.right);
    case 'mul': return evaluar(e.left) * evaluar(e.right);
  }
}

// (3 + 4) * 2
const expr: Expr = {
  kind: 'mul',
  left: { kind: 'add', left: { kind: 'num', value: 3 }, right: { kind: 'num', value: 4 } },
  right: { kind: 'num', value: 2 }
};
evaluar(expr);  // 14
```

---

**Patrones aprendidos**:
- Discriminated unions + exhaustive switch = type safety en pattern matching
- Generics con constraints (`T extends object`) para restringir qué tipos son válidos
- Utility types (`Partial`, `Omit`, `Pick`) resuelven 90% de las transformaciones
- Tipos recursivos (`DeepReadonly`, `Paths`) para casos avanzados
- `as const` convierte arrays/objetos en tuplas/literales inmutables
