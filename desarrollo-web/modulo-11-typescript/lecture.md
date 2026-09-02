# Módulo 11 — TypeScript

> *"Types are documentation that doesn't go stale."*

---

## 🎥 Multimedia

**Videos recomendados** — incluye el canal de Matt Pocock (el mejor en TS del mundo):
[📺 Playlist del módulo 11 →](../multimedia/videos.html#m11)

**Playground oficial** para probar sin instalar nada:
[🎮 TypeScript Playground](https://www.typescriptlang.org/play)

---

## 11.1 ¿Por qué TypeScript?

**TypeScript** (Microsoft, 2012) es JavaScript con tipos estáticos. En 2026, **el 90% de las empresas serias** usan TS para proyectos grandes.

Ventajas:
- **Errores detectados antes de runtime** (en el editor).
- **Autocompletado brutal** (IntelliSense).
- **Refactor seguro** (renombrar un campo actualiza todos los usos).
- **Documentación viva** (los tipos describen la API).

Desventajas:
- Compilador (hay que buildear).
- Curva de aprendizaje.
- A veces peleás con el compilador por tipos complejos.

## 11.2 Setup

```bash
npm install -D typescript
npx tsc --init   # genera tsconfig.json
```

Vite soporta TS out of the box:

```bash
npm create vite@latest mi-app -- --template react-ts
```

### tsconfig.json mínimo

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noUncheckedIndexedAccess": true
  },
  "include": ["src"]
}
```

`"strict": true` activa todas las verificaciones estrictas. **Úsalo siempre**.

## 11.3 Tipos primitivos

```ts
const nombre: string = 'Ada';
const edad: number = 30;
const activo: boolean = true;
const nada: null = null;
const noDef: undefined = undefined;
const big: bigint = 100n;
const sim: symbol = Symbol('id');
```

**En la práctica no escribís tantos tipos explícitos** — TS los **infiere**:

```ts
const nombre = 'Ada';  // TS sabe que es string
```

## 11.4 Arrays y tuplas

```ts
const nums: number[] = [1, 2, 3];
const strs: Array<string> = ['a', 'b'];        // mismo que string[]

// Tupla: array con tamaño y tipos fijos
const punto: [number, number] = [3, 4];
const nombrado: [string, number, boolean] = ['Ada', 30, true];

// Readonly
const inmutable: readonly number[] = [1, 2, 3];
// inmutable.push(4);  // error
```

## 11.5 Objetos y type aliases

```ts
// Tipo inline
const user: { nombre: string; edad: number } = { nombre: 'Ada', edad: 30 };

// Type alias (preferido)
type User = {
  id: number;
  nombre: string;
  edad: number;
  email?: string;      // opcional
  readonly createdAt: Date;  // no se puede reasignar
};

const u: User = { id: 1, nombre: 'Ada', edad: 30, createdAt: new Date() };
```

## 11.6 Interfaces vs Types

```ts
interface Point { x: number; y: number; }
type PointT = { x: number; y: number; };
```

Son casi intercambiables. Diferencias:
- `interface` se puede **extender** y **mergear** (declaration merging).
- `type` puede representar uniones, intersecciones, tipos primitivos.

**Regla 2026**: usá `type` por default. Usá `interface` solo para contratos públicos que van a extenderse.

## 11.7 Union y intersection types

```ts
// Union (A o B)
type ID = string | number;
type Status = 'idle' | 'loading' | 'success' | 'error';  // string literal union

let status: Status = 'idle';
status = 'loading';  // OK
// status = 'foo';   // error

// Intersection (A y B)
type Named = { nombre: string };
type Aged = { edad: number };
type Person = Named & Aged;   // { nombre, edad }
```

## 11.8 Narrowing (estrechar tipos)

```ts
function imprimir(valor: string | number) {
  if (typeof valor === 'string') {
    console.log(valor.toUpperCase()); // TS sabe que es string aquí
  } else {
    console.log(valor.toFixed(2));     // aquí sabe que es number
  }
}
```

Herramientas de narrowing:
- `typeof valor === '...'`
- `valor instanceof Clase`
- `'propiedad' in objeto`
- Type guards custom: `function esUser(x: unknown): x is User { ... }`

## 11.9 Funciones

```ts
// Tipada completamente
function sumar(a: number, b: number): number {
  return a + b;
}

// Arrow
const sumar = (a: number, b: number): number => a + b;

// Parámetros opcionales / defaults
function saludar(nombre: string, edad?: number, saludo = 'Hola') {
  return `${saludo}, ${nombre}${edad ? ` (${edad})` : ''}`;
}

// Rest
function concat(...strs: string[]): string {
  return strs.join('');
}

// Tipo de función
type Callback = (err: Error | null, data?: string) => void;
```

## 11.10 Generics — el arma secreta

Los **generics** permiten escribir código reutilizable con seguridad de tipos:

```ts
function identidad<T>(x: T): T {
  return x;
}

const a = identidad<string>('hola');  // a: string
const b = identidad(42);               // b: number (inferido)

// En funciones reales
function primero<T>(arr: T[]): T | undefined {
  return arr[0];
}

primero([1, 2, 3]);        // number | undefined
primero(['a', 'b']);       // string | undefined

// Múltiples genéricos
function par<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}

// Constraints
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

longest('hola', 'ciao');    // string
longest([1,2,3], [4,5]);    // number[]
```

### Tipos genéricos

```ts
type Box<T> = { valor: T };
const numberBox: Box<number> = { valor: 42 };

type Response<T> = {
  data: T;
  status: number;
  timestamp: number;
};

const r: Response<User[]> = { data: [...], status: 200, timestamp: Date.now() };
```

## 11.11 Utility types built-in

TS trae muchos utility types. Los más usados:

```ts
type User = { id: number; nombre: string; edad: number; email?: string; };

// Partial — todo opcional
type UserPartial = Partial<User>;
// { id?, nombre?, edad?, email? }

// Required — todo obligatorio
type UserRequired = Required<User>;

// Pick — elegir algunas
type UserPreview = Pick<User, 'id' | 'nombre'>;

// Omit — quitar algunas
type UserPublic = Omit<User, 'email'>;

// Readonly
type UserRO = Readonly<User>;

// Record — objeto con claves/valores tipados
type UsersById = Record<number, User>;

// ReturnType, Parameters
function foo(a: string, b: number) { return { a, b }; }
type FooReturn = ReturnType<typeof foo>;      // { a: string; b: number }
type FooParams = Parameters<typeof foo>;      // [string, number]

// Awaited
type Data = Awaited<Promise<User>>;  // User

// NonNullable
type Clean = NonNullable<string | null | undefined>;  // string
```

## 11.12 Enums (usar con criterio)

```ts
enum Rol { ADMIN = 'admin', USER = 'user', GUEST = 'guest' }
const rol: Rol = Rol.ADMIN;

// Preferible en 2026:
const ROL = { ADMIN: 'admin', USER: 'user' } as const;
type Rol = typeof ROL[keyof typeof ROL];
```

Los `enum` tienen comportamiento raro al compilar. La alternativa con `as const` es más predecible.

## 11.13 `unknown` vs `any` vs `never`

```ts
let a: any = 'hola';
a.foo.bar;  // TS no te protege — en runtime puede explotar

let u: unknown = JSON.parse(str);
// u.foo;   // ERROR — hay que narrowing primero
if (typeof u === 'object' && u !== null && 'foo' in u) {
  // ahora sí
}

// never = función que nunca retorna
function throwError(msg: string): never {
  throw new Error(msg);
}
```

**Regla**: evitá `any`. Usá `unknown` cuando no sepas el tipo.

## 11.14 Type assertions (con cuidado)

```ts
const input = document.getElementById('email') as HTMLInputElement;
input.value;

// Alternativa
const input2 = <HTMLInputElement>document.getElementById('email'); // no en JSX
```

Son "confía en mí". Si te equivocás, TS no te protege. Usalas solo cuando sabés más que el compilador.

## 11.15 TypeScript con React

```tsx
type Props = {
  titulo: string;
  count?: number;
  onCount: (n: number) => void;
  children: React.ReactNode;
};

function MiComponente({ titulo, count = 0, onCount, children }: Props) {
  const [n, setN] = useState<number>(count);

  const inputRef = useRef<HTMLInputElement>(null);

  const handler = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  return (
    <div>
      <h1>{titulo}</h1>
      <input ref={inputRef} onChange={handler} />
      {children}
    </div>
  );
}
```

Tipos útiles de React:
- `React.ReactNode` — cualquier cosa renderizable.
- `React.FC<Props>` — componente funcional (algunos prefieren no usarlo).
- `React.ChangeEvent<HTMLInputElement>` — eventos.
- `React.MouseEvent<HTMLButtonElement>` — clicks.
- `React.FormEvent<HTMLFormElement>` — forms.
- `React.Dispatch<React.SetStateAction<T>>` — setter de useState.

## 11.16 Patrones avanzados

### Discriminated unions (patrón de oro)

```ts
type Result<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

function render(r: Result<User[]>) {
  switch (r.status) {
    case 'loading': return <Spinner />;
    case 'success': return <Lista users={r.data} />;   // TS sabe que data existe
    case 'error':   return <Error msg={r.error} />;     // TS sabe que error existe
  }
}
```

### Conditional types

```ts
type IsString<T> = T extends string ? true : false;
type A = IsString<'hola'>;  // true
type B = IsString<42>;       // false
```

### Mapped types

```ts
type Optional<T> = { [K in keyof T]?: T[K] };
// Equivale a Partial<T>
```

## 11.17 Configuración strict mode (tu escudo)

Activá todo en `tsconfig.json`:

```json
"strict": true,                         // incluye los siguientes:
"noImplicitAny": true,
"strictNullChecks": true,
"strictFunctionTypes": true,
"noUncheckedIndexedAccess": true,       // arr[i] devuelve T | undefined
"exactOptionalPropertyTypes": true
```

---

## 🧑‍🎓 Worked Example

> **Ejercicio**: "Tengo una API que devuelve `{ success: true, data: User }` o `{ success: false, error: string }`. ¿Cómo lo tipo?"

**Mi razonamiento:**

1. *¿Union simple o discriminated union?* Si uso `{ success: boolean; data?: User; error?: string }`, TS no sabe correlacionar. ¿Si `success` es `true`, `data` existe? No puede inferirlo.

2. *Solución: discriminated union*. Uso un campo literal (`success: true` vs `success: false`) que divide el tipo en dos ramas.

```ts
type ApiResponse<T> =
  | { success: true;  data: T }
  | { success: false; error: string };
```

3. *Ahora TS puede narrowing*:

```ts
async function fetchUser(id: number): Promise<ApiResponse<User>> {
  const r = await fetch(`/api/users/${id}`);
  if (!r.ok) return { success: false, error: `HTTP ${r.status}` };
  const data = await r.json() as User;
  return { success: true, data };
}

const res = await fetchUser(42);
if (res.success) {
  console.log(res.data.name);     // ✅ TS sabe que data existe
} else {
  console.log(res.error);          // ✅ TS sabe que error existe
}
```

Este patrón (Rust lo llama `Result<T, E>`) es la forma más segura de manejar errores en TS moderno.

## 🧠 Checkpoint Quiz

<details>
<summary><strong>1. ¿Diferencia entre <code>type</code> y <code>interface</code>?</strong></summary>

- **interface** soporta declaration merging (dos interfaces con el mismo nombre se funden).
- **type** puede representar unions, tuplas, primitivas, mapped/conditional types.

Regla 2026: usá `type` por default. `interface` solo para APIs públicas que van a extenderse.
</details>

<details>
<summary><strong>2. ¿Cuándo usar <code>any</code> vs <code>unknown</code>?</strong></summary>

- `any` → **nunca** (salvo migrar legacy). Desactiva el checker.
- `unknown` → "no sé el tipo, y voy a verificar antes de usarlo".

Para JSON.parse, fetches sin tipar, inputs externos → `unknown` + narrowing.
</details>

<details>
<summary><strong>3. ¿Qué hace <code>as const</code>?</strong></summary>

Convierte un array/objeto en tipo **readonly** con tipos literales.

```ts
const ROLES = ['admin', 'user', 'guest'] as const;
type Rol = typeof ROLES[number];  // 'admin' | 'user' | 'guest'
```

Alternativa moderna y más predecible que `enum`.
</details>

<details>
<summary><strong>4. ¿Qué hace <code>Pick&lt;User, 'id' | 'name'&gt;</code>?</strong></summary>

Crea un tipo con **solo** las claves indicadas.

```ts
type User = { id: number; name: string; email: string; password: string };
type UserPreview = Pick<User, 'id' | 'name'>;  // { id: number; name: string }
```

Opuesto: `Omit<User, 'password'>` = todo menos password.
</details>

<details>
<summary><strong>5. ¿Qué significa <code>T extends U</code> en generics?</strong></summary>

Constraint: "T tiene que ser compatible con U" (T puede ser U o un subtipo).

```ts
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}
longest('hola', 'chau');    // ✅ strings tienen .length
longest([1,2], [4,5,6]);    // ✅ arrays también
longest(1, 2);              // ❌ number no tiene .length
```
</details>

---

## Resumen ejecutivo

- TS = JS + tipos. Los tipos desaparecen en runtime.
- `type` o `interface` para definir formas.
- `|` unión, `&` intersección, `?.` opcional.
- `unknown` en vez de `any`.
- Generics para código reutilizable.
- Utility types (`Partial`, `Pick`, `Omit`) todos los días.
- Strict mode desde el día 1.

## Ejemplos

Ver [`examples/`](./examples/):
- `01-tipos-basicos.ts` — primitivos, arrays, funciones.
- `02-generics.ts` — funciones y tipos genéricos.
- `03-react-tipado.tsx` — componentes React con TypeScript.

## Ejercicios

Ver [`exercises.md`](./exercises.md).

---

**Siguiente módulo:** [`12 — Performance, a11y, SEO`](../modulo-12-performance-a11y-seo/)
