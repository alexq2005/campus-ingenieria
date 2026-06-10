// ============================================================
// TypeScript — Generics y utility types
// ============================================================

// 1. Generic function básica
function identidad<T>(x: T): T {
  return x;
}
const s = identidad<string>('hola');   // string
const n = identidad(42);                // number (inferido)

// 2. Generic con múltiples parámetros
function par<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}
const tupla = par('nombre', 30);        // [string, number]

// 3. Constraint con `extends`
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}
longest('hola', 'chau');                // string
longest([1, 2, 3], [4]);                 // number[]

// 4. Generic types
type Result<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

function handle<T>(r: Result<T>) {
  switch (r.status) {
    case 'loading': return 'Cargando...';
    case 'success': return `Llegó: ${JSON.stringify(r.data)}`;
    case 'error':   return `Error: ${r.error}`;
  }
}

// 5. Utility types
type User = { id: number; nombre: string; edad: number; email?: string };

type UserPartial = Partial<User>;                      // todo opcional
type UserReq     = Required<User>;                      // todo obligatorio
type UserPreview = Pick<User, 'id' | 'nombre'>;         // elegir
type UserPublic  = Omit<User, 'email'>;                 // quitar
type UserRO      = Readonly<User>;                      // inmutable
type UsersById   = Record<number, User>;                // { [id]: User }

// 6. Type de retorno y parámetros
function createUser(nombre: string, edad: number) {
  return { id: Date.now(), nombre, edad };
}
type NewUser = ReturnType<typeof createUser>;
type Args    = Parameters<typeof createUser>;   // [string, number]

// 7. Keyof
type UserKeys = keyof User;   // 'id' | 'nombre' | 'edad' | 'email'

function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const ada: User = { id: 1, nombre: 'Ada', edad: 30 };
const nom: string = getProp(ada, 'nombre');   // TS infiere string

// 8. Conditional types
type NonNullableCustom<T> = T extends null | undefined ? never : T;
type A = NonNullableCustom<string | null>;   // string

// 9. Mapped types
type Optional<T> = { [K in keyof T]?: T[K] };
type UserOpt = Optional<User>;   // === Partial<User>

type Stringify<T> = { [K in keyof T]: string };
type UserStr = Stringify<User>;  // todo a string

// 10. Uso práctico: función fetch tipada
async function fetchJson<T>(url: string): Promise<T> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json() as Promise<T>;
}

// La invocación declara qué tipo esperás:
// const user = await fetchJson<User>('/api/user/1');
// user tiene tipo User automáticamente

console.log({ s, n, tupla, nom });
console.log(handle<User>({ status: 'success', data: ada }));
